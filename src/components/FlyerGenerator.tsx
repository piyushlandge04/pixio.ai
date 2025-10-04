import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Sparkles, Wand2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const examplePrompts = [
  "Summer music festival with vibrant colors and energetic design",
  "Professional business conference with modern minimalist style",
  "Garage sale with friendly neighborhood feel and bold text",
  "Yoga retreat with calming nature elements and zen aesthetics",
];

export const FlyerGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
                className="min-h-[180px] text-base resize-none border-2 focus:border-primary transition-colors"
                disabled={isGenerating}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Upload Files (Optional)
              </label>
              <div className="space-y-3">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  disabled={isGenerating}
                />
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border"
                      >
                        <span className="text-sm text-foreground truncate flex-1">
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          disabled={isGenerating}
                          className="h-8 w-8 shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Try these examples:</p>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
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
