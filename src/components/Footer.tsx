import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-heading text-lg text-primary mb-4">CVE/INTEL</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Classified-grade CVE intelligence. Every vulnerability has a story — we tell it right.
            </p>
          </div>
          <div>
            <h5 className="text-classified text-foreground mb-3">Platform</h5>
            <div className="flex flex-col gap-2">
              <Link to="/explorer" className="text-xs text-muted-foreground hover:text-primary transition-colors">CVE Explorer</Link>
              <Link to="/cve/CVE-2017-0144" className="text-xs text-muted-foreground hover:text-primary transition-colors">KEV Feed</Link>
              <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">API Access</Link>
            </div>
          </div>
          <div>
            <h5 className="text-classified text-foreground mb-3">Resources</h5>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Documentation</span>
              <span className="text-xs text-muted-foreground">Methodology</span>
              <span className="text-xs text-muted-foreground">Changelog</span>
            </div>
          </div>
          <div>
            <h5 className="text-classified text-foreground mb-3">Legal</h5>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Privacy Policy</span>
              <span className="text-xs text-muted-foreground">Terms of Service</span>
              <span className="text-xs text-muted-foreground">Data Sources</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 flex items-center justify-between">
          <p className="text-classified text-muted-foreground">
            © 2026 CVE/INTEL — CLASSIFIED INTELLIGENCE PLATFORM
          </p>
          <p className="text-classified text-muted-foreground">
            ALL DATA SOURCED FROM NVD, CISA KEV, MITRE
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
