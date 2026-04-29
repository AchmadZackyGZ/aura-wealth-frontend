"use client";

import { useState } from "react";
import { Search, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { Card, AreaChart, Title, Text, Badge } from "@tremor/react";
import { AuraLogo } from "../AuraLogo";
import Link from "next/link";

interface StockChartData {
  date: string;
  closePrice: number;
}

interface MarketData {
  symbol: string;
  chart: StockChartData[];
  aiSentiment: string;
}

export default function MarketTrendsPage() {
  const [symbol, setSymbol] = useState("AAPL");
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symbol.trim()) return;

    setIsLoading(true);
    setError(null);
    setMarketData(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/market/${symbol.toUpperCase()}`,
      );
      const json = await response.json();

      if (response.ok) {
        setMarketData(json.data);
      } else {
        setError(json.message || "Gagal mengambil data saham.");
      }
    } catch (err) {
      setError("Koneksi ke server terputus. Pastikan backend Java menyala.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tentukan warna badge berdasarkan kata kunci sentimen AI
  const getSentimentBadge = (text: string) => {
    const upperText = text.toUpperCase();
    if (upperText.includes("BULLISH"))
      return <Badge color="emerald">BULLISH 🚀</Badge>;
    if (upperText.includes("BEARISH"))
      return <Badge color="rose">BEARISH 📉</Badge>;
    return <Badge color="amber">NETRAL ⚖️</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-4 md:p-8">
      {/* Header Elegan */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <AuraLogo className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
              Aura Market AI
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest mt-0.5">
              REAL-TIME SENTIMENT ANALYSIS
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          &larr; Kembali ke Chat
        </Link>
      </header>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form
          onSubmit={fetchMarketData}
          className="relative flex items-center shadow-lg"
        >
          <Search className="absolute left-4 text-slate-500" size={20} />
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Masukkan Simbol Saham (Contoh: AAPL, MSFT, TSLA)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-32 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all uppercase"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !symbol.trim()}
            className="absolute right-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Activity size={18} />
                Analisis
              </>
            )}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-3">
          *Untuk saham Indonesia di Twelve Data biasanya memerlukan suffix,
          contoh: BBCA.JK atau TLKM.JK
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl flex items-start gap-3 text-rose-400">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p className="text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {/* Konten Utama (Grafik & AI Sentiment) */}
      {marketData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Kolom Kiri: Grafik Saham (Lebih Lebar) */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800 h-full">
              <Title className="text-emerald-400 flex items-center gap-2">
                <TrendingUp size={20} />
                Grafik Harga {marketData.symbol} (7 Hari Terakhir)
              </Title>
              <Text className="text-slate-400 mb-6">
                Berdasarkan data penutupan pasar harian.
              </Text>

              <AreaChart
                className="h-80"
                data={marketData.chart}
                index="date"
                categories={["closePrice"]}
                colors={["cyan"]}
                valueFormatter={(number) => `$${number.toFixed(2)}`}
                showLegend={false}
                yAxisWidth={60}
              />
            </Card>
          </div>

          {/* Kolom Kanan: Aura AI Sentiment */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 h-full shadow-xl relative overflow-hidden">
              {/* Dekorasi Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <AuraLogo className="w-6 h-6" />
                    Aura Insight
                  </h3>
                  {getSentimentBadge(marketData.aiSentiment)}
                </div>

                <div className="w-full h-[1px] bg-slate-700 mb-4"></div>

                <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed">
                  {/* Menampilkan teks AI dengan whitespace pre-wrap agar enter dan spasi terjaga */}
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {marketData.aiSentiment.replace(/\*\*/g, "")}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
