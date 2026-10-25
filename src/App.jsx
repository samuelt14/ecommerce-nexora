import { useEffect, useRef } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Info from "./pages/Info";
import { useStore } from "./context/Store";
import { gsap, reduced } from "./hooks/useAnim";
export default function App() {
  const { pathname } = useLocation(),
    { toast } = useStore(),
    main = useRef(),
    tr = useRef();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!reduced() && main.current)
      gsap.fromTo(
        main.current,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "all",
        },
      );
  }, [pathname]);
  useEffect(() => {
    if (toast && tr.current && !reduced())
      gsap.fromTo(
        tr.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" },
      );
  }, [toast]);
  useEffect(() => {
    // microinteracción de pulsación en botones (delegada, GSAP)
    const dn = (e) => {
      const b = e.target.closest(".btn,.icon-btn,.chip");
      if (b && !reduced()) gsap.to(b, { scale: 0.94, duration: 0.12 });
    };
    const up = (e) => {
      const b = e.target.closest(".btn,.icon-btn,.chip");
      if (b && !reduced())
        gsap.to(b, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };
    addEventListener("pointerdown", dn);
    addEventListener("pointerup", up);
    return () => {
      removeEventListener("pointerdown", dn);
      removeEventListener("pointerup", up);
    };
  }, []);
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Header />
      <main id="main" ref={main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/info/:slug" element={<Info />} />
          <Route
            path="*"
            element={
              <div className="wrap section empty">
                <p>Página no encontrada.</p>
                <Link className="btn" to="/">
                  Ir al inicio
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      {toast && (
        <div className="toast" ref={tr} role="status" key={toast.k}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
