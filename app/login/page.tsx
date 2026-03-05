"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Try demo@ib400.com / demo1234");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-finstep-beige font-nunito p-4 selection:bg-finstep-orange/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-finstep-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-finstep-lightbrown/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <Card className="shadow-2xl shadow-finstep-orange/5 border-finstep-brown/10 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex flex-col items-center justify-center"
            >
              {/* FinStep Logo */}
              <div className="flex flex-col items-end mb-4">
                <div className="w-4 h-4 rounded-full bg-finstep-orange mb-[3px] mr-[3px]" />
                <div className="flex items-end gap-[4px]">
                  <div className="w-3.5 h-6 bg-finstep-orange rounded-sm" />
                  <div className="w-3.5 h-10 bg-finstep-orange rounded-sm" />
                  <div className="w-3.5 h-14 bg-finstep-orange rounded-sm" />
                </div>
              </div>
            </motion.div>

            <div>
              <h1 className="text-3xl font-varela font-bold tracking-tight text-finstep-orange">
                Fin<span className="text-finstep-brown">Step</span>
              </h1>
              <p className="text-sm text-finstep-brown/70 mt-2 font-light">
                Log in to continue your career progress
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-finstep-brown font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-finstep-brown/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="demo@ib400.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 shadow-sm border-finstep-brown/20 focus-visible:ring-finstep-orange text-finstep-brown"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-finstep-brown font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-finstep-brown/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 shadow-sm border-finstep-brown/20 focus-visible:ring-finstep-orange text-finstep-brown"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full font-varela font-bold bg-finstep-orange/10 text-finstep-orange border border-finstep-orange/30 hover:bg-finstep-orange hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-finstep-brown/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#fcf9f4] dark:bg-[#201d1a] px-2 text-finstep-brown/40 font-bold">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" }, { prompt: "select_account" })}
              className="w-full font-varela font-bold border-finstep-brown/10 hover:border-finstep-orange/50 hover:bg-finstep-orange/5 transition-all duration-300 gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-finstep-brown/70 mt-4 font-nunito font-semibold">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-finstep-orange hover:text-finstep-orange/80 transition-colors underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
