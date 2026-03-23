import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, AlertTriangle, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 20;

interface CveResult {
  id: string;
  description: string;
  cvss: number;
  severity: string;
  epss: number;
  kev: boolean;
  published: string;
}

const Explorer = () => {
  const [search, setSearch] = useState("");
  const [kevOnly, setKevOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [results, setResults] = useState<CveResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));

  const fetchCves = useCallback(async (searchTerm: string, pageNum: number, kev: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("nvd-proxy", {
        body: {
          searchTerm: searchTerm.trim() || undefined,
          startIndex: (pageNum - 1) * ITEMS_PER_PAGE,
          resultsPerPage: ITEMS_PER_PAGE,
          kevOnly: kev,
        },
      });

      if (fnError) throw new Error(fnError.message || "Failed to fetch CVEs");
      if (data?.error) throw new Error(data.error);

      setResults(data.results || []);
      setTotalResults(data.totalResults || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch CVE data.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when page/filters change
  useEffect(() => {
    fetchCves(search, page, kevOnly);
  }, [page, kevOnly]);

  const handleSearch = () => {
    setPage(1);
    fetchCves(search, 1, kevOnly);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const truncate = (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + "…" : text;

  const cvssColor = (cvss: number) => {
    if (cvss >= 9) return "text-destructive";
    if (cvss >= 7) return "text-primary";
    return "text-foreground";
  };

  const FiltersContent = () => (
    <div className="space-y-5">
      <p className="text-classified text-primary">FILTERS</p>
      <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
        <input type="checkbox" checked={kevOnly}
          onChange={(e) => { setKevOnly(e.target.checked); setPage(1); }}
          className="accent-primary w-4 h-4" />
        <span className="text-classified text-muted-foreground">KEV LISTED ONLY</span>
      </label>
      <div className="border-t border-border pt-4">
        <p className="text-classified text-muted-foreground">
          {totalResults} RESULTS
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

          <div className="mb-6 border border-border bg-secondary/20 px-4 py-2.5 flex items-center gap-2">
            <span className="text-primary text-xs">⚠</span>
            <p className="text-xs text-muted-foreground font-mono">
              Live data from NVD + EPSS + CISA KEV. Results may take a moment.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Search CVEs by keyword (e.g. Apache, SMB, Log4j)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <span className="text-classified text-muted-foreground">QUERYING NVD + EPSS + KEV DATABASES...</span>
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
                      <button onClick={() => setFiltersOpen(false)} className="text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                      <FiltersContent />
                    </div>
                    <div className="p-6 border-t border-border">
                      <button onClick={() => setFiltersOpen(false)} className="w-full bg-primary py-3 text-classified text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]">
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
                          <th className="text-left text-classified text-muted-foreground px-4 py-3">DESCRIPTION</th>
                          <th className="text-center text-classified text-muted-foreground px-4 py-3">CVSS</th>
                          <th className="text-center text-classified text-muted-foreground px-4 py-3">EPSS</th>
                          <th className="text-center text-classified text-muted-foreground px-4 py-3">KEV</th>
                          <th className="text-right text-classified text-muted-foreground px-4 py-3">PUBLISHED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((cve) => (
                          <tr key={cve.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <Link to={`/cve/${cve.id}`} className="text-primary hover:underline text-sm font-mono">
                                {cve.id}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-foreground">{truncate(cve.description, 60)}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-heading text-sm ${cvssColor(cve.cvss)}`}>
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
                              <span className="text-xs text-muted-foreground font-mono">{cve.published}</span>
                            </td>
                          </tr>
                        ))}
                        {results.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                              No CVEs found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-3">
                    {results.map((cve) => (
                      <Link
                        key={cve.id}
                        to={`/cve/${cve.id}`}
                        className="block border border-border p-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-primary font-mono text-sm">{cve.id}</span>
                          <span className={`font-heading text-sm ${cvssColor(cve.cvss)}`}>
                            CVSS {cve.cvss}
                          </span>
                        </div>
                        <p className="text-xs text-foreground mb-2 line-clamp-2">{truncate(cve.description, 60)}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">EPSS {(cve.epss * 100).toFixed(1)}%</span>
                          {cve.kev && <span className="text-classified text-primary">KEV</span>}
                          <span className="text-muted-foreground font-mono ml-auto">{cve.published}</span>
                        </div>
                      </Link>
                    ))}
                    {results.length === 0 && (
                      <div className="border border-border p-10 text-center text-muted-foreground text-sm">
                        No CVEs found.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="min-w-[44px] min-h-[44px] border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p: number;
                    if (totalPages <= 5) {
                      p = i + 1;
                    } else if (page <= 3) {
                      p = i + 1;
                    } else if (page >= totalPages - 2) {
                      p = totalPages - 4 + i;
                    } else {
                      p = page - 2 + i;
                    }
                    return (
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
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="min-w-[44px] min-h-[44px] border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
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
