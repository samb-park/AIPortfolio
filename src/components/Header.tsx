"use client";
import Link from "next/link";
import React from "react";
import MenuButton from "./Sidebar/MenuButton";

export default function Header() {  

  return (
    <header className="w-full flex justify-between items-center p-5 border-b border-gray-500">
      <MenuButton />
      <div className="flex flex-col items-center gap-1">
        <div className="text-2xl font-bold">
          <Link href="/">SANGBONG PARK</Link>
        </div>
        <a
          href="mailto:sangbong.park@outlook.com"
          className="text-xs text-gray-500 hover:underline"
        >
          sangbong.park@outlook.com
        </a>
      </div>
    </header>
  );
}