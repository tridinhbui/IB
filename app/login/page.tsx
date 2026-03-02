"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Lock, Mail, AlertCircle } from "lucide-react";

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
        <Card className="shadow-2xl shadow-finstep-orange/5 border-finstep-brown/10 bg-white/80 backdrop-blur-sm">
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
                className="w-full font-varela font-bold bg-finstep-orange text-white hover:bg-finstep-brown shadow-lg shadow-finstep-orange/20 hover:shadow-finstep-brown/30 transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-finstep-brown/10">
              <p className="text-xs text-finstep-brown/60 text-center mb-3 font-semibold">
                Demo credentials
              </p>
              <div className="space-y-2">
                {[
                  { email: "demo@ib400.com", pass: "demo1234" },
                  { email: "analyst@ib400.com", pass: "ib400pro" },
                ].map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.pass);
                    }}
                    className="w-full text-left text-xs font-mono px-3 py-2.5 rounded-lg border border-finstep-brown/20 bg-finstep-beige/50 hover:bg-finstep-beige transition-colors text-finstep-brown/70 hover:text-finstep-brown"
                  >
                    {cred.email} / {cred.pass}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
