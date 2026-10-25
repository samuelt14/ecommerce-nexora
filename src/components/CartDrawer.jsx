import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, Tag, Check } from "lucide-react";
import { useStore } from "../context/Store";
import { cop, DISCOUNT_CODES } from "../data/products";
import ProductArt from "./ProductArt";
import { gsap, reduced } from "../hooks/useAnim";

export default function CartDrawer() {
  const {
    drawer,
    setDrawer,
    lines,
    subtotal,
    setQty,
    remove,
    clear,
    discount,
    setDiscount,
  } = useStore();

  const [shown, setShown] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const panel = useRef(null);
  const veil = useRef(null);
  const listRef = useRef(null);
  const prevLen = useRef(lines.length);

  useEffect(() => {
    if (drawer) setShown(true);
  }, [drawer]);

  // Animación de entrada del drawer
  useEffect(() => {
    if (!shown || !drawer || !panel.current) return;
    panel.current.focus();
    if (reduced()) return;
    gsap.fromTo(
      panel.current,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.45, ease: "power3.out" }
    );
    gsap.fromTo(
      veil.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 }
    );
  }, [shown, drawer]);

  // Animación al añadir un nuevo item cuando el drawer está abierto
  useEffect(() => {
    if (
      lines.length > prevLen.current &&
      drawer &&
      !reduced() &&
      listRef.current
    ) {
      const items = listRef.current.querySelectorAll("li");
      const newItem = items[items.length - 1];
      if (newItem) {
        gsap.from(newItem, {
          y: 10,
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }
    prevLen.current = lines.length;
  }, [lines.length, drawer]);

  // Cierre con Escape
  useEffect(() => {
    const k = (e) => e.key === "Escape" && close();
    if (drawer) addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  });

  const close = () => {
    if (reduced() || !panel.current) {
      setDrawer(false);
      setShown(false);
      return;
    }
    gsap.to(veil.current, { autoAlpha: 0, duration: 0.25 });
    gsap.to(panel.current, {
      xPercent: 100,
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => {
        setDrawer(false);
        setShown(false);
      },
    });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const raw = couponInput.trim().toUpperCase();
    if (!raw) {
      setCouponError("Ingresa un código de descuento.");
      return;
    }

    let match = null;
    if (DISCOUNT_CODES) {
      if (Array.isArray(DISCOUNT_CODES)) {
        match = DISCOUNT_CODES.find((c) => c.code?.toUpperCase() === raw);
      } else if (typeof DISCOUNT_CODES === "object") {
        if (raw in DISCOUNT_CODES) {
          const val = DISCOUNT_CODES[raw];
          match = typeof val === "number" ? { code: raw, pct: val } : val;
        }
      }
    }

    // Fallbacks si no coincide directamente con DISCOUNT_CODES
    if (!match) {
      if (raw === "NEXORA10") match = { code: "NEXORA10", pct: 0.10 };
      else if (raw === "PROMO20" || raw === "VIP20") match = { code: raw, pct: 0.20 };
      else if (raw === "TECH15" || raw === "WELCOME15") match = { code: raw, pct: 0.15 };
    }

    if (match && match.pct) {
      if (typeof setDiscount === "function") {
        setDiscount({ code: match.code || raw, pct: match.pct });
      }
      setCouponInput("");
      setCouponError("");
    } else {
      setCouponError("Código de descuento inválido o expirado");
    }
  };

  // discount.pct es decimal (0.10 = 10%) igual que en DISCOUNT_CODES y Store
  const discountAmount = discount
    ? Math.round(subtotal * discount.pct)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  if (!shown && !drawer) return null;

  return (
    <div className="drawer-root">
      <div className="veil" ref={veil} onClick={close} />
      <aside
        className="drawer"
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="drawer-head">
          <h2>Tu carrito</h2>
          <button
            className="icon-btn"
            onClick={close}
            aria-label="Cerrar carrito"
          >
            <X />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="empty">
            <p>Tu carrito está vacío.</p>
            <Link className="btn" to="/catalogo" onClick={close}>
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="lines" ref={listRef}>
              {lines.map((l) => (
                <li key={l.id + l.variant}>
                  <div className="thumb">
                    <ProductArt p={l.p} />
                  </div>
                  <div>
                    <strong>{l.p.name}</strong>
                    <small>
                      {l.variant} · {cop(l.p.price)}
                    </small>
                    <div className="qty">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Restar una unidad"
                        onClick={() => setQty(l.id, l.variant, l.qty - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{l.qty}</span>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Sumar una unidad"
                        onClick={() => setQty(l.id, l.variant, l.qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Eliminar ${l.p.name}`}
                        onClick={() => remove(l.id, l.variant)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <b>{cop(l.p.price * l.qty)}</b>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              {/* Cupón de descuento */}
              <div className="coupon-container">
                {discount ? (
                  <div className="coupon-applied">
                    <div className="coupon-info">
                      <Tag size={15} />
                      <span>
                        Cupón <strong>{discount.code}</strong> (−{Math.round(discount.pct * 100)}%)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDiscount && setDiscount(null)}
                      aria-label="Quitar descuento"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon}>
                    <div className="coupon-box">
                      <input
                        type="text"
                        className="coupon-input"
                        placeholder="CÓDIGO DE DESCUENTO"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponError) setCouponError("");
                        }}
                        aria-label="Ingresa tu código de descuento"
                      />
                      <button type="submit" className="btn">
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="err coupon-err" role="alert">
                        {couponError}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Totales y Subtotales */}
              <div className="drawer-totals">
                <div className="row">
                  <span>Subtotal</span>
                  <strong>{cop(subtotal)}</strong>
                </div>

                {discount && (
                  <div className="row discount-row">
                    <span>
                      Descuento ({discount.code} −{Math.round(discount.pct * 100)}%)
                    </span>
                    <strong className="discount-amount">
                      −{cop(discountAmount)}
                    </strong>
                  </div>
                )}

                <div className="row total">
                  <span>Total</span>
                  <strong>{cop(total)}</strong>
                </div>
              </div>

              <Link className="btn" to="/checkout" onClick={close}>
                Ir al checkout
              </Link>
              <button type="button" className="btn ghost" onClick={clear}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
