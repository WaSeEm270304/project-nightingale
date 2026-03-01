import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mockCVEs } from "@/data/mockCves";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mode, setMode] = useState<"beginner" | "technical">("beginner");

  const cve = mockCVEs.find((c) => c.id === id);

  if (!cve) {
    return (
      <div className="scanline-overlay min-h-screen bg-background">
        <div className="bg-primary py-2 text-center">
          <p className="text-classified text-primary-foreground tracking-[0.3em]">
            ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
          </p>
        </div>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl text-foreground mb-4">CVE NOT FOUND</h1>
          <p className="text-muted-foreground mb-6">The requested CVE identifier does not exist in our database.</p>
          <Link to="/explorer" className="text-classified text-primary hover:underline">← Return to Explorer</Link>
        </div>
      </div>
    );
  }

  const severityColor = cve.severity === "CRITICAL" ? "bg-primary" : "bg-primary/70";

  return (
    <div className="scanline-overlay min-h-screen bg-background">
      <div className="bg-primary py-2 text-center">
        <p className="text-classified text-primary-foreground tracking-[0.3em]">
          ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
        </p>
      </div>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground">{cve.id}</h1>
            <span className={`${severityColor} px-2 py-0.5 text-classified text-primary-foreground`}>
              {cve.severity}
            </span>
            {cve.kev && (
              <span className="border border-primary px-2 py-0.5 text-classified text-primary">
                KEV LISTED
              </span>
            )}
            {cve.ransomware && (
              <span className="border border-border px-2 py-0.5 text-classified text-muted-foreground">
                RANSOMWARE-LINKED
              </span>
            )}
          </div>
          <h2 className="font-heading text-xl text-muted-foreground mb-4">{cve.name}</h2>

          <div className="flex flex-wrap gap-6 text-sm mb-6">
            <div>
              <span className="text-classified text-muted-foreground">CVSS </span>
              <span className="font-heading text-2xl text-primary red-glow">{cve.cvss}</span>
            </div>
            <div>
              <span className="text-classified text-muted-foreground">EPSS </span>
              <span className="font-heading text-2xl text-foreground">{(cve.epss * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-classified text-muted-foreground">CWE </span>
              <span className="text-foreground">{cve.cwe}</span>
            </div>
            <div>
              <span className="text-classified text-muted-foreground">PUBLISHED </span>
              <span className="text-foreground">{cve.published}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{cve.description}</p>
        </motion.div>

        {/* Toggle */}
        <div className="flex gap-2 mb-10">
          <button
            onClick={() => setMode("beginner")}
            className={`px-4 py-2 text-classified transition-colors ${
              mode === "beginner"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            ◉ Beginner Mode
          </button>
          <button
            onClick={() => setMode("technical")}
            className={`px-4 py-2 text-classified transition-colors ${
              mode === "technical"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            ◉ Technical Mode
          </button>
        </div>

        {/* Impact Stats */}
        {cve.impact && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Systems Affected", value: cve.impact.systemsAffected },
              { label: "Countries Hit", value: cve.impact.countriesHit },
              { label: "Financial Damage", value: cve.impact.financialDamage },
              { label: "Days to Respond", value: cve.impact.daysToRespond },
            ].map((stat) => (
              <div key={stat.label} className="border border-border p-4 text-center">
                <p className="font-heading text-2xl text-primary red-glow">{stat.value}</p>
                <p className="text-classified text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {cve.stages.length > 0 ? (
          <div className="relative">
            <p className="text-classified text-primary mb-6 tracking-[0.3em]">// VULNERABILITY LIFECYCLE</p>

            {/* Vertical red line */}
            <div className="absolute left-4 md:left-6 top-14 bottom-0 w-px bg-primary/30" />

            <div className="space-y-8">
              {cve.stages.map((stage, i) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12 md:pl-16 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-4.5 top-2 w-3 h-3 border-2 border-primary bg-background rounded-full group-hover:bg-primary transition-colors" />

                  <div className="border border-border p-6 hover:border-primary/50 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="bg-primary/10 border border-primary/30 px-2 py-0.5 text-classified text-primary">
                        STAGE {stage.stage}: {stage.label}
                      </span>
                      <span className="text-classified text-muted-foreground">{stage.date}</span>
                    </div>

                    <h3 className="font-heading text-xl text-foreground mb-3">{stage.title}</h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{stage.content}</p>

                    {mode === "beginner" ? (
                      <div className="border-l-2 border-primary pl-4 bg-primary/5 py-3 pr-4">
                        <p className="text-classified text-primary mb-1">ANALOGY</p>
                        <p className="text-sm text-foreground italic leading-relaxed">{stage.analogy}</p>
                      </div>
                    ) : (
                      <div className="border border-border bg-secondary/50 p-4">
                        <p className="text-classified text-primary mb-1">TECHNICAL BREAKDOWN</p>
                        <p className="text-xs text-foreground leading-relaxed font-mono">{stage.technical}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-border p-10 text-center">
            <p className="text-classified text-muted-foreground">// FULL INTELLIGENCE NARRATIVE PENDING</p>
            <p className="text-sm text-muted-foreground mt-2">
              This CVE's 6-stage lifecycle analysis is currently being prepared by our intelligence team.
            </p>
          </div>
        )}

        {/* Sources */}
        {cve.sources.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-classified text-primary mb-4 tracking-[0.3em]">// SOURCES & REFERENCES</p>
            <div className="flex flex-wrap gap-3">
              {cve.sources.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  className="border border-border px-4 py-2 text-classified text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CveDetail;
