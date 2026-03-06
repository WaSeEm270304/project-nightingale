import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { mockCVEs } from "@/data/mockCves";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, AlertTriangle, Search, SlidersHorizontal, X } from "lucide-react";

const ITEMS_PER_PAGE = 6;

interface NvdResult {
  id: string;
  name: string;
  vendor: string;
  product: string;
  cvss: number;
  epss: number;
  kev: boolean;
  ransomware: boolean;
  cwe: string;
  dateAdded: string;
  severity: string;
  description: string;
}

const CVE_ID_REGEX = /^CVE-\d{4}-\d{4,}$/i;

const Explorer = () => {
  const [search, setSearch] = useState("");
  const [cvssMin, setCvssMin] = useState(0);
  const [cvssMax, setCvssMax] = useState(10);
  const [kevOnly, setKevOnly] = useState(false);
  const [ransomwareOnly, setRansomwareOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [apiResults, setApiResults] = useState<NvdResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchCve = useCallback(async (cveId: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setApiResults([]);

    try {
      const [nvdRes, epssRes] = await Promise.all([
        fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`),
        fetch(`https://api.first.org/data/v1/epss?cve=${cveId}`),
      ]);

      if (!nvdRes.ok) throw new Error(`NVD API error: ${nvdRes.status}`);

      const nvdData = await nvdRes.json();
      const epssData = await epssRes.json();

      if (!nvdData.vulnerabilities || nvdData.vulnerabilities.length === 0) {
        setError(`No results found for ${cveId}`);
        return;
      }

      const vuln = nvdData.vulnerabilities[0].cve;
      const epssScore = epssData?.data?.[0]?.epss ? parseFloat(epssData.data[0].epss) : 0;

      let cvss = 0;
      let severity = "UNKNOWN";
      const metrics = vuln.metrics || {};
      if (metrics.cvssMetricV31?.[0]) {
        cvss = metrics.cvssMetricV31[0].cvssData.baseScore;
        severity = metrics.cvssMetricV31[0].cvssData.baseSeverity;
      } else if (metrics.cvssMetricV30?.[0]) {
        cvss = metrics.cvssMetricV30[0].cvssData.baseScore;
        severity = metrics.cvssMetricV30[0].cvssData.baseSeverity;
      } else if (metrics.cvssMetricV2?.[0]) {
        cvss = metrics.cvssMetricV2[0].cvssData.baseScore;
        severity = metrics.cvssMetricV2[0].baseSeverity || "UNKNOWN";
      }

      const desc = vuln.descriptions?.find((d: any) => d.lang === "en")?.value || "No description available.";
      const cwe = vuln.weaknesses?.[0]?.description?.[0]?.value || "N/A";
      const published = vuln.published?.split("T")[0] || "Unknown";

      setApiResults([{
        id: vuln.id,
        name: desc.length > 80 ? desc.slice(0, 80) + "…" : desc,
        vendor: "—",
        product: "—",
        cvss,
        epss: epssScore,
        kev: false,
        ransomware: false,
        cwe,
        dateAdded: published,
        severity,
        description: desc,
      }]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch CVE data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    const q = search.trim();
    if (CVE_ID_REGEX.test(q)) {
      fetchCve(q.toUpperCase());
    } else {
      setHasSearched(false);
      setApiResults([]);
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockCVEs.filter((cve) => {
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

  const showApiResults = hasSearched;
  const displayData = showApiResults ? apiResults : filtered;
  const totalPages = showApiResults ? 1 : Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = showApiResults ? apiResults : filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const FiltersContent = () => (
    <div className="space-y-5">
      <p className="text-classified text-primary">FILTERS</p>
      <div>
        <p className="text-classified text-muted-foreground mb-2">CVSS RANGE</p>
        <div className="flex items-center gap-2">
          <input type="number" min={0} max={10} step={0.1} value={cvssMin}
            onChange={(e) => { setCvssMin(Number(e.target.value)); setPage(1); }}
            className="w-16 bg-input border border-border px-2 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono min-h-[44px]" />
          <span className="text-muted-foreground text-xs">to</span>
          <input type="number" min={0} max={10} step={0.1} value={cvssMax}
            onChange={(e) => { setCvssMax(Number(e.target.value)); setPage(1); }}
            className="w-16 bg-input border border-border px-2 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono min-h-[44px]" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
        <input type="checkbox" checked={kevOnly}
          onChange={(e) => { setKevOnly(e.target.checked); setPage(1); }}
          className="accent-primary w-4 h-4" />
        <span className="text-classified text-muted-foreground">KEV LISTED ONLY</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
        <input type="checkbox" checked={ransomwareOnly}
          onChange={(e) => { setRansomwareOnly(e.target.checked); setPage(1); }}
          className="accent-primary w-4 h-4" />
        <span className="text-classified text-muted-foreground">RANSOMWARE-LINKED</span>
      </label>
      <div className="border-t border-border pt-4">
        <p className="text-classified text-muted-foreground">
          {displayData.length} RESULTS {showApiResults ? "(NVD)" : "(LOCAL)"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="scanline-overlay min-h-screen bg-background">
      <div className="bg-primary py-1.5 text-center">
        <p className="text-classified text-primary-foreground tracking-[0.3em]">
          ★ TOP SECRET // CVE INTELLIGENCE PLATFORM ★
        </p>
      </div>
      <Navbar />

      <div className="container mx-auto py-8 md:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-classified text-primary mb-2 tracking-[0.3em]">// CVE EXPLORER</p>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-6">
            Search & Filter Vulnerabilities
          </h1>

          {/* AI Banner */}
          <div className="mb-6 border border-border bg-secondary/20 px-4 py-2.5 flex items-center gap-2">
            <span className="text-primary text-xs">⚠</span>
            <p className="text-xs text-muted-foreground font-mono">
              Showing AI-generated narratives. Source data from NVD + KEV + EPSS.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Search by CVE ID (e.g. CVE-2021-44228)..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); if (!e.target.value.trim()) { setHasSearched(false); setApiResults([]); setError(null); } }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-mono min-h-[44px]"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary px-4 py-3 text-classified text-primary-foreground hover:bg-primary/90 transition-colors border border-primary disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="hidden sm:inline">SEARCH</span>
            </button>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden bg-secondary border border-border px-3 py-3 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline text-classified">FILTERS</span>
            </button>
          </div>

          {/* Status messages */}
          {loading && (
            <div className="mb-6 border border-border p-6 flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-classified text-muted-foreground">QUERYING NVD & EPSS DATABASES...</span>
            </div>
          )}

          {error && (
            <div className="mb-6 border border-primary/50 p-4 flex items-center gap-3 bg-primary/5">
              <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">{error}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Filters Sidebar - desktop */}
            <div className="hidden lg:block lg:w-60 shrink-0">
              <div className="border border-border p-5 sticky top-20">
                <FiltersContent />
              </div>
            </div>

            {/* Mobile filter drawer */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm lg:hidden"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                      <p className="text-classified text-primary tracking-[0.3em]">FILTERS</p>
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                      <FiltersContent />
                    </div>
                    <div className="p-6 border-t border-border">
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="w-full bg-primary py-3 text-classified text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]"
                      >
                        APPLY FILTERS
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {!loading && (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block border border-border overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/20">
                          <th className="text-left text-classified text-muted-foreground px-4 py-3">CVE ID</th>
                          <th className="text-left text-classified text-muted-foreground px-4 py-3">VULNERABILITY</th>
                          <th className="text-center text-classified text-muted-foreground px-4 py-3">CVSS</th>
                          <th className="text-center text-classified text-muted-foreground px-4 py-3">EPSS</th>
                          <th className="text-center text-classified text-muted-foreground px-4 py-3">KEV</th>
                          <th className="text-right text-classified text-muted-foreground px-4 py-3">DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((cve) => (
                          <tr key={cve.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <Link to={`/cve/${cve.id}`} className="text-primary hover:underline text-sm font-mono">
                                {cve.id}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-foreground">{cve.name}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-heading text-sm ${cve.cvss >= 9 ? "text-primary" : "text-foreground"}`}>
                                {cve.cvss}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-xs text-muted-foreground">{(cve.epss * 100).toFixed(1)}%</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {cve.kev ? (
                                <span className="text-classified text-primary">YES</span>
                              ) : (
                                <span className="text-classified text-muted-foreground">NO</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs text-muted-foreground font-mono">{cve.dateAdded}</span>
                            </td>
                          </tr>
                        ))}
                        {paginated.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                              {hasSearched ? "No results from NVD." : "No CVEs match your criteria."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-3">
                    {paginated.map((cve) => (
                      <Link
                        key={cve.id}
                        to={`/cve/${cve.id}`}
                        className="block border border-border p-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-primary font-mono text-sm">{cve.id}</span>
                          <span className={`font-heading text-sm ${cve.cvss >= 9 ? "text-primary" : "text-foreground"}`}>
                            CVSS {cve.cvss}
                          </span>
                        </div>
                        <p className="text-xs text-foreground mb-2 line-clamp-2">{cve.name}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">EPSS {(cve.epss * 100).toFixed(1)}%</span>
                          {cve.kev && <span className="text-classified text-primary">KEV</span>}
                          <span className="text-muted-foreground font-mono ml-auto">{cve.dateAdded}</span>
                        </div>
                      </Link>
                    ))}
                    {paginated.length === 0 && (
                      <div className="border border-border p-10 text-center text-muted-foreground text-sm">
                        {hasSearched ? "No results from NVD." : "No CVEs match your criteria."}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Pagination */}
              {!showApiResults && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[44px] min-h-[44px] text-classified transition-colors ${
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
