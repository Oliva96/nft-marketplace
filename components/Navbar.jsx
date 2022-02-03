import React, { useState } from "react";
import Link from "next/link";

export default function NavbarHome() {
  // const [openNavbar, setOpenNavbar] = useState(false);

  return (
    <div className="w-full h-20 grid content-center bg-black fixed">
        <div className="w-full flex items-center justify-between">
          <Link href='./'>
            <span className="flex items-center cursor-pointer text-blue-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl" href="#">
              Metaverse Marketplace
            </span>
          </Link>
          <div className="flex w-1/2 justify-end content-center">
            <Link href='/marketPlace'>
              <button className="inline-block text-2xl font-bold text-blue-400 no-underline focus:text-pink-500 focus:scale-125 hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out">
                Explore
              </button>
            </Link>
            <Link href='/rankings'>
              <button className="inline-block text-2xl font-bold text-blue-400 no-underline focus:text-pink-500 focus:scale-125 hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out">
                Stats
              </button>
            </Link>
            <Link href='/create-item'>
              <button className="inline-block text-2xl font-bold text-blue-400 no-underline focus:text-pink-500 focus:scale-125 hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out">
                Create
              </button>
            </Link>
            <Link href='/my-assets'>
              <button className="inline-block text-2xl font-bold text-blue-400 no-underline focus:text-pink-500 focus:scale-125 hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out">
                Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
  );
}