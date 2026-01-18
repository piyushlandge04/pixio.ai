import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Users, Rocket } from "lucide-react";
import { memo } from "react";

// Memoized section component
const AboutSection = memo(({ icon: Icon, title, children, colorClass }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  colorClass: string;
}) => (
  <Card className={`p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 bg-card border-2 ${colorClass}`}>
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{title}</h2>
        {children}
      </div>
    </div>
  </Card>
));

AboutSection.displayName = "AboutSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary/10 rounded-full mb-4 sm:mb-6 border border-primary/30">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                About PIYUSH.AI
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Empowering everyone to create stunning flyers with the power of artificial intelligence
            </p>
          </div>

          {/* Mission Section */}
          <AboutSection icon={Target} title="Our Mission" colorClass="border-primary/30">
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
          </AboutSection>

          {/* Story Section */}
          <AboutSection icon={Rocket} title="Our Story" colorClass="border-secondary/30">
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
          </AboutSection>

          {/* Values Section */}
          <AboutSection icon={Users} title="Our Values" colorClass="border-accent/30">
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
          </AboutSection>

          {/* Technology Section */}
          <Card className="p-6 sm:p-8 md:p-12 bg-card border-2 border-primary/30">
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
