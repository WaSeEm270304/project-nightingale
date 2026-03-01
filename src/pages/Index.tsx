import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Database, Eye, FileText, Lock, AlertTriangle } from "lucide-react";

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
  { them: "Static, stale data", us: "Living documents, continuously updated" },
  { them: "No source attribution", us: "Every claim source-backed" },
];

const steps = [
  { num: "01", title: "Data Ingestion", desc: "Automated feeds from NVD, CISA KEV, MITRE, and vendor advisories." },
  { num: "02", title: "AI Analysis", desc: "LLM-powered extraction of timelines, root causes, and impact metrics." },
  { num: "03", title: "Human Review", desc: "Security analysts verify accuracy, add context, and approve narratives." },
  { num: "04", title: "Published", desc: "Intelligence published with full source attribution and living updates." },
];

const features = [
  { icon: Shield, phase: "DISCOVERY", title: "6-Stage Timeline", desc: "Every CVE broken into Discovery → Root Cause → Leak → Weaponization → Detection → Patch." },
  { icon: Eye, phase: "ANALYSIS", title: "Dual View Modes", desc: "Toggle between Beginner (analogies) and Technical (code-level) explanations." },
  { icon: AlertTriangle, phase: "THREAT", title: "KEV & EPSS Tracking", desc: "Real-time tracking of CISA's Known Exploited Vulnerabilities catalog and EPSS scores." },
  { icon: Database, phase: "DATA", title: "250K+ CVE Database", desc: "Comprehensive coverage with advanced search, filters, and CVSS/EPSS ranges." },
  { icon: FileText, phase: "INTEL", title: "Source-Backed Intel", desc: "Every statement linked to primary sources — NVD, vendor advisories, research papers." },
  { icon: Lock, phase: "TRUST", title: "Correction Policy", desc: "Transparent corrections and versioned updates to all intelligence documents." },
];

const trust = [
  { title: "Source-Backed", desc: "Every claim traced to NVD, MITRE, CISA, or vendor advisories." },
  { title: "AI + Human", desc: "LLM analysis verified by security professionals before publishing." },
  { title: "Living Documents", desc: "Intelligence updated as new information becomes available." },
  { title: "Correction Policy", desc: "Transparent revision history and error correction process." },
];

const Index = () => {
  return (
    <div className="scanline-overlay min-h-screen bg-background">
      {/* Top Secret Banner */}
      <div className="bg-primary py-2 text-center">
        <p className="text-classified text-primary-foreground tracking-[0.3em]">
          ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
        </p>
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg animate-grid-scroll opacity-50" />
        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-classified text-primary mb-4 tracking-[0.3em]">// INTELLIGENCE BRIEFING</p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6">
              Every CVE Has a Story.{" "}
              <span className="text-primary red-glow">We Tell It Right.</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mb-8">
              CVE/INTEL transforms raw vulnerability data into structured intelligence narratives.
              Six stages. Two reading modes. Every claim source-backed. This is how cybersecurity
              intelligence should work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/explorer"
                className="bg-primary px-6 py-3 text-classified text-primary-foreground hover:bg-primary/90 transition-colors border border-primary text-center"
              >
                Explore CVEs →
              </Link>
              <Link
                to="/cve/CVE-2017-0144"
                className="border border-border px-6 py-3 text-classified text-foreground hover:border-primary hover:text-primary transition-colors text-center"
              >
                View EternalBlue
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="py-8 text-center">
                <p className="font-heading text-3xl md:text-4xl text-primary red-glow">{s.value}</p>
                <p className="text-classified text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Comparison */}
      <section className="border-b border-border py-20">
        <div className="container mx-auto px-4">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// PROBLEM STATEMENT</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-10">
            Why Another CVE Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
            <div className="border-b md:border-b-0 md:border-r border-border p-6">
              <h3 className="text-classified text-muted-foreground mb-4 tracking-[0.2em]">
                ✗ EVERY OTHER PLATFORM
              </h3>
              {problems.map((p, i) => (
                <div key={i} className="py-2 border-b border-border last:border-0">
                  <p className="text-sm text-muted-foreground">{p.them}</p>
                </div>
              ))}
            </div>
            <div className="p-6">
              <h3 className="text-classified text-primary mb-4 tracking-[0.2em]">
                ★ CVE/INTEL
              </h3>
              {problems.map((p, i) => (
                <div key={i} className="py-2 border-b border-border last:border-0">
                  <p className="text-sm text-foreground">{p.us}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border py-20">
        <div className="container mx-auto px-4">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// METHODOLOGY</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <motion.div
                key={s.num}
                whileHover={{ borderColor: "hsl(0 100% 40%)" }}
                className="border border-border p-6 transition-colors"
              >
                <span className="font-heading text-4xl text-primary/30">{s.num}</span>
                <h3 className="font-heading text-lg text-foreground mt-2 mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-20">
        <div className="container mx-auto px-4">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// CAPABILITIES</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-10">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="border border-border p-6 hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                  <span className="text-classified text-primary">{f.phase}</span>
                </div>
                <h3 className="font-heading text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-border py-20">
        <div className="container mx-auto px-4">
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// TRUST FRAMEWORK</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-10">
            Intelligence You Can Trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trust.map((t) => (
              <div key={t.title} className="border-l-2 border-primary pl-4">
                <h3 className="font-heading text-lg text-foreground mb-2">{t.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
