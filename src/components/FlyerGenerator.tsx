import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Sparkles, Wand2, Plus, X, FileImage } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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

export const FlyerGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-flyer', {
        body: { prompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
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

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `flyer-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Flyer downloaded!");
  };

  const useExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI Flyer Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning flyers with the power of AI. Just describe what you need!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 space-y-6 shadow-card border-2 animate-in fade-in slide-in-from-left duration-700">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Describe Your Flyer
              </label>
              <Textarea
                placeholder="e.g., Create a modern flyer for a tech startup launch event with blue and purple colors, featuring futuristic graphics..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] text-base resize-none border-2 focus:border-primary transition-colors"
                disabled={isGenerating}
              />
            </div>

            {/* File Upload with Plus Icon */}
            <div className="space-y-3">
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 pl-3 pr-2 py-2 bg-muted rounded-full border border-border group hover:border-primary transition-colors"
                    >
                      <FileImage className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground max-w-[120px] truncate">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        disabled={isGenerating}
                        className="h-6 w-6 rounded-full hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  disabled={isGenerating}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isGenerating}
                  className="h-10 w-10 rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Add images or documents
                </span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              size="lg"
              className="w-full text-lg font-semibold shadow-glow hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Flyer
                </>
              )}
            </Button>

            {/* Example Prompts */}
            {relevantPrompts.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  {prompt.trim() ? "Related suggestions:" : "Try these examples:"}
                </p>
                <div className="space-y-2">
                  {relevantPrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExamplePrompt(example)}
                      disabled={isGenerating}
                      className="w-full text-left text-sm p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Preview Section */}
          <Card className="p-6 shadow-card border-2 animate-in fade-in slide-in-from-right duration-700">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Preview</h3>
              
              <div className="aspect-[3/4] bg-muted/30 rounded-lg border-2 border-dashed border-border overflow-hidden flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground font-medium">Creating your flyer...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated flyer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <Sparkles className="w-12 h-12 text-muted-foreground/40 mx-auto" />
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
                  className="w-full font-semibold"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Flyer
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
