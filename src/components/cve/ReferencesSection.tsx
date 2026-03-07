import { motion } from "framer-motion";
import type { CveReference } from "@/data/cveEnrichedData";

interface ReferencesSectionProps {
  references: CveReference[];
}

const ReferencesSection = ({ references }: ReferencesSectionProps) => {
  if (!references.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-12 border-t border-border pt-8"
    >
      <p className="text-classified text-primary mb-4 tracking-[0.3em]">// ALL REFERENCES ({references.length})</p>
      <div className="space-y-2">
        {references.map((ref, i) => (
          <a
            key={i}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border p-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 hover:border-primary/50 transition-colors group block"
          >
            <span className="font-mono text-xs text-primary group-hover:underline truncate flex-1 min-w-0">
              {ref.url}
            </span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="font-mono text-[10px] text-muted-foreground">{ref.source}</span>
              {ref.tags.map((tag) => (
                <span key={tag} className="border border-border px-1.5 py-0.5 text-[9px] text-classified text-muted-foreground">
                  {tag}
                </span>
              ))}
              <span className="text-muted-foreground text-xs">↗</span>
            </span>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default ReferencesSection;
