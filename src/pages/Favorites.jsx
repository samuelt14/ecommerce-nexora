import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useStore } from "../context/Store";
import { useAnim, gsap, q, reduced } from "../hooks/useAnim";

export default function Favorites() {
  const { favs, toggleFav, add } = useStore();
  const list = products.filter((p) => favs.includes(p.id));

  // Animación GSAP de entrada de las cards con stagger
  const containerRef = useAnim(
    (root) => {
      const cards = q(root, ".card");
      if (cards.length > 0) {
        gsap.from(cards, {
          autoAlpha: 0,
          y: 24,
          stagger: 0.07,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    },
    [list.length],
  );

  // Animación GSAP al eliminar un favorito (FLIP simplificado: fade y salida a la izquierda antes de quitar del DOM)
  const handleRemoveFav = (e, id) => {
    const cardEl = e?.currentTarget?.closest(".card");
    if (cardEl && !reduced()) {
      gsap.to(cardEl, {
        autoAlpha: 0,
        x: -24,
        scale: 0.94,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          toggleFav(id);
        },
      });
    } else {
      toggleFav(id);
    }
  };

  // Añadir todos los productos de favoritos al carrito
  const handleAddAll = () => {
    list.forEach((p) => {
      add(p.id, p.variants[0]);
    });
  };

  return (
    <div className="wrap section" ref={containerRef}>
      <header className="fav-header">
        <div className="fav-title-wrap">
          <h1 className="page-title" style={{ margin: 0 }}>
            Favoritos
          </h1>
          <span className="fav-badge">{list.length}</span>
        </div>

        {list.length > 0 && (
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={handleAddAll}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ShoppingBag size={16} /> Añadir todos al carrito
            </button>
          </div>
        )}
      </header>

      {list.length > 0 ? (
        <div className="grid g3">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} onToggleFav={handleRemoveFav} />
          ))}
        </div>
      ) : (
        <div className="empty" style={{ padding: "4rem 1rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--bg2)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              color: "var(--mut)",
            }}
          >
            <Heart size={36} strokeWidth={1.5} />
          </div>
          <h2>Aún no has guardado favoritos</h2>
          <p
            className="muted"
            style={{
              maxWidth: "420px",
              margin: "0.6rem auto 1.8rem",
              fontSize: "0.95rem",
            }}
          >
            Explora nuestro catálogo premium y toca el ícono del corazón en los
            productos que te interesen para guardarlos aquí.
          </p>
          <Link className="btn" to="/catalogo">
            Explorar catálogo <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
