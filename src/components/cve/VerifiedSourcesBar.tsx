import { motion } from "framer-motion";

interface VerifiedSourcesBarProps {
  cveId: string;
}

const VerifiedSourcesBar = ({ cveId }: VerifiedSourcesBarProps) => {
  const sources = [
    { label: "NVD", url: `https://nvd.nist.gov/vuln/detail/${cveId}` },
    { label: "CISA KEV", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
    { label: "CVE.ORG", url: `https://www.cve.org/CVERecord?id=${cveId}` },
    { label: "MITRE", url: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveId}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8"
    >
      <p className="text-classified text-primary mb-4 tracking-[0.3em]">// VERIFIED SOURCES</p>
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-4 py-2.5 text-classified text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[44px] flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            {s.label} ↗
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default VerifiedSourcesBar;
