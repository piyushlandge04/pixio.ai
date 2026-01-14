import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, style = 'modern', action = 'generate' } = await req.json();
    
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
      console.log('Generating smart suggestions for:', prompt);
      
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
    console.log('Generating flyer with prompt:', prompt, 'style:', style);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    console.log('Calling Lovable AI for image generation with enhanced prompt');
    
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
      console.error('No image URL in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Failed to extract image from AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Successfully generated image with Lovable AI');

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-flyer function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
