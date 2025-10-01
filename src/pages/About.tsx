import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Users, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                About FlyerAI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Empowering everyone to create stunning flyers with the power of artificial intelligence
            </p>
          </div>

          {/* Mission Section */}
          <Card className="p-8 md:p-12 mb-12 border-2 shadow-card animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  At FlyerAI, we believe that great design should be accessible to everyone, 
                  regardless of their technical skills or design experience. Our mission is to 
                  democratize flyer creation by leveraging cutting-edge AI technology.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're committed to helping small businesses, event organizers, students, and 
                  creative individuals bring their ideas to life through beautiful, professional 
                  flyers that capture attention and drive results.
                </p>
              </div>
            </div>
          </Card>

          {/* Story Section */}
          <Card className="p-8 md:p-12 mb-12 border-2 shadow-card animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Rocket className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  FlyerAI was born from a simple observation: creating eye-catching flyers 
                  shouldn't require hours of work or expensive design software. We saw how 
                  many talented individuals struggled to promote their events and businesses 
                  simply because they lacked design resources.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  By combining advanced AI image generation with an intuitive interface, 
                  we've made it possible for anyone to create professional-quality flyers 
                  in minutes. What used to take hours now takes seconds, and what used to 
                  cost hundreds of dollars is now accessible to all.
                </p>
              </div>
            </div>
          </Card>

          {/* Values Section */}
          <Card className="p-8 md:p-12 mb-12 border-2 shadow-card animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Values</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Accessibility</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We believe powerful design tools should be available to everyone, 
                      not just professional designers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Innovation</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We continuously push the boundaries of what's possible with AI to 
                      deliver better results for our users.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Simplicity</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Complex technology should have a simple interface. We focus on 
                      making the creation process as intuitive as possible.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Quality</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Every flyer generated through our platform meets professional 
                      standards and is ready for real-world use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Technology Section */}
          <Card className="p-8 md:p-12 border-2 shadow-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              FlyerAI uses state-of-the-art artificial intelligence models trained on 
              millions of design examples. Our technology understands design principles, 
              color theory, typography, and visual hierarchy to create flyers that not 
              only look great but also effectively communicate your message.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
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
