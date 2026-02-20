"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/useQuizStore";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  GripVertical,
  BarChart3,
  LogOut,
  Zap,
  Calculator,
  Building2,
  Scale,
  Percent,
  DollarSign,
  FlaskConical,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { Section } from "@/types/question";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quiz", label: "Quiz Engine", icon: BookOpen },
  { href: "/accounting-drag", label: "Drag & Drop", icon: GripVertical },
  { href: "/simulation", label: "3-Statement Sim", icon: FlaskConical },
  { href: "/dcf", label: "DCF Model", icon: Calculator },
];

const sections: { label: Section; icon: typeof Calculator }[] = [
  { label: "Accounting", icon: Calculator },
  { label: "EV vs Equity Value", icon: Building2 },
  { label: "Valuation", icon: DollarSign },
  { label: "M&A", icon: Scale },
  { label: "LBO", icon: BarChart3 },
  { label: "Accretion/Dilution", icon: Percent },
  { label: "Fit & Behavioral", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { eliteMode, setEliteMode, progress, getAccuracy } = useQuizStore();
  const accuracy = getAccuracy();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-card/60 glass h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">IB400</h1>
            <p className="text-xs text-muted-foreground">Pro Trainer</p>
          </div>
        </Link>
      </div>

      <Separator className="opacity-50" />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}

        <Separator className="my-3 opacity-50" />

        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Sections
        </p>

        {sections.map((section) => {
          const stats = progress.sectionStats[section.label];
          const sectionAcc =
            stats && stats.total > 0
              ? Math.round((stats.correct / stats.total) * 100)
              : null;

          return (
            <div
              key={section.label}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-3.5 h-3.5" />
                <span className="text-xs">{section.label}</span>
              </div>
              {sectionAcc !== null && (
                <Badge
                  variant={sectionAcc >= 75 ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {sectionAcc}%
                </Badge>
              )}
            </div>
          );
        })}

        <Separator className="my-3 opacity-50" />

        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Performance
        </p>

        <div className="px-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Overall Accuracy</span>
              <span className="font-semibold">{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Questions Done</span>
            <span className="font-semibold">{progress.totalCompleted}</span>
          </div>
        </div>

        <Separator className="my-3 opacity-50" />

        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Settings
        </p>

        <div className="px-3 space-y-3">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-medium">Elite Mode</span>
            </div>
            <Switch
              checked={eliteMode}
              onCheckedChange={setEliteMode}
              className="scale-90"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              className="scale-90"
            />
          </div>
        </div>
      </nav>

      <Separator className="opacity-50" />

      <div className="p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
