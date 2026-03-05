"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/useQuizStore";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Zap,
  FlaskConical,
  Sun,
  Moon,
  FileSpreadsheet,
  PieChart,
  Briefcase,
  Search,
  Settings,
} from "lucide-react";
import { FinstepLogo } from "@/components/finstep-logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/corporate-finance", label: "Corporate Finance", icon: FlaskConical },
  { href: "/accounting-hub", label: "Accounting", icon: FileSpreadsheet },
  { href: "/ib", label: "Investment Banking", icon: Briefcase },
  { href: "/asset-management", label: "Asset Management", icon: PieChart },
  { href: "/equity-research", label: "Equity Research", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const { eliteMode, setEliteMode, resetUserData } = useQuizStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="xl:hidden sticky top-0 z-50 glass border-b border-border/40">
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <FinstepLogo size="sm" showText={true} />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-1 mt-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"));
                return (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}

              <Separator className="my-3" />

              <div className="px-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">Elite Mode</span>
                </div>
                <Switch
                  checked={eliteMode}
                  onCheckedChange={setEliteMode}
                />
              </div>

              <div className="px-3 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm">Dark Mode</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>

              <Separator className="my-3" />

              <button
                onClick={() => { resetUserData(); signOut({ callbackUrl: "/login" }); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
