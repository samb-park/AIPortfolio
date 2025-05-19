import { useSidebar } from "@/context/SidebarContext";

export default function MenuButton() {
  const { open, setOpen } = useSidebar();

  return (
    <button
      className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center rounded-lg border-[1.5px] border-gray-500 bg-transparent p-1 text-transparent transition-colors hover:bg-gray-800"
      aria-label="Toggle menu"
      onClick={() => setOpen(!open)}
    >
      <span
        className={`block h-0.5 w-5 bg-gray-500 transition-all duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`}
      ></span>
      <span
        className={`my-1 block h-0.5 w-5 bg-gray-500 transition-all duration-300 ${open ? "opacity-0" : ""}`}
      ></span>
      <span
        className={`block h-0.5 w-5 bg-gray-500 transition-all duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
      ></span>
    </button>
  );
}
