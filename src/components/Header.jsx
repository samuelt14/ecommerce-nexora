import { useState, useRef, useEffect, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";
import ProductArt from "./ProductArt";
import { useStore } from "../context/Store";
import { products, cop } from "../data/products";
import { gsap, reduced } from "../hooks/useAnim";

export default function Header() {
  const { count, favs, user, setDrawer } = useStore();
  const nav = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const badge = useRef(null);
  const first = useRef(true);
  const navRef = useRef(null);
  const searchDeskRef = useRef(null);
  const searchMobRef = useRef(null);

  // Badge animation on count change
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!reduced() && badge.current) {
      gsap.fromTo(
        badge.current,
        { scale: 1.8 },
        { scale: 1, duration: 0.5, ease: "back.out(3)" }
      );
    }
  }, [count]);

  // Mobile nav entrance animation with GSAP stagger
  useEffect(() => {
    if (open && !reduced() && navRef.current) {
      const ctx = gsap.context(() => {
        const items = navRef.current.querySelectorAll("a, .search");
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: -10 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.28,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }, navRef);

      return () => ctx.revert();
    }
  }, [open]);

  // Filter products in real time (up to 5 results)
  const searchResults = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.desc && p.desc.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [term]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesk = searchDeskRef.current && searchDeskRef.current.contains(e.target);
      const inMob = searchMobRef.current && searchMobRef.current.contains(e.target);
      if (!inDesk && !inMob) {
        setShowDropdown(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = term.trim();
    setShowDropdown(false);
    setOpen(false);
    nav(`/catalogo${clean ? `?q=${encodeURIComponent(clean)}` : ""}`);
  };

  const handleSelectProduct = (id) => {
    setShowDropdown(false);
    setTerm("");
    setOpen(false);
    nav(`/producto/${id}`);
  };

  const isCatActive = (cat) =>
    location.pathname === "/catalogo" &&
    new URLSearchParams(location.search).get("cat") === cat;

  const renderDropdown = () => {
    if (!showDropdown || !term.trim()) return null;
    return (
      <div className="search-dropdown" role="listbox" aria-label="Resultados de búsqueda rápida">
        {searchResults.length > 0 ? (
          <>
            <div className="search-results-list">
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  className="search-item"
                  role="option"
                  aria-selected="false"
                  onClick={() => handleSelectProduct(p.id)}
                >
                  <div className="search-thumb">
                    <ProductArt p={p} size={36} />
                  </div>
                  <div className="search-info">
                    <strong className="search-title">{p.name}</strong>
                    <div className="search-meta">
                      <span>{p.brand} · {p.category}</span>
                      <span className="search-price">{cop(p.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="search-all-btn"
              onClick={handleSearchSubmit}
            >
              Ver todos los resultados para &ldquo;{term.trim()}&rdquo; →
            </button>
          </>
        ) : (
          <div className="search-empty">
            No se encontraron productos para &ldquo;{term.trim()}&rdquo;
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <AnnouncementBar />
      <header className="header">
        <div className="wrap hbar">
          <button
            className="icon-btn menu-btn"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X /> : <Menu />}
          </button>

          <Link to="/" className="logo" aria-label="NEXORA inicio">
            <span>N</span>EXORA
          </Link>

          <nav
            ref={navRef}
            className={`nav ${open ? "open" : ""}`}
            aria-label="Navegación principal"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/catalogo"
              end
              className={({ isActive }) =>
                isActive && !location.search ? "active" : ""
              }
              onClick={() => setOpen(false)}
            >
              Catálogo
            </NavLink>
            <NavLink
              to="/catalogo?cat=Teclados"
              className={() => (isCatActive("Teclados") ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              Teclados
            </NavLink>
            <NavLink
              to="/catalogo?cat=Ratones"
              className={() => (isCatActive("Ratones") ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              Ratones
            </NavLink>
            <NavLink
              to="/catalogo?cat=Auriculares"
              className={() => (isCatActive("Auriculares") ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              Audio
            </NavLink>
            <NavLink
              to="/catalogo?cat=Monitores"
              className={() => (isCatActive("Monitores") ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              Monitores
            </NavLink>

            {/* Mobile Search */}
            <div className="search-wrap mob" ref={searchMobRef}>
              <form
                className="search mob"
                onSubmit={handleSearchSubmit}
                role="search"
              >
                <Search size={16} aria-hidden="true" />
                <input
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Buscar productos"
                  aria-label="Buscar en NEXORA"
                />
              </form>
              {renderDropdown()}
            </div>
          </nav>

          {/* Desktop Search */}
          <div className="search-wrap desk" ref={searchDeskRef}>
            <form
              className="search desk"
              onSubmit={handleSearchSubmit}
              role="search"
            >
              <Search size={16} aria-hidden="true" />
              <input
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Buscar productos"
                aria-label="Buscar en NEXORA"
              />
            </form>
            {renderDropdown()}
          </div>

          <div className="actions">
            <Link
              className="icon-btn"
              to="/favoritos"
              aria-label={`Favoritos (${favs.length})`}
            >
              <Heart />
              {favs.length > 0 && <i className="dot">{favs.length}</i>}
            </Link>
            <Link
              className="icon-btn"
              to="/cuenta"
              aria-label={user ? `Cuenta de ${user.name}` : "Mi cuenta"}
            >
              <User />
            </Link>
            <button
              className="icon-btn"
              onClick={() => setDrawer(true)}
              aria-label={`Carrito de compras (${count} productos)`}
            >
              <ShoppingBag />
              <i className="dot" ref={badge}>
                {count}
              </i>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
