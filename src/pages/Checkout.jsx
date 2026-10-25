import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Landmark,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Edit3,
  ShoppingBag,
  Tag,
  Truck,
  User,
  MapPin,
  Check,
} from "lucide-react";
import { useStore } from "../context/Store";
import { cop, DISCOUNT_CODES } from "../data/products";
import ProductArt from "../components/ProductArt";
import { gsap, reduced } from "../hooks/useAnim";

const DEPARTAMENTOS_COLOMBIA = [
  "Bogotá D.C.",
  "Antioquia",
  "Cundinamarca",
  "Valle del Cauca",
  "Atlántico",
  "Santander",
  "Bolívar",
  "Risaralda",
  "Caldas",
  "Tolima",
  "Huila",
  "Meta",
  "Boyacá",
  "Nariño",
  "Magdalena",
  "Cesar",
  "Quindío",
  "Córdoba",
  "Norte de Santander",
  "Cauca",
  "Sucre",
  "Otro departamento",
];

const SHIPPING_OPTIONS = [
  {
    id: "std",
    label: "Estándar demo",
    desc: "Entrega simulada en 3 a 5 días hábiles a nivel nacional",
    price: 0,
  },
  {
    id: "exp",
    label: "Express demo",
    desc: "Entrega simulada prioritaria en 24 horas",
    price: 25000,
  },
];

const PAYMENT_OPTIONS = [
  {
    id: "card",
    label: "Tarjeta demo",
    desc: "Simulación de tarjeta crédito o débito (sin cargos)",
    icon: CreditCard,
  },
  {
    id: "pse",
    label: "PSE demo",
    desc: "Simulación de débito bancario en línea",
    icon: Landmark,
  },
  {
    id: "cash",
    label: "Efectivo demo",
    desc: "Simulación de contra entrega o punto físico",
    icon: Banknote,
  },
];

const STEPS = [
  { id: 1, label: "Datos personales" },
  { id: 2, label: "Dirección de entrega" },
  { id: 3, label: "Envío y pago" },
  { id: 4, label: "Revisión y confirmación" },
];

export default function Checkout() {
  const {
    lines,
    subtotal,
    discounted,
    discount,
    setDiscount,
    clear,
    user,
    addOrder,
  } = useStore();

  const [step, setStep] = useState(1);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    department: "Bogotá D.C.",
    postalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [shipMethod, setShipMethod] = useState("std");
  const [payMethod, setPayMethod] = useState("card");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const stepContainerRef = useRef(null);
  const confirmRef = useRef(null);

  const currentShip =
    SHIPPING_OPTIONS.find((s) => s.id === shipMethod) || SHIPPING_OPTIONS[0];
  const finalTotal = discounted + currentShip.price;

  // Handle step transitions with GSAP
  const transitionToStep = (newStep) => {
    if (newStep === step) return;
    if (reduced() || !stepContainerRef.current) {
      setStep(newStep);
      return;
    }

    const direction = newStep > step ? 1 : -1;
    gsap.to(stepContainerRef.current, {
      x: direction * -20,
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setStep(newStep);
        window.scrollTo({ top: 120, behavior: "smooth" });
        gsap.fromTo(
          stepContainerRef.current,
          { x: direction * 20, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.26,
            ease: "power2.out",
            clearProps: "all",
          },
        );
      },
    });
  };

  // Validation per step
  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        errs.name = "Ingresa tu nombre completo (mínimo 2 caracteres)";
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
        errs.email = "Ingresa un correo electrónico válido";
      }
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (!phoneDigits || phoneDigits.length < 7) {
        errs.phone = "Ingresa un número de teléfono válido (mínimo 7 dígitos)";
      }
    } else if (s === 2) {
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        errs.address = "Ingresa tu dirección completa (calle, carrera, número)";
      }
      if (!formData.city.trim() || formData.city.trim().length < 2) {
        errs.city = "Ingresa tu ciudad o municipio";
      }
      if (!formData.department) {
        errs.department = "Selecciona un departamento";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      transitionToStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      transitionToStep(step - 1);
    }
  };

  // Step click navigation (only to earlier completed steps)
  const handleStepClick = (targetStep) => {
    if (targetStep < step) {
      transitionToStep(targetStep);
    }
  };

  // Coupon handling
  const applyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (DISCOUNT_CODES[cleanCode]) {
      const disc = DISCOUNT_CODES[cleanCode];
      setDiscount(disc);
      setCouponMsg(`¡Cupón ${cleanCode} aplicado exitosamente!`);
      setCouponCode("");
    } else {
      setCouponMsg("Cupón no válido. Prueba con NEXORA10 o BIENVENIDA.");
    }
  };

  const removeCoupon = () => {
    setDiscount(null);
    setCouponMsg("");
  };

  // Final Order Confirmation
  const handleConfirmOrder = () => {
    const newOrderId = `NXDEMO-${Date.now().toString(36).toUpperCase()}`;
    const orderData = {
      id: newOrderId,
      items: lines.map((l) => ({
        id: l.id,
        name: l.p.name,
        variant: l.variant,
        qty: l.qty,
        price: l.p.price,
      })),
      subtotal,
      discount,
      discounted,
      shipping: currentShip,
      total: finalTotal,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        department: formData.department,
        postalCode: formData.postalCode,
        notes: formData.notes,
      },
      paymentMethod: payMethod,
      date: new Date().toISOString(),
      status: "Demo completado",
    };

    addOrder(orderData);
    setConfirmedOrder(orderData);
    clear();
  };

  // Confirmation animation
  useEffect(() => {
    if (confirmedOrder && confirmRef.current && !reduced()) {
      const root = confirmRef.current;
      const check = root.querySelector(".confirm-check");
      const title = root.querySelector(".confirm-title");
      const idBadge = root.querySelector(".confirm-id");
      const msg = root.querySelector(".confirm-msg");
      const card = root.querySelector(".confirm-card");
      const cta = root.querySelector(".confirm-cta");

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (check) {
        tl.fromTo(
          check,
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2)" },
        );
      }
      if (title) {
        tl.fromTo(
          title,
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35 },
          "-=0.2",
        );
      }
      if (idBadge) {
        tl.fromTo(
          idBadge,
          { scale: 0.8, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(1.6)" },
          "-=0.15",
        );
      }
      if (msg) {
        tl.fromTo(
          msg,
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35 },
          "-=0.15",
        );
      }
      if (card) {
        tl.fromTo(
          card,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.4 },
          "-=0.1",
        );
      }
      if (cta) {
        tl.fromTo(
          cta,
          { y: 15, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.3 },
          "-=0.1",
        );
      }
    }
  }, [confirmedOrder]);

  // Pantalla de Confirmación de Pedido
  if (confirmedOrder) {
    return (
      <div className="wrap section">
        <div className="confirm-wrap" ref={confirmRef}>
          <div className="confirm-check">
            <Check size={44} strokeWidth={2.8} />
          </div>
          <span className="badge-demo">PEDIDO FICTICIO REGISTRADO</span>
          <h1 className="confirm-title" style={{ marginTop: "1rem" }}>
            ¡Gracias por tu compra en NEXORA!
          </h1>
          <div className="confirm-id">{confirmedOrder.id}</div>
          <p className="confirm-msg" style={{ color: "var(--mut)" }}>
            Tu pedido demo ha sido registrado localmente. Esto es una
            demostración interactiva:{" "}
            <strong>no se ha realizado ningún cobro real</strong> ni se enviará
            mercancía física.
          </p>

          <div className="confirm-card">
            <h3 style={{ fontSize: "1.1rem" }}>Resumen del pedido demo</h3>
            <div className="row">
              <span className="muted">Comprador</span>
              <strong>{confirmedOrder.customer.name}</strong>
            </div>
            <div className="row">
              <span className="muted">Correo de contacto</span>
              <span>{confirmedOrder.customer.email}</span>
            </div>
            <div className="row">
              <span className="muted">Dirección de entrega</span>
              <span>
                {confirmedOrder.shippingAddress.address},{" "}
                {confirmedOrder.shippingAddress.city} (
                {confirmedOrder.shippingAddress.department})
              </span>
            </div>
            <div className="row">
              <span className="muted">Método de envío</span>
              <span>{confirmedOrder.shipping.label}</span>
            </div>
            <div className="row">
              <span className="muted">Método de pago simulado</span>
              <span style={{ textTransform: "capitalize" }}>
                {confirmedOrder.paymentMethod} (Demo)
              </span>
            </div>
            <div className="row total">
              <span>Total simulado</span>
              <strong style={{ color: "var(--ac)" }}>
                {cop(confirmedOrder.total)}
              </strong>
            </div>
          </div>

          <div className="confirm-cta">
            <Link className="btn" to="/catalogo">
              <ShoppingBag size={18} /> Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Carrito vacío
  if (!lines.length) {
    return (
      <div className="wrap section empty">
        <ShoppingBag
          size={54}
          style={{ margin: "0 auto 1rem", color: "var(--mut)" }}
        />
        <h2>Tu carrito está vacío</h2>
        <p className="muted" style={{ margin: "0.5rem 0 1.5rem" }}>
          Para continuar al checkout, primero añade productos desde nuestro
          catálogo tecnológico.
        </p>
        <Link className="btn" to="/catalogo">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>
        Finalizar compra
      </h1>

      {/* Barra de progreso de 4 pasos */}
      <nav className="steps" aria-label="Progreso del pedido">
        {STEPS.map((s) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          const isClickable = s.id < step;
          return (
            <button
              key={s.id}
              type="button"
              className={`step-item ${isActive ? "active" : ""} ${
                isDone ? "done" : ""
              } ${isClickable ? "clickable" : ""}`}
              onClick={() => handleStepClick(s.id)}
              disabled={!isClickable && !isActive}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="step-num">
                {isDone ? <Check size={18} strokeWidth={3} /> : s.id}
              </span>
              <span className="step-label">{s.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Contenido principal en 2 columnas: Formulario del paso actual + Resumen lateral */}
      <div className="layout co">
        <div ref={stepContainerRef}>
          {/* PASO 1: DATOS PERSONALES */}
          {step === 1 && (
            <div className="checkout-box">
              <legend>Paso 1: Datos personales</legend>
              <div className="demo-banner">
                <User size={20} color="var(--ac)" />
                <div>
                  <strong>Información de contacto demo</strong>
                  <p className="note">
                    Estos datos se emplean únicamente para generar el comprobante
                    simulado del pedido en tu navegador.
                  </p>
                </div>
              </div>

              <div className="stack">
                <label>
                  Nombre completo *
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    placeholder="Ej. Camila Morales"
                    aria-invalid={!!errors.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                  />
                  {errors.name && (
                    <span className="err" role="alert">
                      {errors.name}
                    </span>
                  )}
                </label>

                <label>
                  Correo electrónico *
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    placeholder="camila@ejemplo.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                  />
                  {errors.email && (
                    <span className="err" role="alert">
                      {errors.email}
                    </span>
                  )}
                </label>

                <label>
                  Teléfono celular *
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    placeholder="Ej. 310 123 4567"
                    inputMode="tel"
                    aria-invalid={!!errors.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: null });
                    }}
                  />
                  {errors.phone && (
                    <span className="err" role="alert">
                      {errors.phone}
                    </span>
                  )}
                </label>
              </div>

              <div className="step-nav">
                <Link to="/catalogo" className="btn ghost">
                  <ArrowLeft size={16} /> Volver al catálogo
                </Link>
                <button
                  type="button"
                  className="btn"
                  onClick={handleNext}
                >
                  Continuar a Entrega <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: DIRECCIÓN DE ENTREGA */}
          {step === 2 && (
            <div className="checkout-box">
              <legend>Paso 2: Dirección de entrega</legend>
              <div className="demo-banner">
                <MapPin size={20} color="var(--ac)" />
                <div>
                  <strong>Destino del envío simulado</strong>
                  <p className="note">
                    Indica la dirección simulada para calcular el trayecto
                    demo.
                  </p>
                </div>
              </div>

              <div className="stack">
                <label>
                  Calle / Dirección completa *
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    placeholder="Ej. Carrera 15 # 85-32, Apto 402"
                    aria-invalid={!!errors.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (errors.address)
                        setErrors({ ...errors, address: null });
                    }}
                  />
                  {errors.address && (
                    <span className="err" role="alert">
                      {errors.address}
                    </span>
                  )}
                </label>

                <div className="grid-2col">
                  <label>
                    Ciudad / Municipio *
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      placeholder="Ej. Bogotá"
                      aria-invalid={!!errors.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: null });
                      }}
                    />
                    {errors.city && (
                      <span className="err" role="alert">
                        {errors.city}
                      </span>
                    )}
                  </label>

                  <label>
                    Departamento *
                    <select
                      id="department"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department: e.target.value,
                        })
                      }
                    >
                      {DEPARTAMENTOS_COLOMBIA.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Código postal (opcional)
                  <input
                    type="text"
                    value={formData.postalCode}
                    placeholder="Ej. 110221"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Instrucciones adicionales para la entrega (opcional)
                  <textarea
                    rows={3}
                    value={formData.notes}
                    placeholder="Ej. Dejar en portería o tocar timbre 402..."
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="step-nav">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={handleBack}
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleNext}
                >
                  Continuar a Envío y Pago <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: ENVÍO Y PAGO */}
          {step === 3 && (
            <div className="checkout-box">
              <legend>Paso 3: Envío y método de pago</legend>

              {/* Nota prominente de modo demostración */}
              <div className="demo-banner warning">
                <ShieldAlert size={24} />
                <div>
                  <strong style={{ display: "block", marginBottom: "0.2rem" }}>
                    ⚠️ MODO DEMOSTRACIÓN: No se realiza ningún cobro real.
                  </strong>
                  <span>
                    No ingreses números de tarjeta, claves ni datos bancarios
                    reales en ningún momento. Esta plataforma es una simulación de
                    e-commerce interactiva.
                  </span>
                </div>
              </div>

              <div className="stack" style={{ gap: "1.5rem" }}>
                <div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Truck size={18} color="var(--ac)" /> Selecciona método de
                    envío:
                  </h3>
                  <div className="stack" style={{ gap: "0.7rem" }}>
                    {SHIPPING_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`radio-card ${
                          shipMethod === opt.id ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_opt"
                          checked={shipMethod === opt.id}
                          onChange={() => setShipMethod(opt.id)}
                        />
                        <div className="radio-card-content">
                          <div className="radio-card-head">
                            <span>{opt.label}</span>
                            <strong style={{ color: "var(--ac)" }}>
                              {opt.price === 0 ? "Gratis" : cop(opt.price)}
                            </strong>
                          </div>
                          <span className="radio-card-desc">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CreditCard size={18} color="var(--ac)" /> Selecciona método de
                    pago demo:
                  </h3>
                  <div className="stack" style={{ gap: "0.7rem" }}>
                    {PAYMENT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <label
                          key={opt.id}
                          className={`radio-card ${
                            payMethod === opt.id ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_opt"
                            checked={payMethod === opt.id}
                            onChange={() => setPayMethod(opt.id)}
                          />
                          <div className="radio-card-content">
                            <div className="radio-card-head">
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <Icon size={18} color="var(--ac)" />
                                {opt.label}
                              </span>
                              <span className="badge-demo">SIMULADO</span>
                            </div>
                            <span className="radio-card-desc">{opt.desc}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="step-nav">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={handleBack}
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleNext}
                >
                  Revisar Pedido <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: REVISIÓN Y CONFIRMACIÓN */}
          {step === 4 && (
            <div className="checkout-box">
              <legend>Paso 4: Revisión del pedido</legend>

              <div className="review-section">
                {/* Resumen Comprador */}
                <div className="review-card">
                  <div className="review-card-head">
                    <h3>Datos del comprador</h3>
                    <button
                      type="button"
                      onClick={() => transitionToStep(1)}
                      aria-label="Modificar datos personales"
                    >
                      <Edit3 size={14} style={{ display: "inline" }} /> Modificar
                    </button>
                  </div>
                  <p>
                    <strong>{formData.name}</strong>
                  </p>
                  <p className="muted">{formData.email}</p>
                  <p className="muted">Teléfono: {formData.phone}</p>
                </div>

                {/* Resumen Entrega */}
                <div className="review-card">
                  <div className="review-card-head">
                    <h3>Dirección y entrega</h3>
                    <button
                      type="button"
                      onClick={() => transitionToStep(2)}
                      aria-label="Modificar dirección de entrega"
                    >
                      <Edit3 size={14} style={{ display: "inline" }} /> Modificar
                    </button>
                  </div>
                  <p>
                    <strong>{formData.address}</strong>
                  </p>
                  <p className="muted">
                    {formData.city}, {formData.department}
                    {formData.postalCode ? ` (${formData.postalCode})` : ""}
                  </p>
                  {formData.notes && (
                    <p
                      className="note"
                      style={{ marginTop: "0.4rem", fontStyle: "italic" }}
                    >
                      Nota: "{formData.notes}"
                    </p>
                  )}
                </div>

                {/* Resumen Envío y Pago */}
                <div className="review-card">
                  <div className="review-card-head">
                    <h3>Envío y Pago seleccionado</h3>
                    <button
                      type="button"
                      onClick={() => transitionToStep(3)}
                      aria-label="Modificar envío y pago"
                    >
                      <Edit3 size={14} style={{ display: "inline" }} /> Modificar
                    </button>
                  </div>
                  <div className="row">
                    <span className="muted">Envío</span>
                    <strong>
                      {currentShip.label} (
                      {currentShip.price === 0
                        ? "Gratis"
                        : cop(currentShip.price)}
                      )
                    </strong>
                  </div>
                  <div className="row" style={{ marginTop: "0.4rem" }}>
                    <span className="muted">Pago</span>
                    <strong style={{ textTransform: "capitalize" }}>
                      {payMethod} (Modo Demo)
                    </strong>
                  </div>
                </div>

                {/* Lista detallada de productos */}
                <div className="review-card">
                  <div className="review-card-head">
                    <h3>Productos en el pedido ({lines.length})</h3>
                  </div>
                  <div className="review-items-list">
                    {lines.map((l) => (
                      <div className="review-item" key={l.id + l.variant}>
                        <div className="review-thumb">
                          <ProductArt p={l.p} />
                        </div>
                        <div>
                          <strong>{l.p.name}</strong>
                          <small className="muted" style={{ display: "block" }}>
                            Variante: {l.variant} · Cantidad: {l.qty}
                          </small>
                          <small className="muted">{cop(l.p.price)} c/u</small>
                        </div>
                        <strong style={{ whiteSpace: "nowrap" }}>
                          {cop(l.p.price * l.qty)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-nav">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={handleBack}
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleConfirmOrder}
                  style={{
                    backgroundColor: "var(--ac)",
                    color: "var(--ac-tx)",
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={18} /> Confirmar pedido demo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen lateral permanente */}
        <aside className="summary" aria-label="Resumen de la orden">
          <h2>Resumen del pedido</h2>

          <div className="review-items-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {lines.map((l) => (
              <div className="row" key={l.id + l.variant}>
                <span style={{ fontSize: "0.9rem" }}>
                  {l.qty}× {l.p.name} <small>({l.variant})</small>
                </span>
                <span style={{ fontSize: "0.9rem" }}>
                  {cop(l.qty * l.p.price)}
                </span>
              </div>
            ))}
          </div>

          <div
            className="row"
            style={{ borderTop: "1px solid var(--line)", paddingTop: "0.8rem" }}
          >
            <span>Subtotal</span>
            <span>{cop(subtotal)}</span>
          </div>

          {discount && (
            <div className="row" style={{ color: "var(--ac)" }}>
              <span>Descuento ({discount.code || "Promo"})</span>
              <span>−{cop(subtotal - discounted)}</span>
            </div>
          )}

          <div className="row">
            <span>Envío ({currentShip.label})</span>
            <span>
              {currentShip.price === 0 ? "Gratis" : cop(currentShip.price)}
            </span>
          </div>

          <div className="row total">
            <span>Total a pagar demo</span>
            <span style={{ color: "var(--ac)" }}>{cop(finalTotal)}</span>
          </div>

          {/* Cupón de descuento */}
          <div style={{ marginTop: "0.5rem" }}>
            {!discount ? (
              <form onSubmit={applyCoupon} className="coupon-box">
                <input
                  type="text"
                  placeholder="Cupón (ej. NEXORA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  aria-label="Código de descuento"
                />
                <button type="submit" className="btn btn-sm">
                  <Tag size={14} /> Aplicar
                </button>
              </form>
            ) : (
              <div className="coupon-applied">
                <div>
                  <strong style={{ color: "var(--ac)" }}>
                    {discount.code}
                  </strong>{" "}
                  <small>({discount.label || "Aplicado"})</small>
                </div>
                <button type="button" onClick={removeCoupon}>
                  Quitar
                </button>
              </div>
            )}
            {couponMsg && (
              <span
                className="note"
                style={{
                  display: "block",
                  marginTop: "0.4rem",
                  color: discount ? "var(--ac)" : "var(--mut)",
                }}
              >
                {couponMsg}
              </span>
            )}
          </div>

          {step < 4 ? (
            <button
              type="button"
              className="btn"
              onClick={handleNext}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Continuar <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={handleConfirmOrder}
              style={{
                width: "100%",
                marginTop: "1rem",
                backgroundColor: "var(--ac)",
                color: "var(--ac-tx)",
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={18} /> Confirmar pedido demo
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
