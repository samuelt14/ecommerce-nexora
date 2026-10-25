import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap fgrid">
        <div className="fcol">
          <Link to="/" className="logo" aria-label="NEXORA inicio">
            <span>N</span>EXORA
          </Link>
          <p className="fdesc">
            Tecnología premium y periféricos de alto rendimiento para
            escritorios exigentes. Diseñado para potenciar tu productividad y
            elevar tu espacio de trabajo.
          </p>
          <div className="fdemo-badge">
            <small>Demostración tecnológica e-commerce</small>
          </div>
        </div>

        <div className="fcol">
          <h4>Productos</h4>
          <Link to="/catalogo">Todos los productos</Link>
          <Link to="/catalogo?cat=Teclados">Teclados mecánicos</Link>
          <Link to="/catalogo?cat=Ratones">Ratones inalámbricos</Link>
          <Link to="/catalogo?cat=Auriculares">Audio y auriculares</Link>
          <Link to="/catalogo?cat=Monitores">Monitores QHD y ultrawide</Link>
          <Link to="/catalogo?cat=Accesorios">Accesorios de escritorio</Link>
        </div>

        <div className="fcol">
          <h4>Información</h4>
          <Link to="/info/faq">Preguntas frecuentes</Link>
          <Link to="/info/envios">Envíos y cobertura</Link>
          <Link to="/info/devoluciones">Garantía y devoluciones</Link>
          <Link to="/info/privacidad">Política de privacidad</Link>
          <Link to="/info/terminos">Términos del servicio</Link>
        </div>

        <div className="fcol">
          <h4>Contacto</h4>
          <p className="fcontact-item">
            <strong>Atención:</strong>
            <br />
            Lunes a Viernes: 8:00 AM – 6:00 PM COT
          </p>
          <p className="fcontact-item">
            <strong>Correo demo:</strong>
            <br />
            <a href="mailto:hola@nexora.demo">hola@nexora.demo</a>
          </p>
          <p className="fcontact-item">
            <strong>Ubicación:</strong>
            <br />
            Bogotá D.C., Colombia
          </p>
        </div>
      </div>

      <div className="wrap fbottom">
        <p>© {currentYear} NEXORA. Todos los derechos reservados.</p>
        <p className="fdemo-disclaimer">
          Sitio de demostración. No realiza cobros ni transacciones reales.
        </p>
      </div>
    </footer>
  );
}
