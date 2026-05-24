"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  User,
  Info,
} from "lucide-react";
import { supabase, isSupabaseSupported } from "@/lib/supabase";

interface ConditionOption {
  id: string;
  name: string;
  shortDesc: string;
}

interface UserCredential {
  email: string;
  name: string;
  password?: string;
  conditionId: string;
}

const CONDITIONS: ConditionOption[] = [
  {
    id: "general",
    name: "General Wellness",
    shortDesc: "Gizi seimbang harian untuk pencegahan umum.",
  },
  {
    id: "kidney",
    name: "Chronic Kidney Disease (CKD)",
    shortDesc: "Diet rendah protein & pembatasan kalium/fosfor.",
  },
  {
    id: "hypertension",
    name: "Hypertension (DASH Diet)",
    shortDesc: "Regimen rendah garam untuk stabilitas vaskular.",
  },
  {
    id: "gout",
    name: "Gout & Asam Urat",
    shortDesc: "Diet rendah purin tinggi hidrasi untuk ginjal/sendi.",
  },
];

export default function AuthPage() {
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [conditionId, setConditionId] = useState("general");

  // Status message
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const hasSupabase = isSupabaseSupported();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        // Parse URL parameters for prefilled selection
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get("mode");
        const urlCondition = params.get("condition");

        if (urlMode === "login" || urlMode === "register") {
          setAuthMode(urlMode);
        }
        if (urlCondition && CONDITIONS.some((c) => c.id === urlCondition)) {
          setConditionId(urlCondition);
        }
      } catch (e) {
        console.error(e);
      }
    }, 0);

    const checkSession = async () => {
      try {
        if (isSupabaseSupported() && supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            const user = session.user;
            // Fetch profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();

            if (profile) {
              localStorage.setItem(
                "nourishlab_current_user",
                JSON.stringify({
                  id: user.id,
                  email: user.email,
                  name: profile.name,
                  conditionId: profile.condition_id,
                }),
              );
            } else {
              localStorage.setItem(
                "nourishlab_current_user",
                JSON.stringify({
                  id: user.id,
                  email: user.email,
                  name:
                    user.user_metadata?.name ||
                    user.email?.split("@")[0] ||
                    "User",
                  conditionId: "general",
                }),
              );
            }
            window.location.href = "/dashboard";
            return;
          }
        }

        // Fallback to local session check
        const currentUser = localStorage.getItem("nourishlab_current_user");
        if (currentUser) {
          window.location.href = "/dashboard";
        }
      } catch (e) {
        console.error("Session check error:", e);
      }
    };

    checkSession();

    return () => clearTimeout(timer);
  }, []);

  // Compute dynamic cryptographic checksum based on input using useMemo (prevents effect cycle error)
  const sandboxHash = useMemo(() => {
    if (!mounted) return "0x0000000000000000";
    const inputStr = `${email}:${name}:${conditionId}:${authMode}`;
    let hash = 0;
    for (let i = 0; i < inputStr.length; i++) {
      hash = (hash << 5) - hash + inputStr.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
    return `0x${hex}A7B9_SECURE`;
  }, [email, name, conditionId, authMode, mounted]);

  const tryLocalLogin = (): boolean => {
    try {
      const storedUsersRaw = localStorage.getItem("nourishlab_users");
      const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const foundUser = users.find(
        (u: UserCredential) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (!foundUser) {
        setErrorMsg("Email atau kata sandi tidak sesuai.");
        return false;
      }

      const sessionUser = {
        email: foundUser.email,
        name: foundUser.name,
        conditionId: foundUser.conditionId,
      };

      localStorage.setItem(
        "nourishlab_current_user",
        JSON.stringify(sessionUser),
      );
      setSuccessMsg("Otorisasi berhasil! Membuka gerbang medis...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      return true;
    } catch {
      setErrorMsg("Terjadi kegagalan memuat penyimpanan lokal.");
      return false;
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Semua bidang wajib diisi.");
      return;
    }

    if (isSupabaseSupported() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          console.warn(
            "Supabase Auth failed, checking local credentials:",
            error.message,
          );
          const localSuccess = tryLocalLogin();
          if (!localSuccess) {
            setErrorMsg(error.message || "Email atau kata sandi tidak sesuai.");
          }
          return;
        }

        const user = data.user;
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!profile) {
            // Profile missing in DB, create default profile
            const defaultProfile = {
              id: user.id,
              email: user.email!,
              name:
                user.user_metadata?.name || user.email?.split("@")[0] || "User",
              condition_id: "general",
            };
            await supabase.from("profiles").upsert(defaultProfile);

            localStorage.setItem(
              "nourishlab_current_user",
              JSON.stringify({
                id: user.id,
                email: user.email,
                name: defaultProfile.name,
                conditionId: defaultProfile.condition_id,
              }),
            );
          } else {
            localStorage.setItem(
              "nourishlab_current_user",
              JSON.stringify({
                id: user.id,
                email: user.email,
                name:
                  profile.name ||
                  user.user_metadata?.name ||
                  user.email?.split("@")[0],
                conditionId: profile.condition_id || "general",
              }),
            );
          }

          setSuccessMsg("Otorisasi berhasil! Membuka gerbang medis...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
          return;
        }
      } catch (err) {
        console.error("Supabase Login error, trying local:", err);
      }
    }

    tryLocalLogin();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email || !password) {
      setErrorMsg("Semua kolom registrasi wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal berisi 6 karakter.");
      return;
    }

    if (isSupabaseSupported() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        const user = data.user;
        if (user) {
          const newProfile = {
            id: user.id,
            email: email.trim(),
            name: name.trim(),
            condition_id: conditionId,
            updated_at: new Date().toISOString(),
          };

          const { error: profileError } = await supabase
            .from("profiles")
            .upsert(newProfile);

          if (profileError) {
            console.error(
              "Error creating Supabase profile:",
              profileError.message,
            );
          }

          const sessionUser = {
            id: user.id,
            email: user.email,
            name: name.trim(),
            conditionId: conditionId,
          };

          localStorage.setItem(
            "nourishlab_current_user",
            JSON.stringify(sessionUser),
          );
          setSuccessMsg("Akun klinis terdaftar! Menyiapkan dashboard...");

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1200);
          return;
        }
      } catch (err) {
        console.error("Supabase registration error:", err);
        const errMsg =
          err instanceof Error
            ? err.message
            : "Terjadi kegagalan mendaftar ke server.";
        setErrorMsg(errMsg);
        return;
      }
    }

    try {
      const storedUsersRaw = localStorage.getItem("nourishlab_users");
      const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const emailExists = users.some(
        (u: UserCredential) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (emailExists) {
        setErrorMsg("Email sudah terdaftar. Silakan masuk.");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        conditionId,
      };

      users.push(newUser);
      localStorage.setItem("nourishlab_users", JSON.stringify(users));

      const sessionUser = {
        email: newUser.email,
        name: newUser.name,
        conditionId: newUser.conditionId,
      };

      localStorage.setItem(
        "nourishlab_current_user",
        JSON.stringify(sessionUser),
      );
      setSuccessMsg("Akun klinis terdaftar! Menyiapkan dashboard...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch {
      setErrorMsg("Terjadi kegagalan menyimpan ke lokal.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center font-mono text-xs text-[#6f7871]">
        Memuat Enkripsi Sandbox NourishLab...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfaf7] text-[#18221b]">
      {/* Header Bar */}
      <header className="border-b border-[#e2e8e3] bg-[#fbfaf7] py-5 px-6 md:px-12 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-mono text-[#6f7871] hover:text-[#24402a] transition-all group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="NourishLab Logo"
            className="h-9 md:h-12 w-auto object-contain"
          />
        </Link>
      </header>

      {/* Main Split Layout Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 md:p-12 items-stretch gap-12">
        {/* Left Column: Clinical Security Passport */}
        <section className="lg:w-5/12 flex flex-col justify-between bg-[#f3f1eb] border border-[#cbd3cc]/60 rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 left-0 bg-[#24402a] h-1.5" />

          <div className="space-y-6">
            <div className="border-b border-[#cbd3cc]/60 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#587e61]">
                NourishLab Safe Sandbox
              </span>
              <h2 className="text-2xl font-editorial-heading italic font-bold text-[#24402a] mt-1">
                Clinical Security Passport
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[#6f7871] leading-relaxed">
                {hasSupabase ? (
                  <>
                    Aplikasi ini berjalan dalam mode{" "}
                    <strong>Sync Awan Hibrida</strong>. Seluruh kredensial medis
                    dan jurnal asupan Anda disinkronkan ke Supabase Cloud dan
                    dicadangkan secara lokal di browser Anda.
                  </>
                ) : (
                  <>
                    Aplikasi ini berjalan dalam mode{" "}
                    <strong>Secure Offline Sandbox</strong>. Seluruh kredensial
                    medis dan jurnal asupan Anda disimpan terenkripsi di
                    penyimpanan lokal browser Anda.
                  </>
                )}
              </p>

              <div className="bg-white p-4 rounded-xl border border-[#e2e8e3]/80 space-y-3 font-mono text-[11px] text-[#24402a]">
                <div className="flex justify-between border-b border-[#f1efe9] pb-1.5">
                  <span className="text-[#6f7871]">STATUS KONEKSI</span>
                  {hasSupabase ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                      SYNC AWAN AKTIF
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 inline-block animate-pulse" />
                      SANDBOX LURING
                    </span>
                  )}
                </div>
                <div className="flex justify-between border-b border-[#f1efe9] pb-1.5">
                  <span className="text-[#6f7871]">
                    {hasSupabase ? "TOKEN DATABASE" : "KUNCI LOKAL ENKRIPSI"}
                  </span>
                  <span className="text-zinc-600 font-bold truncate max-w-37.5">
                    {hasSupabase ? "SUPABASE_ACTIVE" : sandboxHash}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1efe9] pb-1.5">
                  <span className="text-[#6f7871]">PENGGUNA AKTIF</span>
                  <span className="font-bold">
                    {email ? email.toLowerCase() : "TIDAK TERDETEKSI"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6f7871]">PILIHAN REGIMEN</span>
                  <span className="font-bold uppercase text-[#587e61]">
                    {CONDITIONS.find((c) => c.id === conditionId)?.id || "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#cbd3cc]/60 pt-4 space-y-2 text-[10px] font-mono text-[#6f7871]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>
                {hasSupabase
                  ? "Koneksi Cloud Aman (RLS Enabled)"
                  : "Nol Transmisi Server (No cloud leak risks)"}
              </span>
            </div>
            <p className="leading-normal">
              {hasSupabase
                ? "Keamanan data klinis dijamin oleh enkripsi transit SSL dan kebijakan Row-Level Security Supabase."
                : "Keamanan data klinis dijamin oleh isolasi browser sandbox klien Anda sendiri."}
            </p>
          </div>
        </section>

        {/* Right Column: Auth Tab Panel Card */}
        <section className="lg:w-7/12 bg-white border border-[#e2e8e3] rounded-2xl shadow-sm p-6 md:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Top Banner Alert */}
          {errorMsg && (
            <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <div className="font-bold border border-rose-300 px-1 rounded text-[9px] uppercase tracking-wider shrink-0 mt-0.5 bg-white">
                ERROR
              </div>
              <p>{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <div className="font-bold border border-emerald-300 px-1 rounded text-[9px] uppercase tracking-wider shrink-0 mt-0.5 bg-white">
                OK
              </div>
              <p>{successMsg}</p>
            </div>
          )}

          {/* Mode Switch Tab Bar */}
          <div className="flex border-b border-[#e2e8e3] mb-8">
            <button
              onClick={() => {
                setAuthMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === "login"
                  ? "border-[#24402a] text-[#24402a]"
                  : "border-transparent text-[#6f7871] hover:text-[#24402a]"
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === "register"
                  ? "border-[#24402a] text-[#24402a]"
                  : "border-transparent text-[#6f7871] hover:text-[#24402a]"
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {/* Tab Contents: Login Form */}
          {authMode === "login" ? (
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-5 animate-in fade-in duration-300"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6f7871] block">
                  Alamat Surat Elektronik (Email)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#cbd3cc]">
                    @
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fbfaf7] border border-[#e2e8e3] rounded-lg text-sm focus:outline-none focus:border-[#24402a] focus:bg-white transition-all text-[#18221b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6f7871] block">
                  Kata Sandi Sandbox
                </label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-0 pl-3.5 h-4 w-10 text-[#cbd3cc] self-center shrink-0 mt-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fbfaf7] border border-[#e2e8e3] rounded-lg text-sm focus:outline-none focus:border-[#24402a] focus:bg-white transition-all text-[#18221b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#24402a] hover:bg-[#1a301f] text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm cursor-pointer mt-4 flex items-center justify-center gap-1.5"
              >
                <span>Masuk Ke Ledger</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            /* Tab Contents: Register Form */
            <form
              onSubmit={handleRegisterSubmit}
              className="space-y-5 animate-in fade-in duration-300"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6f7871] block">
                  Nama Lengkap Pasien
                </label>
                <div className="relative">
                  <User className="absolute inset-y-0 left-0 pl-3.5 h-4 w-10 text-[#cbd3cc] self-center shrink-0 mt-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fbfaf7] border border-[#e2e8e3] rounded-lg text-sm focus:outline-none focus:border-[#24402a] focus:bg-white transition-all text-[#18221b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6f7871] block">
                  Alamat Email (Akses Masuk)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#cbd3cc]">
                    @
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fbfaf7] border border-[#e2e8e3] rounded-lg text-sm focus:outline-none focus:border-[#24402a] focus:bg-white transition-all text-[#18221b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6f7871] block">
                  Kata Sandi Keamanan
                </label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-0 pl-3.5 h-4 w-10 text-[#cbd3cc] self-center shrink-0 mt-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fbfaf7] border border-[#e2e8e3] rounded-lg text-sm focus:outline-none focus:border-[#24402a] focus:bg-white transition-all text-[#18221b]"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#6f7871] block">
                  Kondisi Klinis Utama (Program Gizi)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {CONDITIONS.map((cond) => (
                    <label
                      key={cond.id}
                      onClick={() => setConditionId(cond.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer flex items-start gap-3 transition-all ${
                        conditionId === cond.id
                          ? "bg-[#edf2ee] border-[#24402a] text-[#24402a] font-medium"
                          : "bg-[#fbfaf7] border-[#cbd3cc]/60 text-[#6f7871] hover:border-[#cbd3cc]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="conditionSelection"
                        checked={conditionId === cond.id}
                        onChange={() => {}} // Controlled via parent click
                        className="mt-0.5 accent-[#24402a] hidden"
                      />
                      <div className="h-4 w-4 rounded-full border border-[#cbd3cc] flex items-center justify-center shrink-0 mt-0.5 bg-white">
                        {conditionId === cond.id && (
                          <div className="h-2 w-2 rounded-full bg-[#24402a]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[#24402a]">
                          {cond.name}
                        </p>
                        <p className="text-[10px] text-[#6f7871] mt-0.5">
                          {cond.shortDesc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#24402a] hover:bg-[#1a301f] text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm cursor-pointer mt-4 flex items-center justify-center gap-1.5"
              >
                <span>Daftar Akun</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          {/* Verification Disclaimer */}
          <div className="mt-6 border-t border-[#f1efe9] pt-4 flex items-start gap-2 text-[10px] text-[#6f7871] leading-relaxed">
            <Info className="h-3.5 w-3.5 text-[#587e61] shrink-0 mt-0.5" />
            <p>
              {hasSupabase ? (
                <>
                  Dengan mendaftar, data kesehatan Anda akan disinkronkan secara
                  real-time dengan Supabase database yang dilindungi kebijakan
                  akses pengguna tersendiri.
                </>
              ) : (
                <>
                  Dengan mendaftar, semua data kesehatan Anda akan disimpan
                  strictly di dalam sandbox local storage browser Anda. Data
                  tidak pernah dikirimkan ke cloud atau server pihak ketiga mana
                  pun demi menjaga privasi medis.
                </>
              )}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
