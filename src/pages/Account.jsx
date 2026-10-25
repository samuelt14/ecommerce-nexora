import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useStore } from "../context/Store";
import { cop } from "../data/products";
import { useAnim, gsap, reduced } from "../hooks/useAnim";

export default function Account() {
  const { user, setUser, orders, favs, count } = useStore();

  // Auth state (si no hay usuario)
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({ name: "", email: "", pass: "" });
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState("");

  // Profile tabs (si hay usuario)
  const [profileTab, setProfileTab] = useState("profile"); // "profile" | "orders"

  const containerRef = useRef(null);
  const tabContentRef = useRef(null);

  // Animación de entrada inicial con GSAP
  useAnim(
    (root) => {
      const heading = root.querySelector(".account-anim-head");
      const tabs = root.querySelector(".account-anim-tabs");
      const content = root.querySelector(".account-anim-content");

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (heading) {
        tl.fromTo(
          heading,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
        );
      }
      if (tabs) {
        tl.fromTo(
          tabs,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          "-=0.2",
        );
      }
      if (content) {
        tl.fromTo(
          content,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.4, clearProps: "all" },
          "-=0.15",
        );
      }
    },
    [user?.email],
  );

  // Animación al cambiar de tab
  useEffect(() => {
    if (!reduced() && tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }
  }, [profileTab, authMode, showForgot]);

  // Manejo de formulario Auth
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (authMode === "register" && formData.name.trim().length < 2) {
      errs.name = "Escribe tu nombre completo (mínimo 2 caracteres)";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = "Ingresa un correo electrónico válido";
    }
    if (formData.pass.length < 6) {
      errs.pass = "La contraseña simulada debe tener al menos 6 caracteres";
    }

    setErrors(errs);
    setStatusMsg("");

    if (Object.keys(errs).length > 0) return;

    const loggedUser = {
      name:
        formData.name.trim() ||
        formData.email.split("@")[0].replace(/[._-]/g, " "),
      email: formData.email.trim(),
      joinedDate: new Date().toLocaleDateString("es-CO", {
        month: "long",
        year: "numeric",
      }),
    };

    setUser(loggedUser);
    setStatusMsg(
      authMode === "login"
        ? "Sesión de demostración iniciada con éxito."
        : "Cuenta de demostración creada con éxito.",
    );
  };

  // Manejo de Recuperación de contraseña demo
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(forgotEmail.trim())) {
      setErrors({ forgot: "Ingresa un correo electrónico válido" });
      return;
    }
    setErrors({});
    setForgotSent(true);
  };

  // Avatar inicial del usuario
  const userInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  // --- VISTA SI HAY USUARIO AUTENTICADO ---
  if (user) {
    return (
      <div className="wrap section account-wrap" ref={containerRef}>
        {/* Header con avatar inicial */}
        <div className="account-profile-header account-anim-head">
          <div className="account-avatar">{userInitial}</div>
          <div className="account-user-meta">
            <h2>{user.name}</h2>
            <p className="muted" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Mail size={15} /> {user.email}
            </p>
            <div style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              <span className="badge-demo">MODO DEMOSTRACIÓN · SESIÓN LOCAL</span>
            </div>
          </div>
          <button
            type="button"
            className="btn ghost btn-sm"
            onClick={() => {
              setUser(null);
              setStatusMsg("");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>

        {/* Resumen rápido de métricas */}
        <div className="account-stats">
          <div className="stat-box">
            <small>Pedidos demo realizados</small>
            <strong>{orders.length}</strong>
          </div>
          <div className="stat-box">
            <small>Favoritos guardados</small>
            <strong>{favs.length}</strong>
          </div>
          <div className="stat-box">
            <small>Artículos en carrito</small>
            <strong>{count}</strong>
          </div>
        </div>

        {/* Tabs: Mi perfil / Mis pedidos */}
        <div className="tabs account-anim-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={profileTab === "profile"}
            className={profileTab === "profile" ? "on" : ""}
            onClick={() => setProfileTab("profile")}
          >
            <User size={16} style={{ display: "inline", marginRight: "6px" }} />
            Mi perfil
          </button>
          <button
            role="tab"
            aria-selected={profileTab === "orders"}
            className={profileTab === "orders" ? "on" : ""}
            onClick={() => setProfileTab("orders")}
          >
            <Package size={16} style={{ display: "inline", marginRight: "6px" }} />
            Mis pedidos ({orders.length})
          </button>
        </div>

        {/* Contenido de la pestaña */}
        <div ref={tabContentRef} className="account-anim-content">
          {/* TAB 1: MI PERFIL */}
          {profileTab === "profile" && (
            <div className="checkout-box">
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                Información de la cuenta
              </h3>
              <div className="stack" style={{ gap: "1rem" }}>
                <div className="row">
                  <span className="muted">Nombre</span>
                  <strong>{user.name}</strong>
                </div>
                <div className="row">
                  <span className="muted">Correo electrónico</span>
                  <span>{user.email}</span>
                </div>
                <div className="row">
                  <span className="muted">Tipo de cuenta</span>
                  <span>Cliente registrado (Demostración)</span>
                </div>
                <div className="row">
                  <span className="muted">Almacenamiento de sesión</span>
                  <span>Navegador local (localStorage)</span>
                </div>
              </div>

              <div
                className="demo-banner"
                style={{ marginTop: "1.5rem", marginBottom: 0 }}
              >
                <Sparkles size={20} color="var(--ac)" />
                <div>
                  <strong>Entorno de pruebas interactivo</strong>
                  <p className="note">
                    Esta sesión es completamente local en este navegador. No se
                    conectan credenciales con servidores externos ni se
                    almacenan datos sensibles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MIS PEDIDOS */}
          {profileTab === "orders" && (
            <div>
              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((ord) => {
                    const formattedDate = new Date(ord.date).toLocaleDateString(
                      "es-CO",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    const itemsCount = Array.isArray(ord.items)
                      ? ord.items.reduce(
                          (sum, it) => sum + (it.qty || 1),
                          0,
                        )
                      : 1;

                    return (
                      <article key={ord.id} className="order-card">
                        <div className="order-head">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.8rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span className="order-id-badge">{ord.id}</span>
                            <span className="badge-status">
                              <CheckCircle2 size={13} /> {ord.status || "Demo completado"}
                            </span>
                          </div>
                          <span
                            className="muted"
                            style={{
                              fontSize: "0.85rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Calendar size={14} /> {formattedDate}
                          </span>
                        </div>

                        {/* Desglose de items del pedido si existen */}
                        {Array.isArray(ord.items) && ord.items.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.4rem",
                              background: "var(--bg)",
                              padding: "0.8rem 1rem",
                              borderRadius: "8px",
                              fontSize: "0.9rem",
                            }}
                          >
                            {ord.items.map((it, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>
                                  {it.qty || 1}× {it.name || it.p?.name || "Producto demo"}
                                  {it.variant ? ` (${it.variant})` : ""}
                                </span>
                                <span className="muted">
                                  {cop((it.price || it.p?.price || 0) * (it.qty || 1))}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="order-summary-row">
                          <span className="muted">
                            Total de artículos: <strong>{itemsCount}</strong>
                          </span>
                          <div>
                            <span className="muted" style={{ marginRight: "0.5rem" }}>
                              Total simulado:
                            </span>
                            <strong style={{ color: "var(--ac)", fontSize: "1.1rem" }}>
                              {cop(ord.total)}
                            </strong>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty" style={{ padding: "3rem 1rem" }}>
                  <Package
                    size={48}
                    style={{ margin: "0 auto 1rem", color: "var(--mut)" }}
                  />
                  <h3>Aún no tienes pedidos demo</h3>
                  <p
                    className="muted"
                    style={{
                      maxWidth: "400px",
                      margin: "0.5rem auto 1.5rem",
                    }}
                  >
                    Cuando completes un pedido en el checkout, se registrará y
                    guardará aquí para tu consulta.
                  </p>
                  <Link className="btn" to="/catalogo">
                    Explorar productos
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA SI NO HAY USUARIO (LOGIN / REGISTRO / FORGOT) ---
  return (
    <div className="wrap section auth account-wrap" ref={containerRef}>
      <div className="account-anim-head">
        <h1 className="page-title">
          {showForgot
            ? "Recuperar contraseña"
            : authMode === "login"
            ? "Iniciar sesión"
            : "Crear cuenta"}
        </h1>
        <div className="demo-banner">
          <ShieldAlert size={20} color="var(--ac)" />
          <div>
            <strong>Formulario de demostración</strong>
            <p className="note">
              No se envían ni guardan contraseñas reales. Puedes ingresar
              cualquier valor de prueba para simular tu sesión.
            </p>
          </div>
        </div>
      </div>

      {!showForgot ? (
        <>
          {/* Selector de modo: Entrar / Registrarme */}
          <div className="tabs account-anim-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={authMode === "login"}
              className={authMode === "login" ? "on" : ""}
              onClick={() => {
                setAuthMode("login");
                setErrors({});
                setStatusMsg("");
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authMode === "register"}
              className={authMode === "register" ? "on" : ""}
              onClick={() => {
                setAuthMode("register");
                setErrors({});
                setStatusMsg("");
              }}
            >
              Registrarme
            </button>
          </div>

          <form
            onSubmit={handleAuthSubmit}
            noValidate
            className="stack account-anim-content"
            ref={tabContentRef}
          >
            {authMode === "register" && (
              <label>
                Nombre completo *
                <input
                  type="text"
                  placeholder="Ej. Sofía Herrera"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span className="err" role="alert">
                    {errors.name}
                  </span>
                )}
              </label>
            )}

            <label>
              Correo electrónico *
              <input
                type="email"
                placeholder="tu@correo.com"
                value={formData.email}
                autoComplete="email"
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="err" role="alert">
                  {errors.email}
                </span>
              )}
            </label>

            <label>
              Contraseña demo *
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.pass}
                onChange={(e) => {
                  setFormData({ ...formData, pass: e.target.value });
                  if (errors.pass) setErrors({ ...errors, pass: null });
                }}
                aria-invalid={!!errors.pass}
              />
              {errors.pass && (
                <span className="err" role="alert">
                  {errors.pass}
                </span>
              )}
            </label>

            {authMode === "login" && (
              <div style={{ textAlign: "right" }}>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--ac)",
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onClick={() => {
                    setShowForgot(true);
                    setForgotSent(false);
                    setForgotEmail(formData.email);
                    setErrors({});
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button type="submit" className="btn" style={{ marginTop: "0.5rem" }}>
              {authMode === "login" ? "Entrar a mi cuenta" : "Crear mi cuenta demo"}
            </button>

            {statusMsg && (
              <p role="status" className="okmsg">
                {statusMsg}
              </p>
            )}
          </form>
        </>
      ) : (
        /* Recuperación de contraseña demo */
        <div className="forgot-box account-anim-content" ref={tabContentRef}>
          {!forgotSent ? (
            <form onSubmit={handleForgotSubmit} className="stack">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.5rem",
                }}
              >
                <KeyRound size={22} color="var(--ac)" />
                <h3 style={{ fontSize: "1.1rem" }}>Restablecer acceso demo</h3>
              </div>
              <p className="note">
                Ingresa tu correo para recibir las instrucciones simuladas de
                recuperación.
              </p>

              <label>
                Correo electrónico *
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  aria-invalid={!!errors.forgot}
                />
                {errors.forgot && (
                  <span className="err" role="alert">
                    {errors.forgot}
                  </span>
                )}
              </label>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.6rem" }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setShowForgot(false)}
                >
                  Volver al login
                </button>
                <button type="submit" className="btn" style={{ flex: 1 }}>
                  Enviar instrucciones demo
                </button>
              </div>
            </form>
          ) : (
            <div className="confirm">
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(212, 255, 58, 0.15)",
                  color: "var(--ac)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3>Instrucciones enviadas (Demo)</h3>
              <p
                className="muted"
                style={{ margin: "0.5rem 0 1.5rem", fontSize: "0.95rem" }}
              >
                Se simularon las instrucciones de restablecimiento para{" "}
                <strong>{forgotEmail}</strong>. Al ser una demostración, ningún
                correo fue enviado externamente.
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setShowForgot(false);
                  setForgotSent(false);
                }}
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
