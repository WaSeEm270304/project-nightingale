import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm, startIndex = 0, resultsPerPage = 20, kevOnly = false, cveId } = await req.json();
    const nvdApiKey = Deno.env.get("NVD_API_KEY") || "";

    // Build NVD URL
    let nvdUrl: string;

    if (cveId) {
      // Single CVE lookup
      nvdUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`;
    } else {
      const params = new URLSearchParams({
        resultsPerPage: String(resultsPerPage),
        startIndex: String(startIndex),
        pubStartDate: "2020-01-01T00:00:00.000",
        pubEndDate: new Date().toISOString().split(".")[0] + ".000",
      });
      if (searchTerm) {
        params.set("keywordSearch", searchTerm);
      }
      nvdUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?${params}`;
    }
    const headers: Record<string, string> = {};
    if (nvdApiKey) {
      headers["apiKey"] = nvdApiKey;
    }

    const nvdRes = await fetch(nvdUrl, { headers });
    if (!nvdRes.ok) {
      throw new Error(`NVD API error: ${nvdRes.status}`);
    }
    const nvdData = await nvdRes.json();

    const totalResults = nvdData.totalResults || 0;
    const vulnerabilities = nvdData.vulnerabilities || [];

    // Collect CVE IDs for EPSS batch lookup
    const cveIds = vulnerabilities.map((v: any) => v.cve.id);

    // Fetch EPSS scores in batch
    let epssMap: Record<string, number> = {};
    if (cveIds.length > 0) {
      try {
        const epssRes = await fetch(`https://api.first.org/data/v1/epss?cve=${cveIds.join(",")}`);
        if (epssRes.ok) {
          const epssData = await epssRes.json();
          for (const item of epssData.data || []) {
            epssMap[item.cve] = parseFloat(item.epss) || 0;
          }
        }
      } catch {
        // EPSS is optional, continue without it
      }
    }

    // Fetch KEV catalog if needed
    let kevSet: Set<string> | null = null;
    if (kevOnly) {
      try {
        const kevRes = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json");
        if (kevRes.ok) {
          const kevData = await kevRes.json();
          kevSet = new Set((kevData.vulnerabilities || []).map((v: any) => v.cveID));
        }
      } catch {
        // KEV fetch failed, skip filter
      }
    }

    // Also do a lightweight KEV check for all results (to show YES/NO)
    let allKevSet: Set<string> | null = null;
    if (!kevOnly) {
      try {
        const kevRes = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json");
        if (kevRes.ok) {
          const kevData = await kevRes.json();
          allKevSet = new Set((kevData.vulnerabilities || []).map((v: any) => v.cveID));
        }
      } catch {
        // continue without KEV data
      }
    }

    const kevLookup = kevSet || allKevSet;

    // Transform results
    let results = vulnerabilities.map((v: any) => {
      const cve = v.cve;
      const metrics = cve.metrics || {};
      let cvss = 0;
      let severity = "UNKNOWN";

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

      const desc = cve.descriptions?.find((d: any) => d.lang === "en")?.value || "No description available.";
      const published = cve.published?.split("T")[0] || "Unknown";
      const isKev = kevLookup ? kevLookup.has(cve.id) : false;

      return {
        id: cve.id,
        description: desc,
        cvss,
        severity,
        epss: epssMap[cve.id] || 0,
        kev: isKev,
        published,
      };
    });

    // Filter to KEV only if requested
    if (kevOnly && kevSet) {
      results = results.filter((r: any) => r.kev);
    }

    return new Response(JSON.stringify({
      results,
      totalResults: kevOnly ? results.length : totalResults,
      resultsPerPage,
      startIndex,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("nvd-proxy error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
