import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-heading text-xl tracking-widest text-primary">
          CVE<span className="text-foreground">/INTEL</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-1"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-4">
          <Link onClick={() => setOpen(false)} to="/explorer" className="text-classified text-muted-foreground hover:text-foreground transition-colors">
            Explorer
          </Link>
          <Link onClick={() => setOpen(false)} to="/cve/CVE-2017-0144" className="text-classified text-muted-foreground hover:text-foreground transition-colors">
            KEV Feed
          </Link>
          <Link onClick={() => setOpen(false)} to="/" className="text-classified text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link
            onClick={() => setOpen(false)}
            to="/explorer"
            className="bg-primary px-4 py-2 text-classified text-primary-foreground hover:bg-primary/90 transition-colors text-center"
          >
            Launch Explorer
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
