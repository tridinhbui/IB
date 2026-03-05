"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuizStore } from "@/store/useQuizStore";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Sun, Moon, ChevronDown, LogOut, Zap, Settings } from "lucide-react";
import { FinstepLogo } from "@/components/finstep-logo";
import { useTheme } from "next-themes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DOMAINS } from "@/lib/navigation/domains";

function isPathActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function isDomainActive(pathname: string | null, domain: (typeof DOMAINS)[0]): boolean {
  return (
    pathname === domain.landingHref ||
    domain.items.some((item) => isPathActive(pathname, item.href))
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { eliteMode, setEliteMode, dbAnalytics, fetchDBAnalytics, fetchAllTechnicalQuestions, resetUserData } = useQuizStore();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const prevUserEmail = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    if (session) {
      const currentEmail = session.user?.email;
      // If a DIFFERENT user has logged in, clear all previous user's data first
      if (prevUserEmail.current !== undefined && prevUserEmail.current !== currentEmail) {
        resetUserData();
      }
      prevUserEmail.current = currentEmail;
      fetchDBAnalytics();
      fetchAllTechnicalQuestions();
    } else {
      // Session gone (signed out), clear data and reset tracking
      prevUserEmail.current = null;
    }
  }, [session, fetchDBAnalytics, fetchAllTechnicalQuestions, resetUserData]);

  return (
    <aside className="flex flex-col w-full bg-finstep-beige/30 h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <FinstepLogo size="md" showText={true} />
        </Link>
      </div>

      <Separator className="opacity-50" />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <Link href="/dashboard">
          <motion.div
            whileHover={{ x: 4 }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-nunito font-semibold transition-all",
              pathname === "/dashboard"
                ? "bg-finstep-orange text-white shadow-md shadow-finstep-orange/20"
                : "text-finstep-brown/70 hover:text-finstep-brown hover:bg-finstep-beige"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </motion.div>
        </Link>

        {DOMAINS.map((domain) => (
          <Collapsible
            key={domain.id}
            defaultOpen={isDomainActive(pathname, domain)}
            className="mt-1"
          >
            <CollapsibleTrigger asChild>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "group flex items-center justify-between gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-nunito font-semibold transition-all cursor-pointer",
                  isDomainActive(pathname, domain)
                    ? "bg-finstep-orange/10 text-finstep-orange dark:text-finstep-orange"
                    : "text-finstep-brown/70 hover:text-finstep-brown hover:bg-finstep-beige"
                )}
              >
                <div className="flex items-center gap-3">
                  <domain.icon className="w-4 h-4" />
                  {domain.label}
                </div>
                <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-finstep-brown/10 pl-3">
                {domain.items.map((item) => {
                  const isActive = isPathActive(pathname, item.href);
                  const isComingSoon = item.label === "Coming Soon";
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ x: 2 }}
                        className={cn(
                          "flex items-center gap-2 px-2 py-2 rounded-md text-xs font-nunito font-semibold transition-all",
                          isActive
                            ? "bg-finstep-orange text-white shadow-md shadow-finstep-orange/20"
                            : "text-finstep-brown/70 hover:text-finstep-brown hover:bg-finstep-beige/50",
                          isComingSoon && "opacity-70"
                        )}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <Separator className="my-3 opacity-20 bg-finstep-brown" />

        <p className="px-3 text-xs font-nunito font-bold text-finstep-brown/60 uppercase tracking-wider mb-2">
          Performance
        </p>

        <div className="px-3 space-y-3 font-nunito">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-finstep-brown/70 font-semibold">Overall Accuracy</span>
              <span className="font-varela font-bold tabular-nums text-finstep-brown">{mounted ? dbAnalytics.overall.overallAccuracy : 0}%</span>
            </div>
            <Progress value={mounted ? dbAnalytics.overall.overallAccuracy : 0} className="h-2 bg-finstep-beige/50 [&>div]:bg-finstep-orange" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-finstep-brown/70 font-semibold">Questions Done</span>
            <span className="font-varela font-bold tabular-nums text-finstep-brown">{mounted ? dbAnalytics.overall.totalQuestionsDone : 0}</span>
          </div>
        </div>

        <Separator className="my-3 opacity-20 bg-finstep-brown" />

        <Link href="/settings">
          <motion.div
            whileHover={{ x: 4 }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-nunito font-semibold transition-all",
              pathname === "/settings"
                ? "bg-finstep-orange text-white shadow-md shadow-finstep-orange/20"
                : "text-finstep-brown/70 hover:text-finstep-brown hover:bg-finstep-beige"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </motion.div>
        </Link>

        <p className="px-3 text-xs font-nunito font-bold text-finstep-brown/60 uppercase tracking-wider mb-2 mt-3">
          Quick Toggles
        </p>

        <div className="px-3 space-y-3 font-nunito">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-finstep-brown">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-sm font-bold">Elite Mode</span>
            </div>
            <Switch
              checked={eliteMode}
              onCheckedChange={setEliteMode}
              className="scale-90 data-[state=checked]:bg-finstep-orange"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-finstep-brown">
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="text-sm font-bold">Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              className="scale-90 data-[state=checked]:bg-finstep-orange"
            />
          </div>
        </div>
      </nav>

      <Separator className="opacity-20 bg-finstep-brown" />

      {session?.user && (
        <div className="p-4 flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-finstep-orange/20 shadow-sm">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-finstep-orange/10 text-finstep-orange font-bold">
              {session.user.name?.[0] || session.user.email?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-finstep-brown truncate">
              {session.user.name || "User"}
            </span>
            <span className="text-[10px] text-finstep-brown/40 font-semibold truncate">
              {session.user.email}
            </span>
          </div>
        </div>
      )}

      <div className="p-3">
        <button
          onClick={() => { resetUserData(); signOut({ callbackUrl: "/login" }); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-nunito font-bold text-finstep-brown/60 hover:text-red-500 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
