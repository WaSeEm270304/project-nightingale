import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mockCVEs } from "@/data/mockCves";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ITEMS_PER_PAGE = 6;

const Explorer = () => {
  const [search, setSearch] = useState("");
  const [cvssMin, setCvssMin] = useState(0);
  const [cvssMax, setCvssMax] = useState(10);
  const [kevOnly, setKevOnly] = useState(false);
  const [ransomwareOnly, setRansomwareOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockCVEs.filter((cve) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        cve.id.toLowerCase().includes(q) ||
        cve.name.toLowerCase().includes(q) ||
        cve.vendor.toLowerCase().includes(q) ||
        cve.product.toLowerCase().includes(q);
      const matchesCvss = cve.cvss >= cvssMin && cve.cvss <= cvssMax;
      const matchesKev = !kevOnly || cve.kev;
      const matchesRansomware = !ransomwareOnly || cve.ransomware;
      return matchesSearch && matchesCvss && matchesKev && matchesRansomware;
    });
  }, [search, cvssMin, cvssMax, kevOnly, ransomwareOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="scanline-overlay min-h-screen bg-background">
      <div className="bg-primary py-2 text-center">
        <p className="text-classified text-primary-foreground tracking-[0.3em]">
          ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
        </p>
      </div>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// CVE EXPLORER</p>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-8">
            Search & Filter Vulnerabilities
          </h1>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by CVE ID, vendor, product, or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 shrink-0 space-y-6">
              <div className="border border-border p-4">
                <p className="text-classified text-primary mb-3">FILTERS</p>

                {/* CVSS Range */}
                <div className="mb-4">
                  <p className="text-classified text-muted-foreground mb-2">CVSS RANGE</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={cvssMin}
                      onChange={(e) => { setCvssMin(Number(e.target.value)); setPage(1); }}
                      className="w-16 bg-secondary border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                    <span className="text-muted-foreground text-xs">to</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={cvssMax}
                      onChange={(e) => { setCvssMax(Number(e.target.value)); setPage(1); }}
                      className="w-16 bg-secondary border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>

                {/* KEV Toggle */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kevOnly}
                      onChange={(e) => { setKevOnly(e.target.checked); setPage(1); }}
                      className="accent-primary"
                    />
                    <span className="text-classified text-muted-foreground">KEV LISTED ONLY</span>
                  </label>
                </div>

                {/* Ransomware Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ransomwareOnly}
                      onChange={(e) => { setRansomwareOnly(e.target.checked); setPage(1); }}
                      className="accent-primary"
                    />
                    <span className="text-classified text-muted-foreground">RANSOMWARE-LINKED</span>
                  </label>
                </div>
              </div>

              <div className="border border-border p-4">
                <p className="text-classified text-muted-foreground">
                  {filtered.length} RESULTS
                </p>
              </div>
            </div>

            {/* Results Table */}
            <div className="flex-1">
              <div className="border border-border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-classified text-muted-foreground px-4 py-3">CVE ID</th>
                      <th className="text-left text-classified text-muted-foreground px-4 py-3 hidden md:table-cell">VULNERABILITY</th>
                      <th className="text-center text-classified text-muted-foreground px-4 py-3">CVSS</th>
                      <th className="text-center text-classified text-muted-foreground px-4 py-3 hidden sm:table-cell">EPSS</th>
                      <th className="text-center text-classified text-muted-foreground px-4 py-3">KEV</th>
                      <th className="text-right text-classified text-muted-foreground px-4 py-3 hidden sm:table-cell">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((cve) => (
                      <tr
                        key={cve.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link to={`/cve/${cve.id}`} className="text-primary hover:underline text-sm font-mono">
                            {cve.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-foreground">{cve.name}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-heading text-sm ${cve.cvss >= 9 ? "text-primary" : "text-foreground"}`}>
                            {cve.cvss}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <span className="text-xs text-muted-foreground">{(cve.epss * 100).toFixed(1)}%</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {cve.kev ? (
                            <span className="text-classified text-primary">YES</span>
                          ) : (
                            <span className="text-classified text-muted-foreground">NO</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                          <span className="text-xs text-muted-foreground">{cve.dateAdded}</span>
                        </td>
                      </tr>
                    ))}
                    {paginated.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                          No CVEs match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-classified transition-colors ${
                        p === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Explorer;
