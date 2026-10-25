import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Check,
  Star,
  ShoppingBag,
  ArrowRight,
  PackageX,
} from "lucide-react";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import { byId, products, cop } from "../data/products";
import { useStore } from "../context/Store";
import { useAnim, gsap, q, revealGrids, reduced } from "../hooks/useAnim";

export default function Product() {
  const { id } = useParams();
  const p = byId(id);
  const { add, favs, toggleFav } = useStore();

  const [view, setView] = useState(0);
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);
  const mainImageRef = useRef(null);

  // Reiniciar estado cada vez que cambia el producto
  useEffect(() => {
    setView(0);
    setQty(1);
    setVariant(p?.variants?.[0] || "");
    if (p) {
      document.title = `${p.name} — NEXORA`;
      window.scrollTo(0, 0);
    }
  }, [id, p]);

  // Timeline GSAP de entrada al cargar el producto
  const ref = useAnim(
    (root) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q(root, ".crumbs"), { autoAlpha: 0, y: -12, duration: 0.4 })
        .from(q(root, ".gallery"), { autoAlpha: 0, x: -28, duration: 0.6 }, "-=0.2")
        .from(
          q(root, ".info > *"),
          {
            autoAlpha: 0,
            y: 20,
            stagger: 0.06,
            duration: 0.5,
            clearProps: "all",
          },
          "-=0.3"
        );

      // ScrollTrigger reveal para la sección de productos relacionados
      revealGrids(root, ".rel");
    },
    [id]
  );

  // Transición de miniatura con GSAP
  const handleThumbnailClick = (newViewIndex) => {
    if (newViewIndex === view) return;
    setView(newViewIndex);
    if (!reduced() && mainImageRef.current) {
      gsap.fromTo(
        mainImageRef.current,
        { autoAlpha: 0, scale: 0.97 },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  };

  // Microinteracción scale pulse al pulsar "Añadir al carrito"
  const handleAddToCart = (e) => {
    const btn = e.currentTarget;
    if (!reduced()) {
      gsap.timeline()
        .to(btn, { scale: 0.96, duration: 0.08, ease: "power1.in" })
        .to(btn, { scale: 1.02, duration: 0.14, ease: "back.out(2)" })
        .to(btn, { scale: 1, duration: 0.12, ease: "power1.out" });
    }
    add(p.id, variant, qty);
  };

  // Manejo de producto no encontrado
  if (!p) {
    return (
      <div className="wrap section empty">
        <PackageX size={56} className="muted" />
        <h2>Producto no encontrado</h2>
        <p className="muted">
          El artículo que buscas no existe o ha sido retirado de nuestra colección.
        </p>
        <Link className="btn" to="/catalogo">
          Volver al catálogo <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const isFavorite = favs.includes(p.id);
  const relatedProducts = products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, 4);

  const discountPercent = p.old
    ? Math.round((1 - p.price / p.old) * 100)
    : 0;

  const ratingScore = p.rating?.score ?? 4.8;
  const ratingCount = p.rating?.count ?? 42;

  const isLowStock = p.stock < 5;
  const stockText = isLowStock
    ? `¡Últimas ${p.stock} unidades!`
    : `${p.stock} unidades disponibles`;
  const stockPercentage = Math.min(100, Math.round((p.stock / 30) * 100));

  return (
    <div className="wrap section" ref={ref}>
      {/* Breadcrumbs: Inicio > Categoría > Nombre */}
      <nav className="crumbs" aria-label="Migas de pan">
        <Link to="/">Inicio</Link> /{" "}
        <Link to={`/catalogo?cat=${encodeURIComponent(p.category)}`}>
          {p.category}
        </Link>{" "}
        / <span>{p.name}</span>
      </nav>

      {/* Detalle Principal: Galería + Info */}
      <div className="pdp">
        {/* Nueva Galería */}
        <div className="gallery">
          {/* Imagen Principal Grande */}
          <div className="gallery-main" ref={mainImageRef}>
            <ProductArt p={p} view={view} />
          </div>

          {/* Miniaturas interactivas (variaciones de color/ángulo del SVG) */}
          <div className="gallery-thumbs">
            {[0, 1, 2, 3].map((thumbIndex) => (
              <button
                key={thumbIndex}
                type="button"
                className={view === thumbIndex ? "on" : ""}
                onClick={() => handleThumbnailClick(thumbIndex)}
                aria-label={`Ver perspectiva ${thumbIndex + 1}`}
                aria-pressed={view === thumbIndex}
              >
                <ProductArt p={p} view={thumbIndex} />
              </button>
            ))}
          </div>
        </div>

        {/* Info del Producto */}
        <div className="info">
          <small className="muted">
            {p.brand} · {p.category}
          </small>

          <h1>{p.name}</h1>

          {/* Calificación por estrellas proporcional al score */}
          <div className="rating-row">
            <div
              className="rating-stars"
              aria-label={`Calificación de ${ratingScore} sobre 5 estrellas`}
            >
              {[1, 2, 3, 4, 5].map((starNum) => {
                const fillRatio = Math.max(0, Math.min(1, ratingScore - (starNum - 1)));
                return (
                  <span key={starNum} className="star-wrap">
                    <Star size={18} className="star-empty" />
                    {fillRatio > 0 && (
                      <span
                        className="star-fill"
                        style={{ width: `${Math.round(fillRatio * 100)}%` }}
                      >
                        <Star size={18} fill="currentColor" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="rating-score">{ratingScore.toFixed(1)}</span>
            <span className="rating-count">({ratingCount} opiniones)</span>
          </div>

          {/* Precios y descuento */}
          <div className="price lg">
            <strong>{cop(p.price)}</strong>
            {p.old && <s>{cop(p.old)}</s>}
            {discountPercent > 0 && (
              <span className="tag sale">−{discountPercent}% OFF</span>
            )}
          </div>

          {/* Descripción Completa */}
          <p className="hero-sub" style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
            {p.desc}
          </p>

          {/* Selector de Variante (chips) */}
          {p.variants && p.variants.length > 0 && (
            <fieldset className="variants">
              <legend>Variante / Acabado</legend>
              {p.variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`chip ${variant === v ? "on" : ""}`}
                  aria-pressed={variant === v}
                  onClick={() => setVariant(v)}
                >
                  {v}
                </button>
              ))}
            </fieldset>
          )}

          {/* Barra de Stock Visual */}
          <div style={{ marginTop: "0.2rem" }}>
            <p className="stock">
              <Check
                size={16}
                style={{
                  color: isLowStock ? "var(--err)" : "var(--ac)",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: isLowStock ? "var(--err)" : "inherit", fontWeight: isLowStock ? 600 : 400 }}>
                {stockText} (demo)
              </span>
            </p>
            <div
              className="stock-bar"
              role="progressbar"
              aria-valuenow={p.stock}
              aria-valuemin={0}
              aria-valuemax={30}
              aria-label="Nivel de stock disponible"
            >
              <div
                className={`stock-fill ${isLowStock ? "critical" : p.stock < 10 ? "low" : ""}`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          </div>

          {/* Controles de Compra: Cantidad + Añadir + Favorito */}
          <div className="buy" style={{ marginTop: "0.5rem" }}>
            <div className="qty">
              <button
                type="button"
                className="icon-btn"
                aria-label="Restar una unidad"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                disabled={qty <= 1}
              >
                <Minus size={16} />
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Sumar una unidad"
                onClick={() => setQty((prev) => Math.min(p.stock, prev + 1))}
                disabled={qty >= p.stock}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className="btn btn-lg"
              onClick={handleAddToCart}
              style={{ flex: 1 }}
            >
              <ShoppingBag size={18} /> Añadir al carrito
            </button>

            <button
              type="button"
              className={`icon-btn bordered ${isFavorite ? "on" : ""}`}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              onClick={() => toggleFav(p.id)}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Indicadores de Envío y Garantía */}
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.6rem" }}>
            <p className="ship">
              <Truck size={17} style={{ color: "var(--ac)", flexShrink: 0 }} />
              <span>
                Envío estándar 3–5 días · Express 24 h · Retiro gratis en tienda (demo)
              </span>
            </p>
            <p className="ship">
              <ShieldCheck size={17} style={{ color: "var(--ac)", flexShrink: 0 }} />
              <span>
                Garantía oficial de 1 año con soporte técnico y reemplazo directo
              </span>
            </p>
          </div>

          {/* Especificaciones Técnicas */}
          {p.specs && Object.keys(p.specs).length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem" }}>
                Especificaciones técnicas
              </h3>
              <table className="specs">
                <tbody>
                  {Object.entries(p.specs).map(([specKey, specVal]) => (
                    <tr key={specKey}>
                      <th>{specKey}</th>
                      <td>{specVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Productos Relacionados (misma categoría, excluye actual, máx 4) */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: "var(--s5)" }}>
          <div className="sec-head reveal">
            <div>
              <h2 className="sec-title" style={{ margin: 0 }}>
                Productos relacionados
              </h2>
              <p className="muted">
                Más opciones en la categoría de {p.category.toLowerCase()}.
              </p>
            </div>
            <Link
              to={`/catalogo?cat=${encodeURIComponent(p.category)}`}
              className="link-hover"
            >
              Ver categoría <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid rel">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} p={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
