"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const links = [
  { href: "/guide", label: "料理方式" },
  { href: "/order", label: "訂購表單" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full flex items-center justify-between">
      <Link
        href="/"
        className="inline-block"
      >
        <Image
          src="/logo-10*6.png"
          alt="logo"
          width={150}
          height={150}
        />
      </Link>

      <LayoutGroup id="main-nav">
        <nav className="flex space-x-2 mt-8 sm:space-x-4">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative inline-flex px-2 pb-2 pt-1 font-medium sm:text-xl sm:px-6",
                  isActive ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="pointer-events-none absolute inset-x-0 bottom-[2px] h-[1px] bg-gray-800"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
    </header>
  );
}
