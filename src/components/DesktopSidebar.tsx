"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, PlusCircle, Wallet, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampusConnectLogo } from "./icons";
import { Separator } from "./ui/separator";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/events", icon: Ticket, label: "Events" },
  { href: "/create", icon: PlusCircle, label: "Create Event" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 w-64 bg-card border-r z-50 p-4">
      <div className="flex items-center gap-3 px-2 mb-8">
        <CampusConnectLogo className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-headline text-foreground">CampusConnect</h1>
      </div>

      <nav className="flex-grow flex flex-col">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-colors text-base font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto">
            <Separator className="my-4"/>
             <Link
                href="/settings"
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-colors text-base font-medium",
                    pathname === "/settings"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary hover:text-foreground"
                )}
            >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
            </Link>
        </div>
      </nav>
    </aside>
  );
}
