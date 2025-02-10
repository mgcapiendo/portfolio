import Image from "next/image";
import bg from "../../../../public/background/fart.png";
import RenderModel from "@/components/RenderModel";
import HatModel from "@/components/models/HatModel";
import AboutDetails from "@/components/about";

export default function Home() {
  return (
    <main className="w-screen max-w-none overflow-x-hidden"> {/* Added these classes */}
      <Image priority sizes="100vw" src={bg} alt="background-image" className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-25"/>

        <div className="w-full h-screen absolute top-1/2 -translate-y-1/2 left-0">
        <RenderModel>
          <HatModel />
        </RenderModel>
        </div>

        <div className="relative w-full h-screen flex flex-col items-center justify-center">
          <div className="absolute flex flex-col items-center text-center top-[65%] left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
            <h1 className="text-9xl text-accent font-bold mb-2 whitespace-nowrap">Manuel Capiendo</h1>
            <p className="font-light text-foreground text-2xl whitespace-nowrap">Where Creativity Grows</p>
          </div>
        </div>

        <AboutDetails />
    </main>
  );
}