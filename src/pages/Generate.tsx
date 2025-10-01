import { FlyerGenerator } from "@/components/FlyerGenerator";
import { Navbar } from "@/components/Navbar";

const Generate = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <FlyerGenerator />
      </div>
    </div>
  );
};

export default Generate;
