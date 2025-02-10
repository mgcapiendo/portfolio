import React from 'react'

const AboutDetails = () => {
   return (
       <section className='py-20 w-full max-w-[1800px] mx-auto px-24 space-y-6'>
           {/* Main Intro */}
           <div className='grid grid-cols-12 gap-6 w-full'>
               <div className='col-span-8 custom-bg px-16 py-12 rounded-2xl flex flex-col justify-between h-80 bg-black/20 backdrop-blur-sm border border-white/10'>
                   <h2 className="text-2xl font-semibold mb-4">Hey! 👋</h2>
                   <div className="space-y-4">
                       <p className="text-lg">Born and raised in West Palm Beach, FL with Filipino roots. I'm a Computer Science student at Florida Atlantic University, but before that I was chasing my Navy dreams in Memphis, TN.</p>
                       <p className="text-lg">Taking a chance on switching to tech turned out to be the best decision ever! Now I'm all in on making an impact and bringing my unique perspective wherever I go.</p>
                   </div>
               </div>
               <div className='col-span-4 flex flex-col gap-6'>
                   <div className='custom-bg px-16 py-8 rounded-2xl flex flex-col items-center justify-center h-[152px] bg-black/20 backdrop-blur-sm border border-white/10'>
                       <span className="text-3xl font-bold mb-2">Manuel "Chok" Capiendo</span>
                       <span className="text-lg">21 Years Old</span>
                       <span className="text-sm text-gray-300">Aspiring Software Engineer</span>
                       
                   </div>
                   <div className='custom-bg px-16 py-8 rounded-2xl flex flex-col items-center justify-center h-[152px] bg-black/20 backdrop-blur-sm border border-white/10'>
                       <span className="text-3xl font-bold mb-2">Stay Determined!</span>
                   </div>
               </div>
           </div>

           {/* Interests & Life */}
           <div className='grid grid-cols-12 gap-6 w-full'>
               <div className='col-span-6 custom-bg px-16 py-12 rounded-2xl flex flex-col h-80 bg-black/20 backdrop-blur-sm border border-white/10'>
                   <h2 className="text-2xl font-semibold mb-4">🌟 What I'm Up To </h2>
                   <div className="space-y-4">
                       <p className="text-gray-300">• Can't get enough fish lately! - (no really where are they)</p>
                       <p className="text-gray-300">• Working on coding</p>
                       <p className="text-gray-300">• Exploring Florida's trails and waterways</p>
                       <p className="text-gray-300">• Lifting hard and running slow - perfectly balanced</p>
                   </div>
               </div>
               <div className='col-span-6 custom-bg px-16 py-12 rounded-2xl flex flex-col h-80 bg-black/20 backdrop-blur-sm border border-white/10'>
                   <h2 className="text-2xl font-semibold mb-4">🎲 Fun Facts About Me</h2>
                   <div className="space-y-4">
                       <p className="text-gray-300">• Huge fan of alligators - Florida's own dinosaurs!</p>
                       <p className="text-gray-300">• Speaking of dinosaurs, Jurassic Park is my all-time favorite movie</p>
                       <p className="text-gray-300">• I am technically a Wilderness Explorer - I collected all the stickers at AK</p>
                       <p className="text-gray-300">• I really like salmon - a lot</p>
                   </div>
               </div>
           </div>

           {/* Bottom Row */}
           <div className='grid grid-cols-12 gap-6 w-full'>
               <div className='col-span-4 custom-bg px-16 py-12 rounded-2xl flex flex-col h-80 bg-black/20 backdrop-blur-sm border border-white/10'>
                   <h2 className="text-2xl font-semibold mb-4">🎯 Current Goals</h2>
                   <ul className="space-y-4">
                       <li className="text-gray-300">• Get super involved with tech and campus events</li>
                       <li className="text-gray-300">• Start my Github and get projected rolling</li>
                       <li className="text-gray-300">• Run the Disney Marathon in 2026 </li>
                       <li className="text-gray-300">• Catch a Peacock Bass</li>
                   </ul>
               </div>
               <div className='col-span-4 custom-bg px-16 py-12 rounded-2xl flex flex-col h-80 bg-black/20 backdrop-blur-sm border border-white/10'>
                   <h2 className="text-2xl font-semibold mb-4">🎮 Gaming & Entertainment</h2>
                   <ul className="space-y-4">
                       <li className="text-gray-300">• Waiting for Jurassic Park Survival</li>
                       <li className="text-gray-300">• Watching Dexter right now </li>
                       <li className="text-gray-300">• Outdoor Boys and some lunch </li>
                       <li className="text-gray-300">• Raves are cool but not fun</li>
                   </ul>
               </div>
               <div className='col-span-4 custom-bg px-16 py-12 rounded-2xl flex flex-col h-80 bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all cursor-pointer'>
                   <a href="https://open.spotify.com/user/uw3vphcr4gs6wmvf75saft86w" target="_blank" rel="noopener noreferrer" className="h-full flex flex-col">
                       <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#1DB954]">
                               <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5523 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.5917 16.5917C16.2843 16.899 15.7157 16.899 15.4083 16.5917C14.8779 16.0613 14.0821 15.4667 13.4083 15.0917C12.7345 14.7167 11.2655 14.7167 10.5917 15.0917C9.91789 15.4667 9.12211 16.0613 8.5917 16.5917C8.28433 16.899 7.71567 16.899 7.4083 16.5917C7.10093 16.2843 7.10093 15.7157 7.4083 15.4083C8.02189 14.7947 8.91789 14.1 9.6917 13.6583C10.4655 13.2167 11.7345 13.2167 12.5083 13.6583C13.2821 14.1 14.1781 14.7947 14.7917 15.4083C15.0991 15.7157 15.0991 16.2843 14.7917 16.5917H16.5917ZM18 13C18 13.5523 17.5523 14 17 14H7C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12H17C17.5523 12 18 12.4477 18 13ZM19 9.5C19 10.0523 18.5523 10.5 18 10.5H6C5.44772 10.5 5 10.0523 5 9.5C5 8.94772 5.44772 8.5 6 8.5H18C18.5523 8.5 19 8.94772 19 9.5Z"/>
                           </svg>
                           🎵 My Music Vibes
                       </h2>
                       <div className="space-y-4 flex-grow">
                           <ul className="space-y-2 text-gray-300">
                               <li>• BETWEEN FRIENDS</li>
                               <li>• beabadoobee</li>
                               <li>• Laufey</li>
                               <li>• The Marias</li>
                           </ul>
                       </div>
                       <span className="text-sm text-gray-400 italic">Click to check out my Spotify →</span>
                   </a>
               </div>
           </div>
       </section>
   )
}

export default AboutDetails