'use client';

import Image from "next/image";
import bg from "../../../../public/background/station.png";
import ProjectList from "@/components/projects";
import { projectsData } from "../../data";
import RenderModel from "@/components/RenderModel";
import Staff from "@/components/models/Staff";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Image 
        priority 
        sizes="100vw" 
        src={bg} 
        alt="background-image" 
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-40"
      />

      <div className="flex min-h-screen w-full">
        {/* 3D Model Container - hidden on mobile */}
        <div className="hidden lg:block fixed top-10 -left-24 h-screen">
          <RenderModel>
          </RenderModel>
        </div>

        {/* Projects Container - centered and full width on mobile */}
        <div className="w-full flex justify-center px-4 sm:px-6 md:px-8">
          <ProjectList projects={projectsData} />
        </div>
      </div>
    </main>
  );
}