import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-heading text-xl tracking-widest text-primary">
          CVE<span className="text-foreground">/INTEL</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/explorer" className="text-classified text-muted-foreground hover:text-foreground transition-colors">
            Explorer
          </Link>
          <Link to="/cve/CVE-2017-0144" className="text-classified text-muted-foreground hover:text-foreground transition-colors">
            KEV Feed
          </Link>
          <Link to="/" className="text-classified text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link
            to="/explorer"
            className="bg-primary px-4 py-1.5 text-classified text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Launch Explorer
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
