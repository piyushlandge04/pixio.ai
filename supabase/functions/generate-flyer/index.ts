import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid styles for flyer generation
const VALID_STYLES = ['modern', 'vibrant', 'elegant', 'creative', 'minimal', 'bold'] as const;
type ValidStyle = typeof VALID_STYLES[number];

// Input validation constants
const MIN_PROMPT_LENGTH = 3;
const MAX_PROMPT_LENGTH = 1000;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

// Sanitize user input to prevent injection attacks
const sanitizePrompt = (prompt: string): string => {
  return prompt
    .trim()
    .replace(/[<>]/g, '') // Remove HTML-like characters
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .slice(0, MAX_PROMPT_LENGTH);
};

// Validate prompt content
const validatePrompt = (prompt: unknown): { valid: boolean; error?: string; sanitized?: string } => {
  if (typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt must be a string' };
  }

  const trimmed = prompt.trim();
  
  if (trimmed.length < MIN_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters` };
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters` };
  }

  const sanitized = sanitizePrompt(trimmed);
  return { valid: true, sanitized };
};

// Validate style parameter
const validateStyle = (style: unknown): { valid: boolean; error?: string; value?: ValidStyle } => {
  if (style === undefined || style === null) {
    return { valid: true, value: 'modern' };
  }

  if (typeof style !== 'string') {
    return { valid: false, error: 'Style must be a string' };
  }

  if (!VALID_STYLES.includes(style as ValidStyle)) {
    return { valid: false, error: `Invalid style. Must be one of: ${VALID_STYLES.join(', ')}` };
  }

  return { valid: true, value: style as ValidStyle };
};

// Validate action parameter
const validateAction = (action: unknown): { valid: boolean; error?: string; value?: string } => {
  if (action === undefined || action === null) {
    return { valid: true, value: 'generate' };
  }

  if (typeof action !== 'string') {
    return { valid: false, error: 'Action must be a string' };
  }

  const validActions = ['generate', 'suggest'];
  if (!validActions.includes(action)) {
    return { valid: false, error: `Invalid action. Must be one of: ${validActions.join(', ')}` };
  }

  return { valid: true, value: action };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication header exists
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client and validate JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Validate JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;
    console.log('Authenticated user:', userId);

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt: rawPrompt, style: rawStyle, action: rawAction } = requestBody;

    // Validate action
    const actionValidation = validateAction(rawAction);
    if (!actionValidation.valid) {
      return new Response(
        JSON.stringify({ error: actionValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const action = actionValidation.value!;

    // Validate style
    const styleValidation = validateStyle(rawStyle);
    if (!styleValidation.valid) {
      return new Response(
        JSON.stringify({ error: styleValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const style = styleValidation.value!;

    // Validate and sanitize prompt
    const promptValidation = validatePrompt(rawPrompt);
    if (!promptValidation.valid) {
      return new Response(
        JSON.stringify({ error: promptValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const prompt = promptValidation.sanitized!;

    // Rate limiting check using flyer_history table
    const rateLimitTime = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count: recentRequestCount, error: countError } = await supabaseClient
      .from('flyer_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', rateLimitTime);

    if (countError) {
      console.error('Rate limit check failed:', countError);
      // Continue anyway - don't block user due to rate limit check failure
    } else if (recentRequestCount && recentRequestCount >= RATE_LIMIT_MAX_REQUESTS) {
      console.warn(`Rate limit exceeded for user ${userId}: ${recentRequestCount} requests in last minute`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment before generating more flyers.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle smart suggestions
    if (action === 'suggest') {
      console.log('Generating smart suggestions for user:', userId, 'prompt:', prompt.substring(0, 50));
      
      const suggestionResponse = await fetch(
        'https://ai.gateway.lovable.dev/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              {
                role: 'system',
                content: 'You are a creative flyer design assistant. Generate 4 unique, specific flyer design suggestions based on the user input. Each suggestion should be detailed and actionable. Return ONLY a JSON array of 4 strings, no other text.'
              },
              {
                role: 'user',
                content: `Generate 4 creative flyer design suggestions for: "${prompt}". Include specific visual elements, color schemes, and design styles. Return as JSON array.`
              }
            ]
          }),
        }
      );

      if (!suggestionResponse.ok) {
        const errorText = await suggestionResponse.text();
        console.error('Suggestion API error:', suggestionResponse.status, errorText);
        return new Response(
          JSON.stringify({ suggestions: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const suggestionData = await suggestionResponse.json();
      const content = suggestionData.choices?.[0]?.message?.content || '[]';
      
      try {
        // Extract JSON array from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        return new Response(
          JSON.stringify({ suggestions: suggestions.slice(0, 4) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch {
        console.error('Failed to parse suggestions:', content);
        return new Response(
          JSON.stringify({ suggestions: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle image generation
    console.log('Generating flyer for user:', userId, 'prompt:', prompt.substring(0, 50), 'style:', style);

    // Enhanced style guides with more detailed instructions for better quality
    const styleGuides: Record<string, string> = {
      modern: 'sleek contemporary design with bold sans-serif typography, geometric shapes, clean lines, and a sophisticated color palette',
      vibrant: 'high-energy design with saturated bold colors, dynamic diagonal compositions, eye-catching gradients, and playful typography',
      elegant: 'luxurious sophisticated design with serif typography, refined gold/silver accents, subtle textures, and premium color palette',
      creative: 'artistic experimental design with hand-drawn elements, unique illustrations, mixed media textures, and unconventional layouts',
      minimal: 'ultra-clean minimalist design with generous white space, simple typography, limited color palette, and focused visual hierarchy',
      bold: 'high-impact powerful design with oversized typography, stark contrasts, dramatic compositions, and attention-grabbing elements'
    };

    const styleGuide = styleGuides[style] || styleGuides.modern;

    // Professional enhanced prompt for maximum quality
    const enhancedPrompt = `Create a stunning professional marketing flyer with ${styleGuide}. 
    
The flyer should feature: ${prompt}

Design requirements:
- Portrait/vertical orientation (3:4 aspect ratio)
- Clear visual hierarchy with headline, subheadline, and details areas
- Professional-grade composition and layout
- High-contrast readable text areas
- Cohesive color scheme throughout
- Ultra high resolution, print-ready quality
- Modern graphic design principles
- Eye-catching but not cluttered`;

    console.log('Calling Lovable AI for image generation');
    
    const aiResponse = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-image-preview',
          messages: [
            {
              role: 'user',
              content: enhancedPrompt
            }
          ],
          modalities: ['image', 'text']
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await aiResponse.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image URL in response');
      return new Response(
        JSON.stringify({ error: 'Failed to extract image from AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Successfully generated image for user:', userId);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-flyer function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
