"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Info,
  Layers,
  Droplet,
} from "lucide-react";

interface ConditionInfo {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  badgeColor: string;
  textColor: string;
  bgColor: string;
  focusText: string;
  limits: string[];
  tips: string[];
}

const CONDITIONS_INFO: ConditionInfo[] = [
  {
    id: "kidney",
    name: "Chronic Kidney Disease (CKD)",
    shortName: "CKD",
    subtitle: "Asuhan Gizi Rendah Protein & Elektrolit Terkendali",
    badgeColor: "bg-amber-100 border-amber-200 text-amber-800",
    textColor: "text-amber-900",
    bgColor: "bg-[#fdf9f3]",
    focusText:
      "Membatasi beban urea ginjal dengan memantau asupan protein harian (0.6g/kg) serta mengendalikan asupan kalium dan fosfor secara ketat.",
    limits: [
      "Protein: ~0.6g / kg Berat Badan",
      "Sodium: < 1800 mg / hari",
      "Batasi tinggi Kalium & Fosfor",
    ],
    tips: [
      "Pilih putih telur & tahu porsi kecil",
      "Batasi alpukat, pisang & kentang",
      "Monitor kelebihan cairan (edema)",
    ],
  },
  {
    id: "hypertension",
    name: "Hypertension (DASH Diet)",
    shortName: "DASH",
    subtitle: "Rencana Gizi Rendah Garam untuk Stabilitas Vaskular",
    badgeColor: "bg-emerald-100 border-emerald-200 text-emerald-800",
    textColor: "text-emerald-955",
    bgColor: "bg-[#f5faf6]",
    focusText:
      "Mengadopsi pendekatan Dietary Approaches to Stop Hypertension dengan batasan natrium yang ketat dan asupan kalium alami.",
    limits: [
      "Sodium: < 1400 mg / hari",
      "Kaya Kalium, Kalsium & Magnesium",
      "Serat Tinggi dari Gandum Utuh",
    ],
    tips: [
      "Gunakan rempah pengganti garam dapur",
      "Konsumsi pisang & sayur hijau",
      "Ukur tensi secara berkala pagi/sore",
    ],
  },
  {
    id: "gout",
    name: "Gout & Asam Urat",
    shortName: "Gout",
    subtitle: "Ledger Asupan Rendah Purin & Pelacak Hidrasi",
    badgeColor: "bg-rose-100 border-rose-200 text-rose-800",
    textColor: "text-rose-900",
    bgColor: "bg-[#fef7f6]",
    focusText:
      "Mencegah peradangan sendi akut dengan meminimalkan makanan tinggi purin serta merangsang ekskresi asam urat via hidrasi.",
    limits: [
      "Purin: Batasi sangat ketat",
      "Hidrasi: Target > 3000 ml / hari",
      "Batasi alkohol & fruktosa manis",
    ],
    tips: [
      "Hindari jeroan, emping, & kerang",
      "Minum air putih minimal 3 liter/hari",
      "Konsumsi ceri & vitamin C alami",
    ],
  },
  {
    id: "general",
    name: "General Wellness",
    shortName: "General",
    subtitle: "Gizi Seimbang untuk Pemeliharaan Kesehatan Umum",
    badgeColor: "bg-zinc-100 border-zinc-200 text-zinc-800",
    textColor: "text-zinc-900",
    bgColor: "bg-[#f9f9f8]",
    focusText:
      "Panduan asupan gizi makro seimbang dan pola hidup sehat untuk pengguna tanpa kondisi klinis khusus.",
    limits: [
      "Protein: ~1.0g / kg Berat Badan",
      "Sodium: < 2000 mg / hari",
      "Kalori: Sesuai tingkat aktivitas",
    ],
    tips: [
      "Makan sayur & buah 5 porsi sehari",
      "Batasi konsumsi gula & gorengan",
      "Aktivitas fisik sedang 30 menit",
    ],
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  // UI States
  const [activeConditionTab, setActiveConditionTab] = useState("kidney");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    try {
      // Check current user session
      const currentUser = localStorage.getItem("nourishlab_current_user");
      if (currentUser) {
        window.location.href = "/dashboard";
      }
    } catch (e) {
      console.error(e);
    }
    return () => clearTimeout(timer);
  }, []);

  const selectConditionForRegistration = (id: string) => {
    window.location.href = `/login?mode=register&condition=${id}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center font-mono text-xs text-[#6f7871]">
        Loading NourishLab...
      </div>
    );
  }

  const selectedConditionDetail = CONDITIONS_INFO.find(
    (c) => c.id === activeConditionTab,
  )!;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfaf7]">
      {/* Top Editorial Bar */}
      <header className="border-b border-[#e2e8e3] bg-[#fbfaf7] py-5 px-6 md:px-12 flex justify-between items-center z-10">
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
        <div className="flex items-center gap-4 text-xs font-mono text-[#6f7871]">
          <span className="hidden sm:inline-flex items-center gap-1 bg-[#edf2ee] px-2.5 py-1 rounded text-[10px] text-[#24402a] border border-[#cbd3cc]">
            <ShieldCheck className="h-3 w-3" /> SECURE SANDBOX
          </span>
          <a
            href="/login?mode=login"
            className="px-4 py-2 border border-[#cbd3cc] hover:bg-[#edf2ee] text-[#24402a] rounded-lg font-semibold transition-all hover:border-[#24402a]"
          >
            Login
          </a>
        </div>
      </header>

      {/* Main Hero & Split Layout */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Taglines */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block border-y border-[#cbd3cc] py-1 mb-2">
              <p className="text-xs font-mono uppercase tracking-widest text-[#587e61]">
                Buku Catatan Nutrisi Klinis Mandiri
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-editorial-heading italic font-bold tracking-tight leading-tight text-[#24402a]">
              Regimen Gizi Mandiri yang Presisi & Luring.
            </h1>

            <p className="text-[#6f7871] text-sm md:text-base max-w-2xl leading-relaxed">
              NourishLab adalah ledger nutrisi klinis luring (offline-first)
              yang dirancang khusus untuk asuhan diet terapeutik mandiri. Lacak
              sodium, protein, kalium, dan cairan harian Anda secara terisolasi
              tanpa khawatir tentang kebocoran data medis.
            </p>

            {/* Quick Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e2e8e3] max-w-3xl">
              <div className="flex gap-3">
                <span className="h-8 w-8 bg-[#edf2ee] rounded-full flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4 text-[#24402a]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#24402a]">
                    Pemantauan Target Klinis
                  </p>
                  <p className="text-[11px] text-[#6f7871] mt-0.5">
                    Metrik spesifik sesuai anjuran klinis CKD, DASH, & Asam
                    Urat.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="h-8 w-8 bg-[#edf2ee] rounded-full flex items-center justify-center shrink-0">
                  <Droplet className="h-4 w-4 text-blue-500" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#24402a]">
                    Ledger Cairan & Hidrasi
                  </p>
                  <p className="text-[11px] text-[#6f7871] mt-0.5">
                    Kontrol volume hidrasi ketat untuk penderita edema ginjal &
                    gout.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="h-8 w-8 bg-[#edf2ee] rounded-full flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4 text-amber-600" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#24402a]">
                    Analisis Lab Kimiawi
                  </p>
                  <p className="text-[11px] text-[#6f7871] mt-0.5">
                    Visualisasi tren kadar ureum, kreatinin, kalium, dan asam
                    urat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clinical Conditions Interactive Section */}
      <section className="bg-[#f3f1eb] border-y border-[#e2e8e3] py-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#587e61]">
              Kondisi Medis & Program Asuhan Gizi
            </span>
            <h2 className="text-3xl font-editorial-heading italic font-bold text-[#24402a]">
              Dirancang untuk Diet Terapeutik Spesifik
            </h2>
            <p className="text-xs text-[#6f7871] max-w-xl mx-auto">
              NourishLab menyesuaikan target makronutrien, mikronutrien
              (natrium), asupan cairan harian, serta visualisasi peringatan
              asupan berdasarkan kondisi spesifik Anda.
            </p>
          </div>

          {/* Condition Tabs selector */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CONDITIONS_INFO.map((cond) => (
              <button
                key={cond.id}
                onClick={() => setActiveConditionTab(cond.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${activeConditionTab === cond.id ? "bg-[#24402a] border-[#24402a] text-white shadow-sm" : "bg-white border-[#cbd3cc] text-[#6f7871] hover:text-[#24402a]"}`}
              >
                {cond.name}
              </button>
            ))}
          </div>

          {/* Active Tab Panel Detail */}
          <div className="bg-white border border-[#e2e8e3] rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
            <div className="space-y-4">
              <span
                className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${selectedConditionDetail.badgeColor}`}
              >
                {selectedConditionDetail.shortName} TARGET REGIMEN
              </span>

              <h3 className="text-xl font-bold font-editorial-heading text-[#24402a]">
                {selectedConditionDetail.name}
              </h3>

              <p className="text-xs text-[#6f7871] leading-relaxed">
                {selectedConditionDetail.focusText}
              </p>

              <button
                onClick={() =>
                  selectConditionForRegistration(selectedConditionDetail.id)
                }
                className="inline-flex items-center text-xs font-semibold text-[#587e61] hover:text-[#24402a] transition-all gap-1 group mt-2"
              >
                Gunakan Diet Ini Saat Daftar{" "}
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div
              className={`${selectedConditionDetail.bgColor} p-6 rounded-xl border border-[#cbd3cc]/60 space-y-4`}
            >
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#6f7871] mb-2">
                  Target Nutrisi Utama
                </p>
                <ul className="space-y-1.5">
                  {selectedConditionDetail.limits.map((lim, i) => (
                    <li
                      key={i}
                      className="text-xs font-semibold text-[#24402a] flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#24402a] shrink-0" />
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#cbd3cc]/60 pt-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#6f7871] mb-2">
                  Tips Asuhan Mandiri
                </p>
                <ul className="space-y-1.5">
                  {selectedConditionDetail.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-[11px] text-[#6f7871] flex items-start gap-1.5"
                    >
                      <Info className="h-3.5 w-3.5 text-[#587e61] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Mockup Ledger Section (Premium CSS Representation) */}
      <section className="py-14 px-6 md:px-12 bg-[#fbfaf7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Ledger Mockup */}
            <div className="lg:col-span-6 bg-white border border-[#e2e8e3] p-5 rounded-2xl shadow-md space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 bg-[#24402a] h-1.5" />

              {/* Header mockup */}
              <div className="flex justify-between items-center pb-3 border-b border-[#f1efe9]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6f7871]">
                    NourishLab Ledger Preview
                  </span>
                  <p className="text-sm font-bold text-[#24402a] font-editorial-heading">
                    Jurnal Asuhan Harian Pasien
                  </p>
                </div>
                <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full">
                  KONDISI: CKD
                </span>
              </div>

              {/* Progress bar mockups */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#24402a] mb-1">
                    <span>Protein (Batas Rendah Protein)</span>
                    <span className="font-bold text-amber-700">
                      32.4g / 39.0g (83%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: "83%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#24402a] mb-1">
                    <span>Sodium (Natrium Batasi Ketat)</span>
                    <span className="font-bold text-emerald-700">
                      1185mg / 1800mg (65%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#24402a] mb-1">
                    <span>Cairan & Hidrasi</span>
                    <span className="font-bold text-blue-700">
                      1250ml / 1500ml (83%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: "83%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Checklist Mockup */}
              <div className="bg-[#fbfaf7] p-3 rounded-lg border border-[#e2e8e3]/60 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#6f7871] border-b border-[#cbd3cc]/40 pb-1 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Kepatuhan
                  Harian:
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-[#6f7871] line-through decoration-emerald-600">
                    <span className="h-3 w-3 bg-[#24402a] rounded flex items-center justify-center">
                      <Check className="h-2 w-2 text-white" />
                    </span>
                    <span>
                      Batasi asupan protein ketat (putih telur & tahu rebus)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#24402a] font-medium">
                    <span className="h-3 w-3 border border-[#cbd3cc] rounded bg-white"></span>
                    <span>
                      Hindari buah tinggi kalium (pisang, alpukat, kentang)
                    </span>
                  </div>
                </div>
              </div>

              {/* Biochemistry Warnings */}
              <div className="bg-[#fdf5f2] border border-[#f5d9d0] text-[#b85233] px-3 py-2.5 rounded-lg flex items-start gap-2.5 text-[11px] leading-snug">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#b85233]" />
                <p>
                  <strong>Peringatan Elektrolit (Hasil Lab Darah):</strong>{" "}
                  Kadar kalium darah Anda (5.3 mEq/L) melebihi batas atas normal
                  (5.1 mEq/L). Harap hindari pisang dan bayam rebus.
                </p>
              </div>
            </div>

            {/* Mockup Text Details */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#587e61]">
                Antarmuka Pengguna Terbaik
              </span>

              <h2 className="text-3xl font-editorial-heading italic font-bold text-[#24402a]">
                Visibilitas & Deteksi Bahaya Asupan Instan
              </h2>

              <p className="text-xs text-[#6f7871] leading-relaxed">
                Pasien klinis membutuhkan visibilitas cepat terhadap zat gizi
                sensitif. NourishLab merancang grafik progres, lembar patuh
                harian, serta generator peringatan asupan berdasarkan integrasi
                rekam laboratorium darah Anda dengan asupan harian secara
                real-time.
              </p>

              <div className="space-y-3 font-medium text-xs text-[#24402a]">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 bg-[#24402a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p>Mendeteksi kelebihan natrium/protein seketika.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 bg-[#24402a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p>
                    Menghubungkan asupan dengan indikasi tes laboratorium darah
                    terbaru.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 bg-[#24402a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p>
                    Grafik tren berat badan otomatis untuk memantau retensi
                    cairan masif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-[#e2e8e3] bg-[#fbfaf7] py-10 px-6 md:px-12 text-center text-xs text-[#6f7871]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Heart className="h-4 w-4 text-[#24402a]" />
            <span className="font-editorial-heading font-bold italic text-[#24402a]">
              NourishLab Ledger
            </span>
          </div>

          <div className="border-t border-[#cbd3cc]/40 pt-4 flex justify-between items-center flex-col sm:flex-row text-[10px] gap-2 font-mono">
            <span>© 2026 NourishLab Ledger. Hak Cipta Dilindungi.</span>
            <span>CLINICAL NUTRITION LEDGER SANDBOX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
