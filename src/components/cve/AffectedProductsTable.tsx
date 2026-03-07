import { motion } from "framer-motion";
import type { AffectedProduct } from "@/data/cveEnrichedData";

interface AffectedProductsTableProps {
  products: AffectedProduct[];
}

const AffectedProductsTable = ({ products }: AffectedProductsTableProps) => {
  if (!products.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-10"
    >
      <p className="text-classified text-primary mb-4 tracking-[0.3em]">// AFFECTED PRODUCTS (CPE DATA)</p>

      {/* Desktop table */}
      <div className="hidden md:block border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              <th className="text-left text-classified text-primary px-4 py-3">VENDOR</th>
              <th className="text-left text-classified text-primary px-4 py-3">PRODUCT</th>
              <th className="text-left text-classified text-primary px-4 py-3">AFFECTED VERSIONS</th>
              <th className="text-left text-classified text-primary px-4 py-3">FIXED VERSION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.vendor}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">{p.product}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.affectedVersions}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-primary">{p.fixedVersion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {products.map((p, i) => (
          <div key={i} className="border border-border p-3">
            <p className="font-mono text-xs text-foreground">{p.vendor} — {p.product}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">AFFECTED: {p.affectedVersions}</p>
            <p className="font-mono text-[10px] text-primary mt-0.5">FIX: {p.fixedVersion}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AffectedProductsTable;
