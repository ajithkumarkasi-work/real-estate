import { Facebook, House, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 pb-[calc(env(safe-area-inset-bottom)+5rem)] text-slate-200 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 lg:px-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white">
              <House className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold text-white">
              Estate Homes
            </span>
          </div>
          <p className="text-sm text-slate-400">
            A premium platform for discovering, comparing, and saving
            homes with confidence.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Quick Links
          </h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/search">Search</Link>
            <Link to="/map">Map</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Property Types
          </h3>
          <div className="flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/search?type=apartment">Apartments</Link>
            <Link to="/search?type=house">Houses</Link>
            <Link to="/search?type=villa">Villas</Link>
            <Link to="/search?type=penthouse">Penthouses</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h3>
          <p className="text-sm text-slate-400">hello@estatehomes.com</p>
          <p className="text-sm text-slate-400">+1 (800) 555-0199</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 lg:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Estate Homes. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Twitter className="h-4 w-4" />
            <Instagram className="h-4 w-4" />
            <Linkedin className="h-4 w-4" />
            <Facebook className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
