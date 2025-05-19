"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { HomeIcon, FolderIcon, EnvelopeIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Projects", path: "/projects", icon: FolderIcon },
  { name: "Experience", path: "/experiences", icon: BriefcaseIcon },
  { name: "Resume", path: "/resume", icon: EnvelopeIcon },
];

export default function Sidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`h-screen overflow-hidden bg-transparent transition-all duration-300 ${open ? "w-64 translate-x-0  border-r-1 border-gray-500" : "w-0 -translate-x-full"} md:translate-x-0 `}
      >
        <div className="flex h-full flex-col p-6">
          <nav className="mt-5 flex flex-col gap-1">
            {menuItems.map((item) => (
              <div key={item.path} className="flex flex-col gap-2">
                <Link
                  href={item.path}
                  className="flex items-center gap-3 rounded-md p-2 text-lg text-white transition-colors hover:bg-gray-800"
                >
                  {pathname === item.path && (
                    <span className="w-1 h-6 bg-blue-500 rounded mr-2 block" />
                  )}
                  <item.icon className="h-6 w-6 text-gray-500" />
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
