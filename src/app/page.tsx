"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Send, TrendingUp, BarChart2 } from "lucide-react"; // Tambah BarChart2 untuk icon navbar
import Link from "next/link"; // Tambah Link untuk navigasi antar halaman
import { ChartCard, SimulationData } from "./ChartCard";
import { AuraLogo } from "./AuraLogo"; // Import Logo yang sudah kita buat

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  chartData?: SimulationData;
}

export default function FinUICommandCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || input.trim() === "") return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://aura-wealth-agent-production.up.railway.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            message: userMsg.content,
          }),
        },
      );

      const json = await response.json();

      if (response.ok) {
        if (!sessionId) setSessionId(json.data.sessionId);

        const aiData: SimulationData = json.data.reply;
        const aiText = aiData.analysis;

        let chartPayload: SimulationData | undefined = undefined;
        if (aiData.initialInvestment > 0 || aiData.monthlyContribution > 0) {
          chartPayload = aiData;
        }

        const aiMsg: Message = {
          id: Date.now().toString() + "-ai",
          role: "ai",
          content: aiText,
          chartData: chartPayload,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        console.error("Server Error:", json.message);
      }
    } catch (error) {
      console.error("Gagal koneksi ke server:", error);
      const errorMsg: Message = {
        id: Date.now().toString() + "-err",
        role: "ai",
        content:
          "Maaf, koneksi ke server backend (Java) terputus. Pastikan server menyala di port 8080.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 font-sans">
      {/* --- NAVBAR ELEGAN DENGAN LOGO DAN LINK MARKET --- */}
      <header className="p-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <AuraLogo className="w-9 h-9" /> {/* Menambahkan Logo SVG */}
          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
              Aura Wealth
            </h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
              Autonomous Robo-Advisor
            </p>
          </div>
        </div>

        {/* --- TOMBOL NAVIGASI KE MARKET --- */}
        <div className="flex items-center gap-6">
          <Link
            href="/market"
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-all group"
          >
            <BarChart2
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
            Market Trends
          </Link>
          <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-slate-400 font-medium">
              System Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="p-4 bg-slate-900 rounded-full border border-slate-800">
              <TrendingUp size={48} className="text-emerald-500" />
            </div>
            <p className="text-center max-w-md leading-relaxed text-sm">
              Sistem AI Manajemen Kekayaan siap.
              <br />
              Ketikkan skenario keuangan Anda, contoh:
              <br />
              <span className="text-emerald-400 mt-2 block font-medium">
                &quot;Saya punya modal 10 juta, mau nabung 2 juta sebulan selama
                5 tahun dengan return 10%. Tolong buatkan simulasinya.&quot;
              </span>
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-sm ${
                m.role === "user"
                  ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                {m.content}
              </pre>
            </div>

            {m.chartData && (
              <div className="mt-4 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-xs text-slate-500 mb-1">Modal Awal</p>
                    <p className="font-bold text-emerald-400">
                      Rp {m.chartData.initialInvestment.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-xs text-slate-500 mb-1">Setoran Rutin</p>
                    <p className="font-bold text-emerald-400">
                      Rp{" "}
                      {m.chartData.monthlyContribution.toLocaleString("id-ID")}
                      /bln
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-xs text-slate-500 mb-1">Asumsi Return</p>
                    <p className="font-bold text-cyan-400">
                      {m.chartData.expectedReturnRate}% /tahun
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-xs text-slate-500 mb-1">Durasi</p>
                    <p className="font-bold text-amber-400">
                      {m.chartData.years} Tahun
                    </p>
                  </div>
                </div>
                <ChartCard data={m.chartData} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="max-w-[75%] rounded-2xl p-5 bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400">
                Aura sedang menganalisis portofolio Anda...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex items-center shadow-2xl"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Minta simulasi investasi atau tanya soal aset..."
            className="w-full bg-slate-900 border border-slate-700 rounded-full py-4 pl-6 pr-16 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ""}
            className="absolute right-2 p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-lg"
          >
            <Send
              size={18}
              className={isLoading ? "opacity-0" : "opacity-100"}
            />
            {isLoading && (
              <div className="absolute inset-0 m-auto w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
