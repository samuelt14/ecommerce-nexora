# NEXORA — Tienda de tecnología premium (demo)

Tienda virtual de demostración construida con **React + Vite** y animada con **GSAP**. Vende auriculares, teclados mecánicos, ratones, monitores y accesorios. Su objetivo es probar la calidad de la interfaz, las interacciones y las animaciones; **no es un e-commerce de producción**.

> ⚠️ **Aviso:** no hay pagos reales, ni backend, ni autenticación segura. Los pedidos, testimonios, stock y "más vendidos" son contenido ficticio.

## Tecnologías

| Área | Herramienta |
|---|---|
| UI | React 18, JavaScript, CSS moderno (variables CSS) |
| Build | Vite 5 |
| Rutas | React Router 6 |
| Animación | GSAP + ScrollTrigger |
| Iconos | Lucide React |

## Inicio rápido

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción en /dist
npm run preview   # previsualizar el build
```

Requiere Node.js 18 o superior.

## Funcionalidades

- **Inicio:** hero animado, categorías, destacados, nuevos lanzamientos, más vendidos (demo), banner promocional, ventajas de compra, testimonios (demo) y newsletter simulado.
- **Catálogo:** 12 productos, búsqueda instantánea, filtros por categoría, marca y precio máximo, ordenamiento por precio y novedades, contador de resultados, estado vacío y carga progresiva. Los filtros se reflejan en la URL.
- **Detalle de producto:** galería con miniaturas, variantes, cantidad, disponibilidad, características, información de envío, favoritos y productos relacionados.
- **Carrito:** carrito lateral con añadir, eliminar, cambiar cantidades, vaciar, subtotales y total. Persiste en `localStorage`.
- **Checkout de demostración:** datos del comprador, dirección, método de envío, resumen, selección visual de pago, validación de formularios y confirmación marcada como **pedido ficticio**.
- **Favoritos:** añadir y quitar, página propia y persistencia local.
- **Cuenta:** inicio de sesión y registro de demostración con validaciones y estados de error y éxito.

## Animaciones con GSAP

- **Hero:** entrada de líneas del titular, subtítulo, botones escalonados y flotación del producto.
- **Secciones y catálogo:** aparición escalonada con ScrollTrigger y al cambiar filtros.
- **Producto:** entrada de galería e información, transición al elegir miniatura y aparición de relacionados.
- **Interacciones:** carrito lateral con entrada y salida, rebote del contador, toast al añadir, efecto de pulsación en botones y transición entre rutas.
- **Gestión:** `gsap.matchMedia()` limpia animaciones y ScrollTriggers al desmontar y desactiva todo con `prefers-reduced-motion: reduce`.

## Estructura

```
src/
├── components/   Header, Footer, ProductCard, ProductArt, CartDrawer
├── context/      Store.jsx (carrito, favoritos, sesión demo, toast)
├── data/         products.js (catálogo y utilidades de formato)
├── hooks/        useAnim.js (patrón GSAP + helpers de ScrollTrigger)
├── pages/        Home, Catalog, Product, Checkout, Favorites, Account, Info
├── App.jsx       Rutas y transiciones globales
├── main.jsx      Punto de entrada
└── styles.css    Tokens de diseño y estilos
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/catalogo` | Catálogo (`?q=`, `?cat=`, `?brand=`, `?max=`, `?sort=`) |
| `/producto/:id` | Detalle de producto |
| `/checkout` | Checkout de demostración |
| `/favoritos` | Favoritos |
| `/cuenta` | Inicio de sesión y registro (demo) |
| `/info/:slug` | Páginas informativas de relleno |

## Personalización

- **Productos:** edita `src/data/products.js`. Cada producto admite `images: ['url1', 'url2', 'url3']` para reemplazar las ilustraciones SVG por fotografías reales.
- **Identidad visual:** cambia las variables en `:root` de `src/styles.css` (colores, tipografías, radios, sombras y espaciado).
- **Moneda:** la función `cop()` en `products.js` formatea en pesos colombianos.

## Simulaciones e integraciones pendientes

| Función | Estado actual | Para producción |
|---|---|---|
| Pagos | Selección visual, sin captura de datos | Integrar una pasarela (punto marcado en `Checkout.jsx`) |
| Autenticación | Sesión local de demostración, sin contraseñas almacenadas | Backend con autenticación segura |
| Newsletter | Validación local, no envía correos | Servicio de correo |
| Imágenes | Ilustraciones SVG de demostración | Fotografías reales de producto |
| Inventario y pedidos | Stock estático, pedidos no persistidos | API y base de datos |
| Páginas legales | Texto de relleno | Políticas reales |

## Estado de verificación

El proyecto instala y compila correctamente con `npm run build`. No incluye pruebas automatizadas y la revisión visual, de animaciones y de responsive debe hacerse en el navegador.
