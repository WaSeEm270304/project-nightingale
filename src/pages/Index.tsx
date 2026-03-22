import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { value: "250K+", label: "CVEs Catalogued" },
  { value: "1,100+", label: "KEV Listed" },
  { value: "6", label: "Story Stages" },
  { value: "2", label: "View Modes" },
];

const problems = [
  { them: "Raw JSON dumps", us: "Narrative-driven intelligence" },
  { them: "CVSS score only", us: "CVSS + EPSS + KEV + context" },
  { them: "No timeline or history", us: "6-stage vulnerability lifecycle" },
  { them: "Technical jargon wall", us: "Beginner + Technical modes" },
  { them: "Static stale data", us: "Live NVD + KEV + EPSS feed" },
  { them: "No source attribution", us: "Every claim source-backed" },
];

const steps = [
  { num: "01", title: "Data Ingestion", desc: "NVD, CISA KEV, EPSS APIs" },
  { num: "02", title: "AI Analysis", desc: "Claude AI generates 6-stage story" },
  { num: "03", title: "Instant Publish", desc: "No waiting, no queue" },
  { num: "04", title: "Always Updated", desc: "Live data, never stale" },
];

const features = [
  { emoji: "🗂", title: "CVE Explorer", desc: "Search, filter, discover vulnerabilities across 250K+ entries." },
  { emoji: "📖", title: "Story-Driven Pages", desc: "6-stage visual breakdown of every vulnerability lifecycle." },
  { emoji: "🔴", title: "KEV Live Feed", desc: "Real-time CISA Known Exploited Vulnerabilities tracking." },
  { emoji: "⚖", title: "CVE Comparison", desc: "Side by side analysis of multiple vulnerabilities." },
  { emoji: "🤖", title: "AI-Powered", desc: "Every CVE narrative is AI-generated from verified NVD, KEV, and EPSS source data in real time." },
  { emoji: "📊", title: "Intel Dashboard", desc: "Trends, visualizations, and threat landscape overview." },
];

const trust = [
  { emoji: "📌", title: "Source-Backed", desc: "Every claim traced to NVD, MITRE, CISA, or vendor advisories." },
  { emoji: "🤖", title: "AI-Generated", desc: "Claude AI creates structured narratives from verified source data." },
  { emoji: "🔄", title: "Always Live", desc: "Data synced from NVD, KEV, EPSS in real time." },
  { emoji: "⚠", title: "AI Disclaimer", desc: "Content is AI-generated. Always verify critical details with primary sources before acting." },
];

const tickerCves = [
  "CVE-2024-3094", "CVE-2023-44228", "CVE-2021-44228", "CVE-2017-0144",
  "CVE-2023-4966", "CVE-2024-21887", "CVE-2023-46805", "CVE-2024-1709",
  "CVE-2023-22515", "CVE-2024-27198", "CVE-2021-34527", "CVE-2020-1472",
  "CVE-2019-19781", "CVE-2023-27997", "CVE-2024-6387", "CVE-2023-20198",
];

const Index = () => {
  return (
    <div className="scanline-overlay min-h-screen bg-background">
      {/* Top Secret Banner */}
      <div className="bg-primary py-1.5 text-center">
        <p className="text-classified text-primary-foreground tracking-[0.3em]">
          ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
        </p>
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg animate-grid-scroll opacity-40" />

        {/* CVE Ticker - left side, hidden on mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-32 overflow-hidden hidden lg:block border-r border-border/50 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="ticker-scroll py-4">
            {[...tickerCves, ...tickerCves].map((id, i) => (
              <p key={i} className="text-[10px] font-mono text-muted-foreground/40 py-2 px-3 whitespace-nowrap">
                {id}
              </p>
            ))}
          </div>
        </div>

        <div className="relative container mx-auto py-12 md:py-16 lg:pl-40">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-classified text-primary mb-3 tracking-[0.3em]">// INTELLIGENCE BRIEFING</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-2">
              Every CVE Has a Story.
            </h1>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary red-glow leading-[1.05] mb-6">
              We Tell It Right.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mb-8 font-body">
              CVE/INTEL transforms raw vulnerability data into structured intelligence narratives.
              Six stages. Two reading modes. Every claim source-backed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/explorer"
                className="bg-primary px-6 py-3.5 text-classified text-primary-foreground hover:bg-primary/90 transition-colors border border-primary text-center min-h-[44px] flex items-center justify-center"
              >
                Explore CVEs →
              </Link>
              <Link
                to="/cve/CVE-2017-0144"
                className="border border-border px-6 py-3.5 text-classified text-foreground hover:border-primary hover:text-primary transition-colors text-center min-h-[44px] flex items-center justify-center"
              >
                View EternalBlue
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="py-6 md:py-8 text-center">
                <p className="font-heading text-2xl md:text-4xl text-primary red-glow">{s.value}</p>
                <p className="text-classified text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Comparison */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container mx-auto">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// PROBLEM STATEMENT</p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-10">
            Why Another CVE Platform?
          </h2>
          <div className="border border-border overflow-hidden">
            {/* Headers */}
            <div className="grid grid-cols-2 border-b border-border">
              <div className="p-4 md:p-5 bg-secondary/30 border-r border-border">
                <h3 className="text-classified text-muted-foreground tracking-[0.2em]">✕ EVERY OTHER PLATFORM</h3>
              </div>
              <div className="p-4 md:p-5 bg-primary/5">
                <h3 className="text-classified text-primary tracking-[0.2em]">★ CVE/INTEL</h3>
              </div>
            </div>
            {/* Rows */}
            {problems.map((p, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-border last:border-0 group hover:bg-secondary/20 transition-colors">
                <div className="p-3 md:p-4 border-r border-border">
                  <p className="text-xs md:text-sm text-muted-foreground">{p.them}</p>
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-foreground">{p.us}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container mx-auto">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// METHODOLOGY</p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border p-5 md:p-6 hover:border-primary/40 transition-colors group"
              >
                <span className="font-heading text-4xl md:text-5xl text-primary/20 group-hover:text-primary/40 transition-colors">{s.num}</span>
                <h3 className="font-heading text-base md:text-lg text-foreground mt-2 mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-mono">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container mx-auto">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// CAPABILITIES</p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-10">
            Built for Analysts. Readable by Anyone.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border p-5 md:p-6 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{f.emoji}</span>
                  <span className="text-classified text-primary">{f.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container mx-auto">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// TRUST FRAMEWORK</p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-10">
            Intelligence You Can Trust
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trust.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-l-2 border-primary pl-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{t.emoji}</span>
                  <h3 className="font-heading text-base md:text-lg text-foreground">{t.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
