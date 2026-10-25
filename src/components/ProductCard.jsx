import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import ProductArt from "./ProductArt";
import { useStore } from "../context/Store";
import { cop } from "../data/products";
import { gsap, reduced } from "../hooks/useAnim";

export default function ProductCard({ p }) {
  const { favs, toggleFav, add } = useStore();
  const fav = favs.includes(p.id);
  const cardRef = useRef(null);
  const btnRef = useRef(null);

  // Rating determinista si no viene en los datos del producto
  const ratingVal =
    typeof p.rating === "object" && p.rating !== null
      ? p.rating.score
      : typeof p.rating === "number"
      ? p.rating
      : +(4.6 + ((p.hue || 100) % 5) * 0.08).toFixed(1);
  const reviewsCount =
    typeof p.rating === "object" && p.rating !== null
      ? p.rating.count
      : p.reviewsCount ?? (15 + ((p.hue || 50) % 43));

  // GSAP: microinteracción de elevación y botón al hacer hover
  useEffect(() => {
    if (reduced() || !cardRef.current) return;

    const card = cardRef.current;
    const btn = btnRef.current;
    const ctx = gsap.context(() => {}, cardRef);

    const onEnter = () => {
      if (reduced()) return;
      ctx.add(() => {
        gsap.to(card, {
          y: -4,
          boxShadow: "0 18px 36px rgba(0, 0, 0, 0.45)",
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
        if (btn) {
          gsap.to(btn, {
            y: -2,
            scale: 1.02,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    const onLeave = () => {
      if (reduced()) return;
      ctx.add(() => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
          clearProps: "boxShadow,y",
        });
        if (btn) {
          gsap.to(btn, {
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "transform",
          });
        }
      });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      ctx.revert();
    };
  }, []);

  const discountPercent = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

  return (
    <article className="card" ref={cardRef}>
      <Link
        to={`/producto/${p.id}`}
        className="card-media"
        aria-label={`Ver detalles de ${p.name}`}
      >
        <ProductArt p={p} />
        <span className="tags">
          {p.tags?.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {p.old && <span className="tag sale">−{discountPercent}%</span>}
        </span>
      </Link>

      <button
        type="button"
        className={`icon-btn fav ${fav ? "on" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          toggleFav(p.id);
        }}
        aria-pressed={fav}
        aria-label={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart size={18} fill={fav ? "currentColor" : "none"} />
      </button>

      <div className="card-body">
        <small>
          {p.brand} · {p.category}
        </small>

        <h3>
          <Link to={`/producto/${p.id}`}>{p.name}</Link>
        </h3>

        <div
          className="rating"
          aria-label={`Calificación ${ratingVal} de 5 estrellas (${reviewsCount} opiniones)`}
        >
          <span className="stars" aria-hidden="true">
            ★★★★★
          </span>
          <span className="rating-score">{ratingVal}</span>
          <span className="rating-count">({reviewsCount})</span>
        </div>

        <div className="price">
          <strong>{cop(p.price)}</strong>
          {p.old && <s>{cop(p.old)}</s>}
        </div>

        <button
          ref={btnRef}
          type="button"
          className="btn btn-sm card-add-btn"
          onClick={() => add(p.id, p.variants?.[0] || "Estándar")}
          aria-label={`Añadir ${p.name} al carrito`}
        >
          <ShoppingBag size={16} /> Añadir
        </button>
      </div>
    </article>
  );
}
