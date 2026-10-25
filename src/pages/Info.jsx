import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Truck,
  RotateCcw,
  Shield,
  FileText,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAnim, gsap, reduced } from "../hooks/useAnim";

const FAQ_ITEMS = [
  {
    q: "¿Qué es NEXORA y cómo funciona esta plataforma?",
    a: "NEXORA es una experiencia interactiva de e-commerce de tecnología premium diseñada para mostrar productos de audio, teclados mecánicos, ratones ergonómicos y accesorios para setup con animaciones GSAP de alto rendimiento.",
  },
  {
    q: "¿Los pagos, cobros o transacciones son reales?",
    a: "No. En modo demostración, todas las pasarelas (tarjeta, PSE y contra entrega) son totalmente simuladas. Nunca solicitamos ni almacenamos datos bancarios reales, códigos de seguridad (CVV) ni contraseñas bancarias.",
  },
  {
    q: "¿Cuánto tardan los envíos y cómo se rastrean?",
    a: "En la simulación manejamos dos modalidades: Estándar demo (3 a 5 días hábiles sin costo) y Express demo (entrega prioritaria simulada en 24 horas por $25.000 COP). Al confirmar tu pedido, se genera un código de orden local que puedes ver en tu cuenta.",
  },
  {
    q: "¿Cómo funciona la política de devoluciones simulada?",
    a: "Ofrecemos una garantía de satisfacción simulada de 30 días para todos nuestros productos tecnológicos. Si un artículo presentara defectos o inconformidades en un entorno comercial real, se coordinaría la recolección sin costo adicional.",
  },
  {
    q: "¿Dónde se guardan mis datos personales y pedidos?",
    a: "Todos los datos (artículos del carrito, favoritos, pedidos generados y perfil de usuario) se conservan exclusivamente en el almacenamiento local de tu navegador (localStorage). No existe conexión con servidores externos ni venta de información a terceros.",
  },
  {
    q: "¿Puedo utilizar cupones de descuento promocionales?",
    a: "¡Sí! Puedes probar cupones como NEXORA10 (10% de descuento) o BIENVENIDA (15% de descuento) directamente en la pantalla de Checkout para verificar el cálculo dinámico del total con descuento.",
  },
];

const INFO_SECTIONS = [
  { slug: "envios", label: "Política de envíos", icon: Truck },
  { slug: "devoluciones", label: "Devoluciones y reembolsos", icon: RotateCcw },
  { slug: "privacidad", label: "Política de privacidad", icon: Shield },
  { slug: "terminos", label: "Términos y condiciones", icon: FileText },
  { slug: "faq", label: "Preguntas frecuentes", icon: HelpCircle },
];

export default function Info() {
  const { slug } = useParams();
  const [openFaq, setOpenFaq] = useState(0); // Primera pregunta abierta por defecto
  const articleRef = useRef(null);

  // Animación GSAP al cambiar de slug: fade in desde abajo
  useEffect(() => {
    if (articleRef.current && !reduced()) {
      gsap.fromTo(
        articleRef.current,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }
  }, [slug]);

  // Contenido estático por slug
  const renderContent = () => {
    switch (slug) {
      case "envios":
        return (
          <>
            <h1>Política de envíos</h1>
            <div className="demo-banner">
              <Truck size={20} color="var(--ac)" />
              <div>
                <strong>Envíos simulados a nivel nacional</strong>
                <p className="note">
                  Esta tienda opera en modo demostración. No se despachará ningún
                  paquete físico.
                </p>
              </div>
            </div>

            <p>
              En NEXORA brindamos cobertura simulada a las principales ciudades y
              municipios de Colombia (Bogotá D.C., Medellín, Cali, Barranquilla,
              Bucaramanga, Cartagena, Manizales, Pereira y más).
            </p>

            <h2>Tiempos y modalidades de entrega simulados</h2>
            <div className="stack" style={{ margin: "1rem 0" }}>
              <div className="review-card">
                <div className="review-card-head">
                  <h3>Envío Estándar demo</h3>
                  <strong style={{ color: "var(--ac)" }}>Gratis</strong>
                </div>
                <p className="muted">
                  Plazo estimado de 3 a 5 días hábiles a nivel nacional. Ideal
                  para pedidos habituales y reposición de accesorios.
                </p>
              </div>

              <div className="review-card">
                <div className="review-card-head">
                  <h3>Envío Express demo</h3>
                  <strong style={{ color: "var(--ac)" }}>$25.000 COP</strong>
                </div>
                <p className="muted">
                  Entrega prioritaria en 24 horas hábiles en ciudades
                  principales para compras confirmadas antes de las 2:00 p.m.
                </p>
              </div>
            </div>

            <h2>Seguimiento de pedidos</h2>
            <p>
              Cada compra genera de manera automática un identificador único con
              el prefijo <code>NXDEMO-XXXXX</code>. Puedes revisar el histórico
              completo y estado de tus compras en la sección{" "}
              <Link to="/cuenta" style={{ color: "var(--ac)" }}>
                Mi Cuenta &gt; Mis pedidos
              </Link>
              .
            </p>

            <h2>Embalaje y protección</h2>
            <p>
              En un entorno real, todos los artículos de alta gama como
              auriculares inalámbricos con cancelación activa de ruido y teclados
              mecánicos viajarían con triple capa de sellado y amortiguación de
              impacto contra caídas.
            </p>
          </>
        );

      case "devoluciones":
        return (
          <>
            <h1>Devoluciones y reembolsos</h1>
            <div className="demo-banner">
              <RotateCcw size={20} color="var(--ac)" />
              <div>
                <strong>Garantía de satisfacción simulada</strong>
                <p className="note">
                  Términos y condiciones explicativos para fines demostrativos.
                </p>
              </div>
            </div>

            <p>
              Queremos que tu experiencia con los periféricos de NEXORA sea
              impecable. Por ello, establecemos lineamientos claros inspirados en
              las mejores prácticas de comercio electrónico de tecnología.
            </p>

            <h2>Plazo de devolución (30 días demo)</h2>
            <p>
              Dispones de hasta 30 días calendario a partir de la fecha de
              recepción simulada para solicitar el cambio o reembolso de tu
              periférico en caso de insatisfacción o inconformidad técnica.
            </p>

            <h2>Condiciones del producto</h2>
            <ul
              style={{
                paddingLeft: "1.2rem",
                color: "#ccd0db",
                lineHeight: "1.7",
                marginBottom: "1.2rem",
              }}
            >
              <li>
                El artículo debe conservar sus empaques originales, sellos,
                cables, adaptadores y manuales de usuario.
              </li>
              <li>
                No debe presentar golpes, modificaciones de firmware no
                autorizadas ni daños por derrame de líquidos.
              </li>
              <li>
                Debe adjuntarse el número de pedido demo generado durante el
                checkout.
              </li>
            </ul>

            <h2>Proceso de reembolso simulado</h2>
            <p>
              Una vez recibida e inspeccionada la unidad devuelta, el reintegro
              simulado se reflejaría en el mismo medio de pago registrado en un
              plazo de 3 a 5 días hábiles.
            </p>
          </>
        );

      case "privacidad":
        return (
          <>
            <h1>Política de privacidad</h1>
            <div className="demo-banner">
              <Shield size={20} color="var(--ac)" />
              <div>
                <strong>Privacidad de extremo a extremo</strong>
                <p className="note">
                  No recopilamos ni comercializamos datos personales con
                  terceros.
                </p>
              </div>
            </div>

            <p>
              En NEXORA respetamos profundamente tu privacidad digital. Esta
              política detalla cómo gestionamos los datos dentro de este
              demostrador de tecnología.
            </p>

            <h2>Almacenamiento exclusivo en el cliente</h2>
            <p>
              Toda la información ingresada en el checkout, el catálogo de
              favoritos y la autenticación se aloja exclusivamente en el
              mecanismo de <code>localStorage</code> de tu navegador web.
            </p>

            <h2>No transmisión a servidores</h2>
            <p>
              No existen llamadas de red (fetch / axios) que envíen tu nombre,
              correo, teléfono ni dirección a ningún servidor backend de NEXORA.
              Al borrar los datos de navegación o el almacenamiento de este
              dominio, la información se reinicia por completo.
            </p>

            <h2>Cookies y analítica</h2>
            <p>
              No empleamos cookies invasivas de rastreo publicitario ni píxeles
              de seguimiento de terceros en este prototipo.
            </p>
          </>
        );

      case "terminos":
        return (
          <>
            <h1>Términos y condiciones</h1>
            <div className="demo-banner">
              <FileText size={20} color="var(--ac)" />
              <div>
                <strong>Condiciones de uso de la demostración</strong>
                <p className="note">
                  Reglas de uso del sitio web interactivo de NEXORA.
                </p>
              </div>
            </div>

            <p>
              Bienvenido a NEXORA. Al explorar y navegar por esta plataforma,
              reconoces y aceptas los siguientes términos de uso.
            </p>

            <h2>Propósito demostrativo</h2>
            <p>
              NEXORA es un proyecto demostrativo de ingeniería de software e
              interfaz de usuario de alta fidelidad. Los productos, marcas,
              especificaciones y precios exhibidos tienen propósitos ilustrativos
              de diseño y funcionalidad en frontend.
            </p>

            <h2>Inexistencia de obligaciones comerciales</h2>
            <p>
              La confirmación de pedidos en el checkout no genera una relación
              contractual de compraventa vinculante ni confiere derecho a la
              entrega física de los productos.
            </p>

            <h2>Propiedad intelectual</h2>
            <p>
              El código fuente, componentes interactivos, animaciones GSAP y
              estilos CSS han sido construidos como parte del ecosistema NEXORA
              para brindar una experiencia de usuario de calidad premium.
            </p>
          </>
        );

      case "faq":
        return (
          <>
            <h1>Preguntas frecuentes</h1>
            <div className="demo-banner">
              <HelpCircle size={20} color="var(--ac)" />
              <div>
                <strong>Centro de ayuda interactivo</strong>
                <p className="note">
                  Respuestas a las dudas más comunes sobre la tienda y su
                  funcionamiento demo.
                </p>
              </div>
            </div>

            <p>
              Encuentra aquí todo lo que necesitas saber acerca del funcionamiento
              de NEXORA, los pedidos simulados y las funciones disponibles.
            </p>

            {/* Acordeón expandible */}
            <div className="faq-list">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className={`faq-item ${isOpen ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <ChevronDown size={18} className="faq-chevron" />
                    </button>
                    {isOpen && <div className="faq-answer">{item.a}</div>}
                  </div>
                );
              })}
            </div>
          </>
        );

      default:
        return (
          <div className="empty" style={{ padding: "4rem 1rem" }}>
            <h2>Sección no encontrada</h2>
            <p className="muted" style={{ margin: "0.6rem 0 1.5rem" }}>
              El artículo de información solicitado no existe o fue movido.
            </p>
            <Link className="btn" to="/">
              Volver al inicio
            </Link>
          </div>
        );
    }
  };

  const currentSection = INFO_SECTIONS.find((s) => s.slug === slug);

  return (
    <div className="wrap section">
      <div className="info-layout">
        {/* Navegación lateral entre secciones */}
        <aside className="info-nav" aria-label="Menú de información">
          {INFO_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = slug === sec.slug;
            return (
              <Link
                key={sec.slug}
                to={`/info/${sec.slug}`}
                className={`info-nav-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <Icon size={16} />
                  {sec.label}
                </span>
                <ChevronDown
                  size={14}
                  style={{ transform: "rotate(-90deg)", opacity: 0.7 }}
                />
              </Link>
            );
          })}
        </aside>

        {/* Contenido principal del artículo con animación GSAP */}
        <article className="info-content" ref={articleRef}>
          {renderContent()}
        </article>
      </div>
    </div>
  );
}
