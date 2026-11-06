"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, Key } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("admin@tripmaster.in");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#dfbd75]/30">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-[#082F24]">
          Staff Authentication
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your credentials to access the CMS & booking engine.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tripmaster.in"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Secret Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#082F24] hover:bg-[#0c4031] text-[#dfbd75] hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md text-xs uppercase tracking-wider disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In To Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick-fill credentials hint */}
      <div className="mt-6 pt-5 border-t border-slate-100 bg-[#FAF8F5] -mx-8 -mb-8 p-6 rounded-b-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#082F24] mb-2">
          <Key className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Default Master Credentials:</span>
        </div>
        <div className="text-[11px] text-slate-600 space-y-1 font-mono">
          <div>
            Email: <span className="text-[#082F24] font-semibold">admin@tripmaster.in</span>
          </div>
          <div>
            Pass: <span className="text-[#082F24] font-semibold">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06241C] relative px-4 py-12">
      {/* Background visual overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06241C] via-[#06241C]/80 to-transparent" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand emblem */}
        <div className="text-center mb-8">
          <img
            src="/images/logo-white.png"
            alt="TripMaster - Experience Neighbourhood"
            className="h-14 mx-auto object-contain mb-3 drop-shadow-md"
          />
          <p className="text-xs uppercase tracking-[0.25em] text-[#dfbd75] font-semibold mt-1">
            Concierge Management Portal
          </p>
        </div>

        {/* Suspense wrapped login form */}
        <Suspense fallback={<div className="bg-white p-8 rounded-3xl text-center text-sm text-slate-500">Loading portal...</div>}>
          <LoginForm />
        </Suspense>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-300/60 mt-6">
          <ShieldCheck className="w-4 h-4 text-[#dfbd75]" />
          <span>Encrypted Session • Trip Master Internal Systems</span>
        </div>
      </div>
    </div>
  );
}
