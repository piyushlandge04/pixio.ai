import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlyerGenerator } from "@/components/FlyerGenerator";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Generate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to generate flyers");
      navigate("/auth");
      return;
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background">
      {/* Simplified static background for performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/10 pointer-events-none" />
      
      <Navbar />
      <div className="relative pt-16">
        <FlyerGenerator />
      </div>
    </div>
  );
};

export default Generate;
