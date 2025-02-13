import Image from "next/image";
import bg from "../../../../public/background/fart.png";
import RenderModel from "@/components/RenderModel";
import HatModel from "@/components/models/HatModel";
import AboutDetails from "@/components/about";
import dynamic from 'next/dynamic';

const ScrollIndicator = dynamic(() => import('@/components/ScrollIndicator'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Image 
        priority 
        sizes="100vw" 
        src={bg} 
        alt="background-image" 
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-25"
      />

      {/* Fixed position for the 3D model to maintain its placement */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-screen">
          <RenderModel>
            <HatModel />
          </RenderModel>
        </div>
      </div>

      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        <div className="absolute flex flex-col items-center text-center top-[65%] left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4 w-full px-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl text-accent font-bold mb-2 break-words sm:whitespace-nowrap">
            Manuel Capiendo
          </h1>
          <p className="font-light text-foreground text-lg sm:text-xl md:text-2xl whitespace-nowrap">
            Where Creativity Grows
          </p>
        </div>
        <ScrollIndicator />
      </div>

      <AboutDetails />
    </main>
  );
}