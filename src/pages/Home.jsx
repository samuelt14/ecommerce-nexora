import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  MessageCircle,
  Headphones,
  Keyboard,
  Mouse,
  Monitor,
  Cable,
  Sparkles,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductArt from "../components/ProductArt";
import { products, categories, byId } from "../data/products";
import {
  useAnim,
  gsap,
  q,
  revealEls,
  revealGrids,
  heroTimeline,
  floatLoop,
} from "../hooks/useAnim";

const categoryIcons = {
  Auriculares: Headphones,
  Teclados: Keyboard,
  Ratones: Mouse,
  Monitores: Monitor,
  Accesorios: Cable,
};

const ProductRow = ({ title, list, to, subtitle }) => (
  <section className="wrap section">
    <div className="sec-head reveal">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      <Link to={to} className="link-hover">
        Ver todo <ArrowRight size={16} />
      </Link>
    </div>
    <div className="grid">
      {list.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  </section>
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'ok' | 'err' | null

  const heroProduct = byId("aura-one") || products[0];
  const editorialProduct = byId("forge-75") || products.find((p) => p.category === "Teclados") || products[0];

  // Listas de productos organizadas según especificación
  const featured = products
    .filter((p) => p.tags.includes("Destacado"))
    .slice(0, 4);

  const newReleases = products
    .filter((p) => p.tags.includes("Nuevo"))
    .slice(0, 4);

  const bestSellers = [...products]
    .sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0) || a.stock - b.stock)
    .slice(0, 4);

  const ref = useAnim((root) => {
    // 1. Hero animation cinematográfica
    heroTimeline(root, {
      lines: q(root, ".ln > span"),
      sub: q(root, ".hero-sub"),
      cta: q(root, ".hero-cta .btn"),
      art: q(root, ".hero-art"),
    });

    // 2. Float loop en el arte del hero
    const floatTarget = q(root, ".hero-art .float")[0];
    if (floatTarget) {
      floatLoop(floatTarget);
    }

    // 3. Reveal de títulos y grids globales con ScrollTrigger
    revealEls(root, ".reveal");
    revealGrids(root, ".grid");

    // 4. Stagger para tarjetas de categorías
    const catsContainer = q(root, ".cats")[0];
    if (catsContainer) {
      gsap.from(q(root, ".cat"), {
        autoAlpha: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: catsContainer,
          start: "top 88%",
          once: true,
        },
      });
    }

    // 5. Bloque editorial con fade + slide desde abajo
    const editorialBlock = q(root, ".editorial")[0];
    if (editorialBlock) {
      gsap.from(editorialBlock, {
        autoAlpha: 0,
        y: 38,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: editorialBlock,
          start: "top 85%",
          once: true,
        },
      });
    }

    // 6. Stagger para tarjetas de beneficios
    const benefitsContainer = q(root, ".benefits")[0];
    if (benefitsContainer) {
      gsap.from(q(root, ".benefit"), {
        autoAlpha: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: benefitsContainer,
          start: "top 88%",
          once: true,
        },
      });
    }
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (isValidEmail) {
      setNewsletterStatus("ok");
    } else {
      setNewsletterStatus("err");
    }
  };

  return (
    <div ref={ref}>
      {/* 2. Hero Section */}
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow">COLECCIÓN 2026</span>
          <h1>
            <span className="ln">
              <span>Donde el diseño</span>
            </span>
            <span className="ln">
              <span>y el rendimiento</span>
            </span>
            <span className="ln">
              <span>convergen.</span>
            </span>
          </h1>
          <p className="hero-sub">
            Periféricos de alta gama y monitores de precisión creados para quienes
            pasan horas frente al escritorio. Menos ruido, más foco y rendimiento puro.
          </p>
          <div className="hero-cta">
            <Link className="btn" to="/catalogo">
              Explorar productos <ArrowRight size={18} />
            </Link>
            <Link className="btn ghost" to="/catalogo?sort=new">
              Ver novedades
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="float">
            <ProductArt p={heroProduct} />
          </div>
        </div>
      </section>

      {/* 3. Sección Categorías (5 columnas) */}
      <section className="wrap section">
        <div className="sec-head reveal">
          <h2>Categorías</h2>
          <Link to="/catalogo" className="link-hover">
            Ver catálogo completo <ArrowRight size={16} />
          </Link>
        </div>
        <div className="cats">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Headphones;
            const count = products.filter((p) => p.category === cat).length;
            return (
              <Link key={cat} className="cat" to={`/catalogo?cat=${encodeURIComponent(cat)}`}>
                <Icon size={30} />
                <strong>{cat}</strong>
                <small>{count} productos</small>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Sección Destacados (4 productos) */}
      <ProductRow
        title="Destacados"
        subtitle="Los productos insignia elegidos por su acústica, precisión y ergonomía."
        list={featured}
        to="/catalogo"
      />

      {/* 5. Bloque Editorial / Promo (Keyforge) */}
      <section className="wrap section">
        <div className="editorial">
          <div className="editorial-copy">
            <span className="eyebrow">
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              EDITORIAL · SERIE KEYFORGE
            </span>
            <h2>Ingeniería en aluminio y respuesta instantánea.</h2>
            <p>
              Carcasas mecanizadas en CNC, montaje gasket-mount elástico y switches
              mecánicos hot-swap calibrados al milímetro. La línea Keyforge redefine
              el feedback táctil para desarrolladores, creadores y gamers exigentes.
            </p>
            <div className="editorial-cta">
              <Link className="btn" to="/catalogo?brand=Keyforge">
                Descubrir Keyforge <ArrowRight size={18} />
              </Link>
              <Link className="btn ghost" to="/producto/forge-75">
                Ver Forge 75
              </Link>
            </div>
          </div>
          <div className="editorial-art">
            <div className="art-frame">
              <ProductArt p={editorialProduct} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sección Nuevos Lanzamientos (4 productos) */}
      <ProductRow
        title="Nuevos lanzamientos"
        subtitle="Las adiciones más recientes a nuestro catálogo tecnológico."
        list={newReleases}
        to="/catalogo?sort=new"
      />

      {/* 7. Sección Más Vendidos Demo (4 productos) */}
      <ProductRow
        title="Más vendidos demo"
        subtitle="Favoritos de la comunidad por su relación entre innovación y calidad."
        list={bestSellers}
        to="/catalogo"
      />

      {/* 8. Beneficios de Compra */}
      <section className="wrap section">
        <div className="benefits grid">
          <div className="benefit">
            <Truck size={32} />
            <strong>Envío gratis</strong>
            <small>En pedidos desde $399.900 (condiciones sujetas a disponibilidad).</small>
          </div>
          <div className="benefit">
            <ShieldCheck size={32} />
            <strong>Garantía oficial</strong>
            <small>1 año incluida en todos los productos con soporte directo de marca.</small>
          </div>
          <div className="benefit">
            <MessageCircle size={32} />
            <strong>Soporte especializado</strong>
            <small>Atención por WhatsApp en horario demo y asesoría técnica personalizada.</small>
          </div>
        </div>
      </section>

      {/* 9. Newsletter con validación */}
      <section className="wrap section">
        <form className="news reveal" onSubmit={handleNewsletterSubmit} noValidate>
          <div>
            <span className="eyebrow">COMUNIDAD NEXORA</span>
            <h2>Novedades y lanzamientos exclusivos</h2>
            <p className="muted">
              Recibe especificaciones previas, ofertas de temporada y guías de setup.
            </p>
          </div>
          <div>
            <label className="sr" htmlFor="nl-email">
              Correo electrónico
            </label>
            <input
              id="nl-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (newsletterStatus) setNewsletterStatus(null);
              }}
              placeholder="tu@correo.com"
              aria-invalid={newsletterStatus === "err"}
              autoComplete="email"
            />
            <button type="submit" className="btn">
              Suscribirme
            </button>
            <div role="status" style={{ width: "100%", marginTop: "0.4rem" }}>
              {newsletterStatus === "ok" && (
                <p className="okmsg">
                  ✓ ¡Suscripción confirmada! Nota: Solo demo, no se envían correos reales.
                </p>
              )}
              {newsletterStatus === "err" && (
                <p className="err">
                  Introduce una dirección de correo electrónico válida (ej: usuario@dominio.com).
                </p>
              )}
              {!newsletterStatus && (
                <p className="note">
                  Solo demo, no se envían correos reales.
                </p>
              )}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
