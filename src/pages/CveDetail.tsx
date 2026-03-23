import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CveData {
  id: string;
  name: string;
  description: string;
  cvss: number;
  severity: string;
  epss: number;
  kev: boolean;
  published: string;
  ransomware?: boolean;
  impact?: {
    systemsAffected: string;
    countriesHit: string;
    financialDamage: string;
    daysToRespond: string;
  };
  sources: { label: string; url: string }[];
  stages: any[];
}

const CveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mode, setMode] = useState<"beginner" | "technical">("beginner");
  const { aiStages, loading: aiLoading, error: aiError, generate } = useCveStory(id);

  const [cve, setCve] = useState<CveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const enriched = id ? enrichedData[id] : undefined;

  useEffect(() => {
    if (!id) return;
    const fetchCve = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase.functions.invoke("nvd-proxy", {
          body: { cveId: id },
        });
        if (error) throw new Error(error.message);
        if (data?.error) throw new Error(data.error);
        if (!data?.results?.length) {
          setCve(null);
          return;
        }
        const r = data.results[0];
        setCve({
          id: r.id,
          name: r.severity + " Severity Vulnerability",
          description: r.description,
          cvss: r.cvss,
          severity: r.severity,
          epss: r.epss,
          kev: r.kev,
          published: r.published,
          sources: [],
          stages: [],
        });
      } catch (err: any) {
        setFetchError(err.message || "Failed to fetch CVE data");
        setCve(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCve();
  }, [id]);

  if (loading) {
    return (
      <div className="scanline-overlay min-h-screen bg-background">
        <div className="bg-primary py-1.5 text-center">
          <p className="text-classified text-primary-foreground tracking-[0.3em]">
            ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
          </p>
        </div>
        <Navbar />
        <div className="container mx-auto py-20 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-classified text-muted-foreground">RETRIEVING CVE INTELLIGENCE...</span>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground mb-6">
            {fetchError || "The requested CVE identifier does not exist in the NVD database."}
          </p>
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

        {/* No AI stages placeholder */}
        {!aiStages && !aiLoading && (
          <div className="border border-border p-10 text-center">
            <p className="text-classified text-muted-foreground">// FULL INTELLIGENCE NARRATIVE PENDING</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click "Generate AI Intelligence Narrative" above to create a 6-stage lifecycle analysis.
            </p>
          </div>
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
