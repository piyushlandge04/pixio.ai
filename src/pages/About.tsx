import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Users, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-float"></div>
      <div className="fixed bottom-20 right-20 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "4s" }}></div>
      
      <Navbar />
      
      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full mb-4 sm:mb-6 border-2 border-neon-cyan/30 animate-glow-pulse">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan animate-neon-glow" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                About PIYUSH.AI
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Empowering everyone to create stunning flyers with the power of artificial intelligence
            </p>
          </div>

          {/* Mission Section */}
          <Card className="p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 bg-card/80 backdrop-blur-sm border-2 border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.5)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-neon-cyan/30">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-neon-cyan" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Mission</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  At PIYUSH.AI, we believe that great design should be accessible to everyone, 
                  regardless of their technical skills or design experience. Our mission is to 
                  democratize flyer creation by leveraging cutting-edge AI technology.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  We're committed to helping small businesses, event organizers, students, and 
                  creative individuals bring their ideas to life through beautiful, professional 
                  flyers that capture attention and drive results.
                </p>
              </div>
            </div>
          </Card>

          {/* Story Section */}
          <Card className="p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 bg-card/80 backdrop-blur-sm border-2 border-neon-purple/30 hover:border-neon-purple hover:shadow-[0_0_30px_-5px_hsl(var(--neon-purple)/0.5)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-neon-purple/30">
                <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-neon-purple" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Story</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  PIYUSH.AI was born from a simple observation: creating eye-catching flyers 
                  shouldn't require hours of work or expensive design software. We saw how 
                  many talented individuals struggled to promote their events and businesses 
                  simply because they lacked design resources.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  By combining advanced AI image generation with an intuitive interface, 
                  we've made it possible for anyone to create professional-quality flyers 
                  in minutes. What used to take hours now takes seconds, and what used to 
                  cost hundreds of dollars is now accessible to all.
                </p>
              </div>
            </div>
          </Card>

          {/* Values Section */}
          <Card className="p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 bg-card/80 backdrop-blur-sm border-2 border-neon-pink/30 hover:border-neon-pink hover:shadow-[0_0_30px_-5px_hsl(var(--neon-pink)/0.5)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-neon-pink/30">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-neon-pink" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Values</h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Accessibility</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We believe powerful design tools should be available to everyone, 
                      not just professional designers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Innovation</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We continuously push the boundaries of what's possible with AI to 
                      deliver better results for our users.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Simplicity</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Complex technology should have a simple interface. We focus on 
                      making the creation process as intuitive as possible.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Quality</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Every flyer generated through our platform meets professional 
                      standards and is ready for real-world use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Technology Section */}
          <Card className="p-6 sm:p-8 md:p-12 bg-card/80 backdrop-blur-sm border-2 border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/5 via-neon-purple/5 to-neon-pink/5 hover:border-neon-cyan hover:shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.5)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Powered by Advanced AI</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              PIYUSH.AI uses state-of-the-art artificial intelligence models trained on 
              millions of design examples. Our technology understands design principles, 
              color theory, typography, and visual hierarchy to create flyers that not 
              only look great but also effectively communicate your message.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Every prompt you write is enhanced and optimized by our AI to ensure the 
              best possible results. We're constantly improving our models and adding 
              new features to give you even more creative control.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
