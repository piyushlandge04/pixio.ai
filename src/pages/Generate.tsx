import { FlyerGenerator } from "@/components/FlyerGenerator";
import { Navbar } from "@/components/Navbar";

const Generate = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        <FlyerGenerator />
      </main>
    </div>
  );
};

export default Generate;
