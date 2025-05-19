"use client";
import Link from "next/link";
import React from "react";
import MenuButton from "./Sidebar/MenuButton";

export default function Header() {  

  return (
    <header className="w-full flex justify-between p-5 border-b border-gray-500">
      <MenuButton />
      <div className="text-2xl font-bold">
        <Link href="/">SANGBONG PARK</Link>
      </div>
    </header>
  );
}