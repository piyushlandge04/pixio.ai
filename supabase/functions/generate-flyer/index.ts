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
    const { prompt, style = 'modern' } = await req.json();
    console.log('Generating flyer with prompt:', prompt, 'style:', style);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Style-specific enhancements
    const styleGuides: Record<string, string> = {
      modern: 'ultra-modern design with clean lines, minimalist aesthetic, bold sans-serif typography, geometric shapes, striking color gradients, and contemporary visual hierarchy',
      vibrant: 'highly vibrant and energetic design with bold saturated colors, dynamic compositions, playful typography, exciting visual elements, high contrast, and attention-grabbing graphics',
      elegant: 'sophisticated elegant design with refined color palette, classic serif fonts, luxurious feel, subtle textures, balanced white space, and timeless professional aesthetics',
      creative: 'highly creative artistic design with unique illustrations, hand-drawn elements, experimental typography, unconventional layouts, artistic flair, and innovative visual concepts',
      minimal: 'ultra-minimalist design with maximum white space, simple clean typography, limited color palette (2-3 colors max), focused messaging, and zen-like simplicity',
      bold: 'bold impactful design with large dramatic typography, strong contrasts, powerful imagery, commanding presence, eye-catching headlines, and memorable visual impact'
    };

    const styleGuide = styleGuides[style] || styleGuides.modern;

    // Enhanced prompt for creative flyer generation
    const enhancedPrompt = `Create a stunning, professional flyer design with these specifications: ${prompt}.

STYLE DIRECTION: ${styleGuide}

DESIGN REQUIREMENTS:
- Format: Vertical/portrait orientation (ideal for printing and digital sharing)
- Layout: Well-balanced composition with clear visual hierarchy
- Typography: Professional font choices that match the style and enhance readability
- Color scheme: Carefully selected colors that evoke the right emotion and brand identity
- Graphics: Include relevant high-quality imagery, illustrations, or icons that complement the theme
- White space: Strategic use of negative space for better visual flow
- Focal points: Clear emphasis on key information (headlines, dates, CTAs)
- Print-ready: High resolution, suitable for both digital display and physical printing

Make it visually stunning, memorable, and effective at communicating its message!`;

    console.log('Calling Lovable AI with enhanced prompt');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate flyer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Received response from AI');

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
