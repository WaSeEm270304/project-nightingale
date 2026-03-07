import { motion } from "framer-motion";
import type { CveScoring } from "@/data/cveEnrichedData";

interface ScoringPanelProps {
  cveId: string;
  cvss: number;
  epss: number;
  severity: string;
  published: string;
  scoring: CveScoring | undefined;
}

const ScoringPanel = ({ cveId, cvss, epss, severity, published, scoring }: ScoringPanelProps) => {
  const severityColors: Record<string, string> = {
    CRITICAL: "text-primary red-glow",
    HIGH: "text-orange-500",
    MEDIUM: "text-yellow-500",
    LOW: "text-green-500",
  };

  const severityBg: Record<string, string> = {
    CRITICAL: "border-primary bg-primary/10",
    HIGH: "border-orange-500/50 bg-orange-500/10",
    MEDIUM: "border-yellow-500/50 bg-yellow-500/10",
    LOW: "border-green-500/50 bg-green-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <p className="text-classified text-primary mb-4 tracking-[0.3em]">// SCORING & METADATA</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* CVSS Score */}
        <div className={`border ${severityBg[severity] || "border-border"} p-4`}>
          <p className="text-classified text-muted-foreground mb-1">CVSS BASE SCORE</p>
          <p className={`font-heading text-3xl ${severityColors[severity] || "text-foreground"}`}>{cvss}</p>
          <p className="text-classified text-muted-foreground mt-1">{severity}</p>
        </div>

        {/* CVSS Vector */}
        <div className="border border-border p-4 md:col-span-2">
          <p className="text-classified text-muted-foreground mb-1">CVSS VECTOR</p>
          <p className="font-mono text-xs text-foreground break-all leading-relaxed">
            {scoring?.cvssVector || "N/A"}
          </p>
          <p className="text-classified text-muted-foreground mt-2 text-[10px]">
            SOURCE: {scoring?.scoreSource || "NIST"}
          </p>
        </div>

        {/* Exploitability */}
        <div className="border border-border p-4">
          <p className="text-classified text-muted-foreground mb-1">EXPLOITABILITY</p>
          <p className="font-heading text-2xl text-foreground">{scoring?.exploitabilityScore ?? "—"}</p>
          <div className="mt-2 h-1.5 bg-border">
            <div
              className="h-full bg-primary"
              style={{ width: `${((scoring?.exploitabilityScore ?? 0) / 3.9) * 100}%` }}
            />
          </div>
        </div>

        {/* Impact */}
        <div className="border border-border p-4">
          <p className="text-classified text-muted-foreground mb-1">IMPACT SCORE</p>
          <p className="font-heading text-2xl text-foreground">{scoring?.impactScore ?? "—"}</p>
          <div className="mt-2 h-1.5 bg-border">
            <div
              className="h-full bg-primary"
              style={{ width: `${((scoring?.impactScore ?? 0) / 6.0) * 100}%` }}
            />
          </div>
        </div>

        {/* EPSS */}
        <div className="border border-border p-4">
          <p className="text-classified text-muted-foreground mb-1">EPSS SCORE</p>
          <p className="font-heading text-2xl text-primary">{(epss * 100).toFixed(1)}%</p>
          <p className="text-classified text-muted-foreground mt-1">
            PERCENTILE: {scoring?.epssPercentile ?? "—"}%
          </p>
        </div>

        {/* KEV Status */}
        <div className="border border-border p-4">
          <p className="text-classified text-muted-foreground mb-1">KEV STATUS</p>
          <p className={`font-heading text-lg ${scoring?.kevDateAdded ? "text-primary" : "text-muted-foreground"}`}>
            {scoring?.kevDateAdded ? "LISTED" : "NOT LISTED"}
          </p>
          {scoring?.kevDateAdded && (
            <p className="text-classified text-muted-foreground mt-1">ADDED: {scoring.kevDateAdded}</p>
          )}
        </div>

        {/* CWE */}
        <div className="border border-border p-4 md:col-span-2">
          <p className="text-classified text-muted-foreground mb-1">CWE CLASSIFICATION</p>
          <p className="font-mono text-sm text-foreground">{cveId.includes("CVE") ? "CWE-119" : "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">{scoring?.cweName || "—"}</p>
        </div>

        {/* Dates */}
        <div className="border border-border p-4">
          <p className="text-classified text-muted-foreground mb-1">PUBLISHED</p>
          <p className="font-mono text-sm text-foreground">{published}</p>
          <p className="text-classified text-muted-foreground mt-2 mb-1">LAST MODIFIED</p>
          <p className="font-mono text-sm text-foreground">{scoring?.lastModified || "—"}</p>
        </div>

        {/* Alternative IDs */}
        {scoring?.alternativeIds && scoring.alternativeIds.length > 0 && (
          <div className="border border-border p-4">
            <p className="text-classified text-muted-foreground mb-2">ALTERNATIVE IDS</p>
            <div className="space-y-1">
              {scoring.alternativeIds.map((alt) => (
                <p key={alt.id} className="font-mono text-xs text-foreground">
                  <span className="text-muted-foreground">{alt.type}: </span>{alt.id}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScoringPanel;
