import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/explorer", label: "Explorer" },
  { to: "/cve/CVE-2017-0144", label: "KEV Feed" },
  { to: "/", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <Link to="/" className="font-heading text-xl tracking-[0.15em] text-primary">
            CVE<span className="text-foreground">/INTEL</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                className="text-classified text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/explorer"
              className="bg-primary px-5 py-2 text-classified text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px] flex items-center"
            >
              Launch Explorer
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between h-14 px-6 border-b border-border">
              <Link onClick={() => setOpen(false)} to="/" className="font-heading text-xl tracking-[0.15em] text-primary">
                CVE<span className="text-foreground">/INTEL</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-8">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    onClick={() => setOpen(false)}
                    to={l.to}
                    className="font-heading text-3xl text-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  onClick={() => setOpen(false)}
                  to="/explorer"
                  className="bg-primary px-6 py-4 text-classified text-primary-foreground hover:bg-primary/90 transition-colors text-center block min-h-[44px]"
                >
                  Launch Explorer
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
