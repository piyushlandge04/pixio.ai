import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Sparkles, Wand2, Plus, X, FileImage, Image as ImageIcon, Move, Maximize2, Lightbulb } from "lucide-react";
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

export const FlyerGenerator = () => {
  const [prompt, setPrompt] = useState("");
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
      toast.success("Flyer downloaded with logos!");
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
    <div className="min-h-screen py-6 sm:py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-slide-in-up">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full mb-3 sm:mb-4 border border-neon-cyan/30 animate-glow-pulse">
            <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan animate-neon-glow" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            AI Flyer Generator
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Transform your ideas into stunning flyers with the power of AI. Just describe what you need!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Input Section */}
          <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 backdrop-blur-sm bg-card/80 border-2 border-border/50 shadow-[0_0_50px_-12px_hsl(var(--neon-cyan)/0.3)] animate-slide-in-up hover:shadow-[0_0_60px_-12px_hsl(var(--neon-purple)/0.4)] transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-neon-cyan animate-neon-glow" />
                <h3 className="text-lg font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Design Your Flyer</h3>
              </div>
              
              {/* Structured Input Fields */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 rounded-lg border border-neon-cyan/30">
              <div>
                  <label className="text-sm font-medium text-neon-cyan mb-2 block">
                    Event Type <span className="text-neon-pink">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Summer Music Festival, Business Conference, Yoga Retreat"
                    value={promptDetails.eventType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromptDetails({ ...promptDetails, eventType: value });
                      fetchSmartSuggestions(value);
                    }}
                    className="border-2 border-neon-cyan/30 focus:border-neon-cyan focus:ring-neon-cyan/50 focus:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.5)] bg-background/50 transition-all duration-300"
                    disabled={isGenerating}
                  />
                </div>

                {/* AI Smart Suggestions */}
                {(smartSuggestions.length > 0 || isLoadingSuggestions) && (
                  <div className="space-y-2 p-3 bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 rounded-lg border border-neon-purple/40">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-neon-purple" />
                      <span className="text-sm font-semibold text-neon-purple">AI Smart Suggestions</span>
                      {isLoadingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-neon-purple" />}
                    </div>
                    {smartSuggestions.length > 0 && (
                      <div className="grid gap-2">
                        {smartSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setPrompt(suggestion)}
                            disabled={isGenerating}
                            className="text-left text-xs p-2 rounded bg-background/50 hover:bg-neon-purple/20 border border-neon-purple/20 hover:border-neon-purple/50 transition-all disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-neon-purple mb-2 block">
                    Color Scheme
                  </label>
                  <Input
                    placeholder="e.g., Vibrant blues and purples, Warm autumn tones, Black and gold"
                    value={promptDetails.colors}
                    onChange={(e) => setPromptDetails({ ...promptDetails, colors: e.target.value })}
                    className="border-2 border-neon-purple/30 focus:border-neon-purple focus:ring-neon-purple/50 focus:shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.5)] bg-background/50 transition-all duration-300"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neon-pink mb-2 block">
                    Vibe/Mood
                  </label>
                  <Input
                    placeholder="e.g., Energetic and fun, Professional and elegant, Calm and peaceful"
                    value={promptDetails.vibe}
                    onChange={(e) => setPromptDetails({ ...promptDetails, vibe: e.target.value })}
                    className="border-2 border-neon-pink/30 focus:border-neon-pink focus:ring-neon-pink/50 focus:shadow-[0_0_20px_-5px_hsl(var(--neon-pink)/0.5)] bg-background/50 transition-all duration-300"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neon-blue mb-2 block">
                    Key Visual Elements
                  </label>
                  <Input
                    placeholder="e.g., Musical instruments, City skyline, Nature imagery, Abstract patterns"
                    value={promptDetails.keyElements}
                    onChange={(e) => setPromptDetails({ ...promptDetails, keyElements: e.target.value })}
                    className="border-2 border-neon-blue/30 focus:border-neon-blue focus:ring-neon-blue/50 focus:shadow-[0_0_20px_-5px_hsl(var(--neon-blue)/0.5)] bg-background/50 transition-all duration-300"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label className="text-sm font-medium text-neon-cyan mb-2 block">
                  Additional Details (Optional)
                </label>
                <Textarea
                  placeholder="Any other specific requirements or creative ideas..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] text-base resize-none border-2 border-neon-cyan/30 focus:border-neon-cyan focus:ring-neon-cyan/50 focus:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.5)] bg-background/50 transition-all duration-300"
                  disabled={isGenerating}
                />
              </div>

              {/* Tips */}
              <div className="text-xs text-foreground bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 p-3 rounded-lg border border-neon-purple/30">
                <p className="font-semibold mb-1 text-neon-purple">💡 Pro Tips:</p>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Be specific about the event type and target audience</li>
                  <li>Mention preferred color schemes for better results</li>
                  <li>Describe the mood or emotion you want to convey</li>
                  <li>Include any specific visual elements or imagery needed</li>
                </ul>
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-3 block">
                Choose a Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {flyerStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    disabled={isGenerating}
                    className={`p-3 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                      selectedStyle === style.id
                        ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.5)]'
                        : 'border-border/50 hover:border-neon-purple/50 hover:bg-neon-purple/5 bg-background/50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{style.icon}</span>
                      <span className="font-semibold text-sm">{style.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{style.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!promptDetails.eventType && !prompt.trim())}
              size="lg"
              className="w-full text-lg font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.6)] border border-neon-cyan/50 hover:shadow-[0_0_40px_-5px_hsl(var(--neon-purple)/0.7)] transition-all duration-300 hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5 animate-neon-glow" />
                  Generate Flyer
                </>
              )}
            </Button>

            {/* Example Prompts */}
            {relevantPrompts.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neon-purple">
                  {prompt.trim() ? "Related suggestions:" : "Try these examples:"}
                </p>
                <div className="space-y-2">
                  {relevantPrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExamplePrompt(example)}
                      disabled={isGenerating}
                      className="w-full text-left text-sm p-3 rounded-lg bg-neon-purple/10 hover:bg-neon-purple/20 transition-all border border-neon-purple/30 hover:border-neon-purple/50 hover:shadow-[0_0_15px_-5px_hsl(var(--neon-purple)/0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Preview Section */}
          <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/80 border-2 border-border/50 shadow-[0_0_50px_-12px_hsl(var(--neon-purple)/0.3)] animate-slide-in-up hover:shadow-[0_0_60px_-12px_hsl(var(--neon-cyan)/0.4)] transition-all duration-300" style={{ animationDelay: "150ms" }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-neon-purple animate-neon-glow" />
                  Preview
                </h3>
                {generatedImage && !isEditMode && (
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="outline"
                    size="sm"
                    className="border-neon-purple/50 hover:bg-neon-purple/10 hover:border-neon-purple hover:shadow-[0_0_15px_-5px_hsl(var(--neon-purple)/0.5)] transition-all duration-300"
                  >
                    Edit Text
                  </Button>
                )}
              </div>
              
              <div 
                ref={containerRef}
                className="aspect-[3/4] bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 rounded-lg border-2 border-dashed border-neon-cyan/30 overflow-hidden flex items-center justify-center relative hover:border-neon-purple/50 transition-all duration-300"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-neon-cyan mx-auto animate-neon-glow" />
                    <p className="text-muted-foreground font-medium">Creating your flyer...</p>
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
                          selectedLogo === logo.id ? 'ring-2 ring-primary' : ''
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
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 rounded-lg px-3 py-1.5 flex items-center gap-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                resizeLogo(logo.id, -10);
                              }}
                              className="h-6 w-6 p-0 text-white hover:text-neon-cyan"
                            >
                              <Maximize2 className="h-3 w-3 rotate-180" />
                            </Button>
                            <span className="text-xs text-white">
                              <Move className="h-3 w-3" />
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                resizeLogo(logo.id, 10);
                              }}
                              className="h-6 w-6 p-0 text-white hover:text-neon-cyan"
                            >
                              <Maximize2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLogo(logo.id);
                              }}
                              className="h-6 w-6 p-0 text-white hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/20">
                        <div className="absolute top-8 left-0 right-0 px-4 space-y-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded">
                              Headline
                            </label>
                            <input
                              type="text"
                              value={editableText.headline}
                              onChange={(e) => setEditableText({ ...editableText, headline: e.target.value })}
                              className="w-full text-xl font-bold text-white text-center bg-black/60 border-2 border-white/70 rounded px-3 py-2 focus:outline-none focus:border-neon-cyan focus:bg-black/80 transition-all"
                              placeholder="Event Title"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded block">
                                Date
                              </label>
                              <input
                                type="text"
                                value={editableText.date}
                                onChange={(e) => setEditableText({ ...editableText, date: e.target.value })}
                                className="w-full text-sm text-white text-center bg-black/60 border-2 border-white/70 rounded px-2 py-1.5 focus:outline-none focus:border-neon-cyan focus:bg-black/80 transition-all"
                                placeholder="Date"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded block">
                                Time
                              </label>
                              <input
                                type="text"
                                value={editableText.time}
                                onChange={(e) => setEditableText({ ...editableText, time: e.target.value })}
                                className="w-full text-sm text-white text-center bg-black/60 border-2 border-white/70 rounded px-2 py-1.5 focus:outline-none focus:border-neon-cyan focus:bg-black/80 transition-all"
                                placeholder="Time"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded">
                              Location
                            </label>
                            <input
                              type="text"
                              value={editableText.location}
                              onChange={(e) => setEditableText({ ...editableText, location: e.target.value })}
                              className="w-full text-base text-white text-center bg-black/60 border-2 border-white/70 rounded px-3 py-1.5 focus:outline-none focus:border-neon-cyan focus:bg-black/80 transition-all"
                              placeholder="Location"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded">
                              Description
                            </label>
                            <textarea
                              value={editableText.description}
                              onChange={(e) => setEditableText({ ...editableText, description: e.target.value })}
                              className="w-full text-sm text-white text-center bg-black/60 border-2 border-white/70 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:border-neon-cyan focus:bg-black/80 transition-all"
                              placeholder="Description"
                            />
                          </div>
                          
                          <Button
                            onClick={() => setIsEditMode(false)}
                            size="lg"
                            className="w-full mt-2 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.6)] border border-neon-cyan/50 transition-all duration-300"
                          >
                            Done Editing
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <Sparkles className="w-12 h-12 text-neon-cyan/40 mx-auto animate-float" />
                    <p className="text-muted-foreground">
                      Your flyer will appear here
                    </p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="lg"
                  className="w-full font-semibold bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.5)] border border-neon-purple/50 hover:shadow-[0_0_30px_-5px_hsl(var(--neon-pink)/0.6)] transition-all duration-300"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {logoOverlays.length > 0 
                    ? "Download with Logos" 
                    : isEditMode 
                    ? "Download with Edits" 
                    : "Download Flyer"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
