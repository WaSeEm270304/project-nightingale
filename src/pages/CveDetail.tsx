import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mockCVEs } from "@/data/mockCves";
import { enrichedData } from "@/data/cveEnrichedData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoringPanel from "@/components/cve/ScoringPanel";
import VerifiedSourcesBar from "@/components/cve/VerifiedSourcesBar";
import AffectedProductsTable from "@/components/cve/AffectedProductsTable";
import ReferencesSection from "@/components/cve/ReferencesSection";
import EnrichedTechnicalView from "@/components/cve/EnrichedTechnicalView";
import AITimeline from "@/components/cve/AITimeline";
import { useCveStory } from "@/hooks/useCveStory";

const CveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mode, setMode] = useState<"beginner" | "technical">("beginner");
  const { aiStages, loading: aiLoading, error: aiError, generate } = useCveStory(id);

  const cve = mockCVEs.find((c) => c.id === id);
  const enriched = id ? enrichedData[id] : undefined;

  if (!cve) {
    return (
      <div className="scanline-overlay min-h-screen bg-background">
        <div className="bg-primary py-1.5 text-center">
          <p className="text-classified text-primary-foreground tracking-[0.3em]">
            ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
          </p>
        </div>
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">CVE NOT FOUND</h1>
          <p className="text-muted-foreground mb-6">The requested CVE identifier does not exist in our database.</p>
          <Link to="/explorer" className="text-classified text-primary hover:underline">← Return to Explorer</Link>
        </div>
      </div>
    );
  }

  const severityColor = cve.severity === "CRITICAL" ? "bg-primary" : "bg-primary/70";

  return (
    <div className="scanline-overlay min-h-screen bg-background">
      <div className="bg-primary py-1.5 text-center">
        <p className="text-classified text-primary-foreground tracking-[0.3em]">
          ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
        </p>
      </div>
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground">{cve.id}</h1>
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
            <span className="border border-primary/50 bg-primary/10 px-2 py-0.5 text-classified text-primary">
              AI-GENERATED
            </span>
          </div>




          <h2 className="font-heading text-lg md:text-xl text-muted-foreground mb-4">{cve.name}</h2>
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{cve.description}</p>
        </motion.div>

        {/* Scoring Panel */}
        <ScoringPanel
          cveId={cve.id}
          cvss={cve.cvss}
          epss={cve.epss}
          severity={cve.severity}
          published={cve.published}
          scoring={enriched?.scoring}
        />

        {/* Verified Sources Bar */}
        <VerifiedSourcesBar cveId={cve.id} />

        {/* Affected Products */}
        {enriched?.affectedProducts && (
          <AffectedProductsTable products={enriched.affectedProducts} />
        )}

        {/* Toggle */}
        <div className="flex flex-col sm:flex-row gap-2 mb-10">
          <button
            onClick={() => setMode("beginner")}
            className={`px-5 py-3 text-classified transition-colors min-h-[44px] ${
              mode === "beginner"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            ◉ Beginner Mode
          </button>
          <button
            onClick={() => setMode("technical")}
            className={`px-5 py-3 text-classified transition-colors min-h-[44px] ${
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
            {[
              { label: "Systems Affected", value: cve.impact.systemsAffected },
              { label: "Countries Hit", value: cve.impact.countriesHit },
              { label: "Financial Damage", value: cve.impact.financialDamage },
              { label: "Days to Respond", value: cve.impact.daysToRespond },
            ].map((stat) => (
              <div key={stat.label} className="border border-border p-4 text-center">
                <p className="font-heading text-xl md:text-2xl text-primary red-glow">{stat.value}</p>
                <p className="text-classified text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI Generate Button */}
        <div className="mb-8">
          <button
            onClick={generate}
            disabled={aiLoading}
            className="border border-primary bg-primary/10 px-6 py-3 text-classified text-primary hover:bg-primary hover:text-primary-foreground transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? "◉ GENERATING INTELLIGENCE NARRATIVE..." : "◉ GENERATE AI INTELLIGENCE NARRATIVE"}
          </button>
          {aiError && (
            <p className="text-primary text-xs font-mono mt-2">ERROR: {aiError}</p>
          )}
        </div>

        {/* AI Loading State */}
        {aiLoading && (
          <div className="border border-primary/30 bg-primary/5 p-10 text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-classified text-primary tracking-[0.3em] animate-pulse">
              // GENERATING INTELLIGENCE NARRATIVE...
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Fetching NVD data • Analyzing EPSS scores • Checking KEV status • Generating 6-stage narrative
            </p>
          </div>
        )}

        {/* AI Generated Timeline */}
        {aiStages && !aiLoading && (
          <AITimeline stages={aiStages} mode={mode} />
        )}

        {/* Static Timeline (shown when no AI stages) */}
        {!aiStages && !aiLoading && (
          <>
            {cve.stages.length > 0 ? (
              <div className="relative">
                <p className="text-classified text-primary mb-6 tracking-[0.3em]">// VULNERABILITY LIFECYCLE</p>

                {/* Vertical red line */}
                <div className="absolute left-3 md:left-6 top-14 bottom-0 w-px bg-primary/30" />

                <div className="space-y-6 md:space-y-8">
                  {cve.stages.map((stage, i) => {
                    const stageEnriched = enriched?.enrichedStages?.[stage.stage];
                    return (
                      <motion.div
                        key={stage.stage}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-8 md:pl-16 group"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-1.5 md:left-4.5 top-2 w-3 h-3 border-2 border-primary bg-background rounded-full group-hover:bg-primary transition-colors" />

                        <div className="border border-border p-4 md:p-6 hover:border-primary/50 transition-colors">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <span className="bg-primary/10 border border-primary/30 px-2 py-0.5 text-classified text-primary">
                              STAGE {stage.stage}: {stage.label}
                            </span>
                            <span className="text-classified text-muted-foreground">{stage.date}</span>
                          </div>

                          <h3 className="font-heading text-lg md:text-xl text-foreground mb-3">{stage.title}</h3>

                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{stage.content}</p>

                          {mode === "beginner" ? (
                            <div className="border-l-2 border-primary pl-4 bg-primary/5 py-3 pr-4">
                              <p className="text-classified text-primary mb-1">ANALOGY</p>
                              <p className="text-sm text-foreground italic leading-relaxed">{stage.analogy}</p>
                            </div>
                          ) : stageEnriched ? (
                            <EnrichedTechnicalView enriched={stageEnriched} />
                          ) : (
                            <div className="border border-border bg-secondary/50 p-4">
                              <p className="text-classified text-primary mb-1">TECHNICAL BREAKDOWN</p>
                              <p className="text-xs text-foreground leading-relaxed font-mono">{stage.technical}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-border p-10 text-center">
                <p className="text-classified text-muted-foreground">// FULL INTELLIGENCE NARRATIVE PENDING</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This CVE's 6-stage lifecycle analysis is currently being prepared.
                </p>
              </div>
            )}
          </>
        )}

        {/* References from enriched data */}
        {enriched?.references && <ReferencesSection references={enriched.references} />}

        {/* Legacy sources fallback */}
        {!enriched?.references && cve.sources.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-classified text-primary mb-4 tracking-[0.3em]">// SOURCES & REFERENCES</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {cve.sources.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border px-3 md:px-4 py-2 text-classified text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] flex items-center"
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
