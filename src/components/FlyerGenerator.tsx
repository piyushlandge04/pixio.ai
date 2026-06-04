import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Sparkles, Wand2, X, Image as ImageIcon, Move, Maximize2, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";

interface LogoOverlay {
  id: string;
  file: File;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const allExamplePrompts = [
  // Events & Festivals
  "Summer music festival with vibrant colors and energetic design",
  "Professional business conference with modern minimalist style",
  "Yoga retreat with calming nature elements and zen aesthetics",
  "Charity fundraiser gala with elegant gold and black theme",
  "Tech product launch with futuristic neon gradients",
  "Food truck festival with colorful illustrations and fun typography",
  "Cultural Diwali celebration with traditional Indian patterns and lights",
  "Lunar New Year festival with red and gold Asian motifs",
  "Oktoberfest beer festival with Bavarian blue and white checks",
  "Carnival street party with Brazilian colors and samba vibes",
  "Christmas market with cozy winter holiday theme",
  "Halloween costume party with spooky orange and black design",
  
  // Sales & Promotions
  "Garage sale with friendly neighborhood feel and bold text",
  "Black Friday mega sale with striking red and black design",
  "Grand opening celebration with confetti and excitement",
  "Holiday clearance sale with winter theme and snowflakes",
  "End of season fashion sale with trendy modern layout",
  "Restaurant happy hour special with appetizing food imagery",
  "Real estate open house with professional property photos",
  "Car dealership year-end clearance with sleek automotive design",
  "Electronics store discount with tech-inspired graphics",
  "Pharmacy health awareness campaign with medical iconography",
  
  // Education & Workshops
  "Art workshop with creative paint splashes and artistic fonts",
  "Coding bootcamp with tech-inspired geometric patterns",
  "Cooking class with appetizing food photography and warm colors",
  "Photography workshop with camera elements and modern layout",
  "Language learning course with multicultural flags and books",
  "Music lessons with musical notes and instrument illustrations",
  "Dance academy enrollment with dynamic movement and energy",
  "STEM program for kids with colorful science illustrations",
  "Professional development seminar with corporate aesthetic",
  "University open day with academic and campus imagery",
  
  // Health & Wellness
  "Gym membership promotion with energetic fitness imagery",
  "Mental health awareness with soothing pastel colors",
  "Nutrition seminar with fresh vegetables and clean design",
  "Dental clinic checkup reminder with bright smile imagery",
  "Spa and wellness center with zen and relaxation vibes",
  "Blood donation drive with medical red cross symbols",
  "Vaccination clinic with healthcare professional graphics",
  "Weight loss program with motivational before-after concept",
  
  // Community & Social
  "Neighborhood block party with friendly community vibes",
  "Book club meeting with cozy library aesthetics",
  "Pet adoption event with cute animal illustrations",
  "Volunteer recruitment with inspiring community service imagery",
  "Town hall meeting with civic engagement design",
  "Sports league registration with athletic dynamic graphics",
  "Church community gathering with peaceful spiritual elements",
  "Environmental cleanup campaign with green eco-friendly design",
  
  // Entertainment & Arts
  "Movie premiere screening with cinematic Hollywood style",
  "Theater play performance with dramatic stage curtain design",
  "Comedy show night with fun playful typography",
  "Art gallery exhibition with sophisticated minimalist layout",
  "Live concert with bold band poster aesthetics",
  "Stand-up comedy open mic with microphone and spotlight",
  "Film festival with elegant award ceremony design",
  "Poetry slam competition with literary artistic elements",
  
  // Sports & Recreation
  "Marathon race registration with energetic running imagery",
  "Soccer tournament with dynamic sports action graphics",
  "Basketball camp for youth with vibrant court design",
  "Swimming pool opening with refreshing water splash theme",
  "Cycling race event with sleek bicycle illustrations",
  "Tennis championship with professional court aesthetics",
  "Skateboarding competition with urban street art style",
  "Martial arts dojo enrollment with powerful action poses",
  
  // Business & Professional
  "Networking mixer with professional corporate design",
  "Job fair recruitment with career opportunity graphics",
  "Startup pitch competition with innovative tech theme",
  "Leadership summit with executive professional aesthetics",
  "Trade show exhibition with industry-specific imagery",
  "Financial planning seminar with money management icons",
  "Small business expo with entrepreneurial vibrant design",
  "Legal services consultation with trustworthy professional look",
  
  // Food & Dining
  "Restaurant grand opening with delicious cuisine photography",
  "Bakery fresh bread daily with warm artisanal design",
  "Coffee shop loyalty program with cozy cafe aesthetics",
  "Food delivery service with convenient app-style layout",
  "Wine tasting event with elegant vineyard imagery",
  "Pizza place special offer with appetizing Italian theme",
  "Sushi restaurant promotion with Japanese minimalist design",
  "BBQ cookout competition with smoky rustic graphics",
  
  // Travel & Tourism
  "Travel agency vacation package with tropical paradise imagery",
  "Hotel resort special rates with luxury accommodation photos",
  "City tour guide with landmark illustrations",
  "Cruise ship voyage with oceanic nautical theme",
  "Adventure hiking expedition with mountain landscape design",
  "Cultural heritage tour with historical monument graphics",
  "Beach resort summer getaway with sunny coastal vibes",
  "Safari wildlife tour with African animal illustrations",
  
  // Religious & Spiritual
  "Easter service celebration with spring resurrection theme",
  "Ramadan iftar dinner with Islamic crescent moon design",
  "Hanukkah festival of lights with menorah candles",
  "Buddhist meditation retreat with peaceful lotus imagery",
  "Wedding ceremony invitation with romantic elegant design",
  "Baptism celebration with gentle dove and water symbols",
  "Bar Mitzvah celebration with Hebrew cultural elements",
  
  // Technology & Innovation
  "Hackathon coding competition with digital matrix design",
  "AI conference with futuristic machine learning graphics",
  "Cybersecurity workshop with lock and shield iconography",
  "Drone racing championship with high-tech aerial imagery",
  "Gaming tournament with esports competitive aesthetics",
  "Virtual reality expo with immersive 3D design",
  "Robotics competition with mechanical engineering theme",
  "Blockchain summit with cryptocurrency modern layout",
  
  // Fashion & Beauty
  "Fashion show runway with glamorous haute couture design",
  "Beauty salon grand opening with elegant cosmetic imagery",
  "Hair styling competition with creative hairstyle graphics",
  "Makeup workshop with colorful palette illustrations",
  "Bridal boutique wedding dress with romantic white lace",
  "Jewelry store sale with sparkling diamond aesthetics",
  "Vintage clothing market with retro fashion vibes",
  "Barber shop classic cuts with masculine grooming design",
  
  // Kids & Family
  "Children's birthday party with playful balloon decorations",
  "Daycare enrollment with cute cartoon character illustrations",
  "Family fun day with colorful activity icons",
  "Summer camp registration with outdoor adventure graphics",
  "Toddler playgroup with bright educational toy imagery",
  "School fundraiser with cheerful community support design",
  "Baby shower celebration with pastel gentle colors",
  "Storytime library event with whimsical book illustrations",
];

const flyerStyles = [
  { id: 'modern', name: 'Modern', description: 'Clean & contemporary', icon: '✨' },
  { id: 'vibrant', name: 'Vibrant', description: 'Bold & energetic', icon: '🎨' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated & refined', icon: '👑' },
  { id: 'creative', name: 'Creative', description: 'Artistic & unique', icon: '🎭' },
  { id: 'minimal', name: 'Minimal', description: 'Simple & clean', icon: '⚡' },
  { id: 'bold', name: 'Bold', description: 'Powerful & striking', icon: '💥' },
];

import { useSearchParams } from "react-router-dom";

export const FlyerGenerator = () => {
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [isEditMode, setIsEditMode] = useState(false);
  const [logoOverlays, setLogoOverlays] = useState<LogoOverlay[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editableText, setEditableText] = useState({
    headline: "Your Event Title",
    date: "January 1, 2025",
    time: "7:00 PM",
    location: "Event Location",
    description: "Add your event description here"
  });
  const [promptDetails, setPromptDetails] = useState({
    eventType: "",
    colors: "",
    vibe: "",
    keyElements: ""
  });
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Fetch AI-powered smart suggestions
  const fetchSmartSuggestions = useCallback(
    debounce(async (eventType: string) => {
      if (!eventType || eventType.length < 3) {
        setSmartSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase.functions.invoke('generate-flyer', {
          body: { prompt: eventType, action: 'suggest' },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (!error && data?.suggestions) {
          setSmartSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 800),
    []
  );

  // Filter example prompts based on current input
  const getRelevantPrompts = () => {
    if (!prompt.trim()) {
      return allExamplePrompts.slice(0, 4);
    }
    
    const searchTerms = prompt.toLowerCase().split(' ');
    const scored = allExamplePrompts.map(example => {
      const exampleLower = example.toLowerCase();
      const score = searchTerms.reduce((acc, term) => {
        return acc + (exampleLower.includes(term) ? 1 : 0);
      }, 0);
      return { example, score };
    });
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.example);
  };

  const relevantPrompts = getRelevantPrompts();

  const handleGenerate = async () => {
    // Build comprehensive prompt from structured fields
    const structuredPrompt = `
      Event Type: ${promptDetails.eventType || 'event'}
      ${promptDetails.colors ? `Color Scheme: ${promptDetails.colors}` : ''}
      ${promptDetails.vibe ? `Vibe/Mood: ${promptDetails.vibe}` : ''}
      ${promptDetails.keyElements ? `Key Elements: ${promptDetails.keyElements}` : ''}
      ${prompt ? `Additional Details: ${prompt}` : ''}
    `.trim();

    if (!promptDetails.eventType && !prompt.trim()) {
      toast.error("Please describe your flyer or select event type");
      return;
    }

    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to generate flyers");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-flyer', {
        body: { prompt: structuredPrompt, style: selectedStyle },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        
        // Save to history
        const { error: historyError } = await supabase
          .from("flyer_history")
          .insert({
            user_id: session.user.id,
            prompt: structuredPrompt,
            style: selectedStyle,
            image_url: data.imageUrl,
          });

        if (historyError) {
          console.error("Error saving to history:", historyError);
        }

        toast.success("Flyer generated successfully!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error: any) {
      console.error('Error generating flyer:', error);
      toast.error(error.message || "Failed to generate flyer");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Add text overlays if in edit mode
      if (isEditMode) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        
        ctx.strokeText(editableText.headline, canvas.width / 2, 100);
        ctx.fillText(editableText.headline, canvas.width / 2, 100);
        
        ctx.font = '32px Arial';
        ctx.strokeText(`${editableText.date} | ${editableText.time}`, canvas.width / 2, 160);
        ctx.fillText(`${editableText.date} | ${editableText.time}`, canvas.width / 2, 160);
        
        ctx.strokeText(editableText.location, canvas.width / 2, 200);
        ctx.fillText(editableText.location, canvas.width / 2, 200);
        
        ctx.font = '24px Arial';
        const words = editableText.description.split(' ');
        let line = '';
        let y = 250;
        words.forEach((word) => {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width - 100 && line !== '') {
            ctx.strokeText(line, canvas.width / 2, y);
            ctx.fillText(line, canvas.width / 2, y);
            line = word + ' ';
            y += 35;
          } else {
            line = testLine;
          }
        });
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
      }
      
      // Add logo overlays
      for (const logo of logoOverlays) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          logoImg.onload = () => {
            const x = (logo.x / 100) * canvas.width;
            const y = (logo.y / 100) * canvas.height;
            const width = (logo.width / 100) * canvas.width;
            const height = (logo.height / 100) * canvas.height;
            ctx.drawImage(logoImg, x, y, width, height);
            resolve(true);
          };
          logoImg.src = logo.url;
        });
      }
      
      const link = document.createElement('a');
      link.download = `flyer-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("Flyer downloaded!");
    };
    
    img.src = generatedImage;
  };

  const useExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  const removeLogo = (id: string) => {
    const logo = logoOverlays.find((l) => l.id === id);
    if (logo) {
      URL.revokeObjectURL(logo.url);
    }
    setLogoOverlays((prev) => prev.filter((l) => l.id !== id));
    setSelectedLogo(null);
  };

  const handleLogoMouseDown = (e: React.MouseEvent, logoId: string) => {
    e.stopPropagation();
    setSelectedLogo(logoId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedLogo || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;

    setLogoOverlays((prev) =>
      prev.map((logo) =>
        logo.id === selectedLogo
          ? { ...logo, x: Math.max(0, Math.min(100 - logo.width / 10, x)) , y: Math.max(0, Math.min(100 - logo.height / 10, y)) }
          : logo
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resizeLogo = (logoId: string, delta: number) => {
    setLogoOverlays((prev) =>
      prev.map((logo) =>
        logo.id === logoId
          ? {
              ...logo,
              width: Math.max(50, Math.min(300, logo.width + delta)),
              height: Math.max(50, Math.min(300, logo.height + delta)),
            }
          : logo
      )
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-background">
      {/* Premium subtle background meshes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-30 -right-30 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-30 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI flyer designer v2</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
            Generate Stunning Flyers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your event and watch AI instantly design a premium, high-converting flyer.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Input Section - 7 Columns on Large Screens */}
          <Card className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-card border border-border shadow-sm rounded-2xl animate-slide-in-up">
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border/80">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Design Details</h3>
                  <p className="text-xs text-muted-foreground">Describe your design preferences below</p>
                </div>
              </div>
              
              {/* Structured Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-foreground/90">
                      Event Type
                    </label>
                    <span className="text-accent text-xs font-medium">*required</span>
                  </div>
                  <Input
                    placeholder="e.g., Summer Music Festival, Business Conference, Yoga Retreat"
                    value={promptDetails.eventType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromptDetails({ ...promptDetails, eventType: value });
                      fetchSmartSuggestions(value);
                    }}
                    className="h-11 border-border focus-visible:ring-primary bg-background/50 rounded-xl"
                    disabled={isGenerating}
                  />
                </div>

                {/* AI Suggestions Box */}
                {(smartSuggestions.length > 0 || isLoadingSuggestions) && (
                  <div className="space-y-3 p-4 bg-secondary/50 rounded-xl border border-border animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-primary/10 text-primary">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">AI Prompt Suggestions</span>
                      {isLoadingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-primary ml-auto" />}
                    </div>
                    {smartSuggestions.length > 0 && (
                      <div className="grid gap-1.5">
                        {smartSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setPrompt(suggestion)}
                            disabled={isGenerating}
                            className="text-left text-xs p-2.5 rounded-lg bg-background hover:bg-primary/5 border border-border hover:border-primary/30 transition-colors disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground/90 mb-1.5 block">
                      Color Scheme
                    </label>
                    <Input
                      placeholder="e.g., Blues and purples, Black and gold"
                      value={promptDetails.colors}
                      onChange={(e) => setPromptDetails({ ...promptDetails, colors: e.target.value })}
                      className="h-11 border-border focus-visible:ring-primary bg-background/50 rounded-xl"
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground/90 mb-1.5 block">
                      Vibe / Mood
                    </label>
                    <Input
                      placeholder="e.g., Energetic, Professional, Calm"
                      value={promptDetails.vibe}
                      onChange={(e) => setPromptDetails({ ...promptDetails, vibe: e.target.value })}
                      className="h-11 border-border focus-visible:ring-primary bg-background/50 rounded-xl"
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground/90 mb-1.5 block">
                    Key Visual Elements
                  </label>
                  <Input
                    placeholder="e.g., Musical instruments, City skyline, Nature imagery"
                    value={promptDetails.keyElements}
                    onChange={(e) => setPromptDetails({ ...promptDetails, keyElements: e.target.value })}
                    className="h-11 border-border focus-visible:ring-primary bg-background/50 rounded-xl"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground/90 mb-1.5 block">
                    Additional Details (Optional)
                  </label>
                  <Textarea
                    placeholder="Provide any other text content, sponsor names, or style cues..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[90px] text-sm resize-none border-border focus-visible:ring-primary bg-background/50 rounded-xl"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/90 block">
                Choose a Design Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {flyerStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    disabled={isGenerating}
                    className={`p-3.5 rounded-xl border transition-all text-left ${
                      selectedStyle === style.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/40 hover:bg-secondary/40 bg-background/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{style.icon}</span>
                      <span className="font-semibold text-xs text-foreground">{style.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-snug block">{style.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!promptDetails.eventType && !prompt.trim())}
              size="lg"
              className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl transition-all shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Flyer (Estimated 30s)...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Flyer Design
                </>
              )}
            </Button>

            {/* Examples list */}
            {relevantPrompts.length > 0 && !smartSuggestions.length && (
              <div className="space-y-2 pt-1 border-t border-border/50">
                <p className="text-xs font-semibold text-muted-foreground">
                  {prompt.trim() ? "💡 Related Ideas:" : "✨ Sample Prompts:"}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {relevantPrompts.slice(0, 4).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExamplePrompt(example)}
                      disabled={isGenerating}
                      className="text-left text-xs p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-colors disabled:opacity-50 line-clamp-2"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Preview Section - 5 Columns */}
          <Card className="lg:col-span-5 p-6 bg-card border border-border shadow-sm rounded-2xl lg:sticky lg:top-24 animate-slide-in-up">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Preview Canvas</h3>
                    <p className="text-xs text-muted-foreground font-medium">Visual output</p>
                  </div>
                </div>
                {generatedImage && !isEditMode && (
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-secondary rounded-lg text-xs"
                  >
                    Overlay Text
                  </Button>
                )}
              </div>
              
              <div 
                ref={containerRef}
                className="aspect-[3/4] bg-secondary/35 rounded-xl border border-dashed border-border/80 overflow-hidden flex items-center justify-center relative hover:border-primary/30 transition-colors"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {isGenerating ? (
                  <div className="text-center space-y-4 animate-fade-in">
                    <div className="relative flex justify-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">Drafting Flyer...</p>
                      <p className="text-muted-foreground text-xs">AI is compositing elements</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <>
                    <img
                      src={generatedImage}
                      alt="Generated flyer"
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Logo Overlays */}
                    {logoOverlays.map((logo) => (
                      <div
                        key={logo.id}
                        className={`absolute cursor-move group ${
                          selectedLogo === logo.id ? 'ring-1 ring-primary' : ''
                        }`}
                        style={{
                          left: `${logo.x}%`,
                          top: `${logo.y}%`,
                          width: `${logo.width}px`,
                          height: `${logo.height}px`,
                        }}
                        onMouseDown={(e) => handleLogoMouseDown(e, logo.id)}
                      >
                        <img
                          src={logo.url}
                          alt="Logo overlay"
                          className="w-full h-full object-contain pointer-events-none"
                        />
                        {selectedLogo === logo.id && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-border shadow-md rounded-lg p-1 flex items-center gap-1.5 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  resizeLogo(logo.id, -10);
                              }}
                              className="h-6 w-6 p-0 hover:bg-secondary"
                            >
                              <Maximize2 className="h-3.5 w-3.5 rotate-180 text-foreground" />
                            </Button>
                            <span className="text-[10px] text-muted-foreground">
                              <Move className="h-3 w-3 inline mr-0.5" /> Move
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  resizeLogo(logo.id, 10);
                              }}
                              className="h-6 w-6 p-0 hover:bg-secondary"
                            >
                              <Maximize2 className="h-3.5 w-3.5 text-foreground" />
                            </Button>
                            <div className="w-[1px] h-4 bg-border" />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  removeLogo(logo.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Text overlays editing */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="space-y-4 max-w-sm mx-auto pt-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground/85">
                              Headline
                            </label>
                            <Input
                              type="text"
                              value={editableText.headline}
                              onChange={(e) => setEditableText({ ...editableText, headline: e.target.value })}
                              className="w-full text-sm font-semibold bg-background"
                              placeholder="Event Title"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-foreground/85">
                                Date
                              </label>
                              <Input
                                type="text"
                                value={editableText.date}
                                onChange={(e) => setEditableText({ ...editableText, date: e.target.value })}
                                className="w-full text-xs bg-background"
                                placeholder="Date"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-foreground/85">
                                Time
                              </label>
                              <Input
                                type="text"
                                value={editableText.time}
                                onChange={(e) => setEditableText({ ...editableText, time: e.target.value })}
                                className="w-full text-xs bg-background"
                                placeholder="Time"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground/85">
                              Location
                            </label>
                            <Input
                              type="text"
                              value={editableText.location}
                              onChange={(e) => setEditableText({ ...editableText, location: e.target.value })}
                              className="w-full text-sm bg-background"
                              placeholder="Location"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground/85">
                              Description
                            </label>
                            <Textarea
                              value={editableText.description}
                              onChange={(e) => setEditableText({ ...editableText, description: e.target.value })}
                              className="w-full text-xs h-16 bg-background resize-none"
                              placeholder="Description"
                            />
                          </div>
                          
                          <Button
                            onClick={() => setIsEditMode(false)}
                            size="sm"
                            className="w-full bg-primary text-primary-foreground font-semibold h-9 rounded-lg"
                          >
                            Done Editing
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-3 p-8 animate-fade-in">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto border border-primary/10">
                      <Sparkles className="w-6 h-6 text-primary/45" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">No flyer generated</p>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px] mx-auto">
                        Fill out details on the left to see the generated design.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {generatedImage && (
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full h-11 text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {logoOverlays.length > 0 
                    ? "Download with Logos" 
                    : isEditMode 
                    ? "Download with Edits" 
                    : "Download Flyer Image"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
