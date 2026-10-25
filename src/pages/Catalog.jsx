import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  PackageX,
  ArrowUpDown,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products, categories, brands, cop } from "../data/products";
import { useAnim, gsap, q, reduced } from "../hooks/useAnim";

const PAGE_SIZE = 8;
const MAX_PRICE = Math.max(...products.map((p) => p.price));

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [mobOpen, setMobOpen] = useState(false);

  // 1. Lectura inicial y reactiva desde URL params
  const paramQ = searchParams.get("q") || "";
  const paramCat = searchParams.get("cat")
    ? searchParams.get("cat").split(",").filter(Boolean)
    : [];
  const paramBrand = searchParams.get("brand")
    ? searchParams.get("brand").split(",").filter(Boolean)
    : [];
  const paramMin = searchParams.get("min") ? Number(searchParams.get("min")) : 0;
  const paramMax = searchParams.get("max")
    ? Number(searchParams.get("max"))
    : MAX_PRICE;
  const paramStock =
    searchParams.get("stock") === "1" || searchParams.get("stock") === "true";
  const paramSort = searchParams.get("sort") || "rel";

  // Estados locales sincronizados
  const [searchText, setSearchText] = useState(paramQ);
  const [selectedCats, setSelectedCats] = useState(paramCat);
  const [selectedBrands, setSelectedBrands] = useState(paramBrand);
  const [minPrice, setMinPrice] = useState(paramMin);
  const [maxPrice, setMaxPrice] = useState(paramMax);
  const [onlyStock, setOnlyStock] = useState(paramStock);
  const [sortBy, setSortBy] = useState(paramSort);

  // Sincronizar estados locales cuando cambian los searchParams externos
  useEffect(() => {
    setSearchText(paramQ);
    setSelectedCats(paramCat);
    setSelectedBrands(paramBrand);
    setMinPrice(paramMin);
    setMaxPrice(paramMax);
    setOnlyStock(paramStock);
    setSortBy(paramSort);
    setPage(1);
  }, [searchParams.toString()]); // eslint-disable-line

  // Actualizador central de URL params
  const applyParams = (next) => {
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    if (next.cat && next.cat.length) p.set("cat", next.cat.join(","));
    if (next.brand && next.brand.length) p.set("brand", next.brand.join(","));
    if (next.min > 0) p.set("min", String(next.min));
    if (next.max < MAX_PRICE) p.set("max", String(next.max));
    if (next.stock) p.set("stock", "1");
    if (next.sort && next.sort !== "rel") p.set("sort", next.sort);
    setSearchParams(p, { replace: true });
    setPage(1);
  };

  // Toggle helpers
  const handleToggleCat = (cat) => {
    const updated = selectedCats.includes(cat)
      ? selectedCats.filter((c) => c !== cat)
      : [...selectedCats, cat];
    setSelectedCats(updated);
    applyParams({
      q: searchText,
      cat: updated,
      brand: selectedBrands,
      min: minPrice,
      max: maxPrice,
      stock: onlyStock,
      sort: sortBy,
    });
  };

  const handleToggleBrand = (b) => {
    const updated = selectedBrands.includes(b)
      ? selectedBrands.filter((x) => x !== b)
      : [...selectedBrands, b];
    setSelectedBrands(updated);
    applyParams({
      q: searchText,
      cat: selectedCats,
      brand: updated,
      min: minPrice,
      max: maxPrice,
      stock: onlyStock,
      sort: sortBy,
    });
  };

  const handleSearchChange = (val) => {
    setSearchText(val);
    applyParams({
      q: val,
      cat: selectedCats,
      brand: selectedBrands,
      min: minPrice,
      max: maxPrice,
      stock: onlyStock,
      sort: sortBy,
    });
  };

  const handleMaxPriceChange = (val) => {
    const num = Number(val);
    setMaxPrice(num);
    applyParams({
      q: searchText,
      cat: selectedCats,
      brand: selectedBrands,
      min: minPrice,
      max: num,
      stock: onlyStock,
      sort: sortBy,
    });
  };

  const handleMinPriceChange = (val) => {
    const num = Math.max(0, Number(val));
    setMinPrice(num);
    applyParams({
      q: searchText,
      cat: selectedCats,
      brand: selectedBrands,
      min: num,
      max: maxPrice,
      stock: onlyStock,
      sort: sortBy,
    });
  };

  const handleStockChange = (checked) => {
    setOnlyStock(checked);
    applyParams({
      q: searchText,
      cat: selectedCats,
      brand: selectedBrands,
      min: minPrice,
      max: maxPrice,
      stock: checked,
      sort: sortBy,
    });
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    applyParams({
      q: searchText,
      cat: selectedCats,
      brand: selectedBrands,
      min: minPrice,
      max: maxPrice,
      stock: onlyStock,
      sort: val,
    });
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedCats([]);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setOnlyStock(false);
    setSortBy("rel");
    setSearchParams({}, { replace: true });
    setPage(1);
    setMobOpen(false);
  };

  // 2. Filtrado y ordenamiento conjunto con useMemo
  const filteredList = useMemo(() => {
    let result = products.filter((p) => {
      // Búsqueda por texto (nombre, marca o descripción)
      if (searchText.trim()) {
        const qClean = searchText.trim().toLowerCase();
        const matchesName = p.name.toLowerCase().includes(qClean);
        const matchesBrand = p.brand.toLowerCase().includes(qClean);
        const matchesDesc = p.desc.toLowerCase().includes(qClean);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }
      // Categorías seleccionadas
      if (selectedCats.length > 0 && !selectedCats.includes(p.category)) {
        return false;
      }
      // Marcas seleccionadas
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Rango de precio
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }
      // Solo en stock
      if (onlyStock && p.stock <= 0) {
        return false;
      }
      return true;
    });

    // Ordenamiento
    if (sortBy === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "alpha") {
      result.sort((a, b) => a.name.localeCompare(b.name, "es"));
    } else if (sortBy === "new") {
      result.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    } else {
      // Relevancia: Destacados primero, luego por rating
      result.sort((a, b) => {
        const aDest = a.tags.includes("Destacado") ? 1 : 0;
        const bDest = b.tags.includes("Destacado") ? 1 : 0;
        if (bDest !== aDest) return bDest - aDest;
        return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
      });
    }

    return result;
  }, [searchText, selectedCats, selectedBrands, minPrice, maxPrice, onlyStock, sortBy]);

  const displayedList = filteredList.slice(0, page * PAGE_SIZE);
  const listKey = displayedList.map((p) => p.id).join(",");

  // 3. GSAP: Animar tarjetas con batch stagger al cambiar lista filtrada
  const containerRef = useAnim(
    (root) => {
      const cards = q(root, ".catalog-grid .card");
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    },
    [listKey]
  );

  // 4. GSAP: Animar número contador cuando cambia la cantidad
  const counterRef = useRef(null);
  const prevCount = useRef(filteredList.length);

  useEffect(() => {
    if (reduced() || !counterRef.current) return;
    const target = filteredList.length;
    const startVal = prevCount.current;
    const animObj = { val: startVal };

    gsap.to(animObj, {
      val: target,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(animObj.val);
        }
      },
    });

    prevCount.current = target;
  }, [filteredList.length]);

  useEffect(() => {
    document.title = "Catálogo de Periféricos y Audio — NEXORA";
  }, []);

  const activeFiltersCount =
    (searchText ? 1 : 0) +
    selectedCats.length +
    selectedBrands.length +
    (minPrice > 0 || maxPrice < MAX_PRICE ? 1 : 0) +
    (onlyStock ? 1 : 0) +
    (sortBy !== "rel" ? 1 : 0);

  return (
    <div className="wrap section" ref={containerRef}>
      <div className="sec-head reveal">
        <div>
          <h1 className="page-title">Catálogo</h1>
          <p className="muted">
            Explora nuestra gama de productos seleccionados para el máximo rendimiento.
          </p>
        </div>
      </div>

      {/* Botón flotante para abrir filtros en mobile */}
      <button
        type="button"
        className="btn ghost mob-filter-trigger"
        onClick={() => setMobOpen(true)}
        aria-label="Abrir panel de filtros"
      >
        <SlidersHorizontal size={18} />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="filter-badge">{activeFiltersCount}</span>
        )}
      </button>

      {/* Backdrop para mobile drawer */}
      <div
        className={`filter-backdrop ${mobOpen ? "open" : ""}`}
        onClick={() => setMobOpen(false)}
        role="presentation"
        aria-hidden={!mobOpen}
      />

      <div className="layout">
        {/* Panel lateral de Filtros */}
        <aside
          className={`filters ${mobOpen ? "mob-drawer open" : "mob-drawer"}`}
          aria-label="Filtros del catálogo"
        >
          <div className="filter-sec" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="filter-title">
              <SlidersHorizontal size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="filter-badge" style={{ marginLeft: 8 }}>{activeFiltersCount}</span>
              )}
            </span>
            <button
              type="button"
              className="icon-btn filter-close-btn"
              onClick={() => setMobOpen(false)}
              aria-label="Cerrar filtros"
            >
              <X size={18} />
            </button>
          </div>

          {/* Búsqueda */}
          <div className="filter-sec">
            <span className="filter-title">Búsqueda</span>
            <div className="search" style={{ width: "100%", background: "var(--bg3)" }}>
              <Search size={16} className="muted" />
              <input
                type="search"
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Nombre, marca..."
                aria-label="Buscar producto por nombre"
              />
              {searchText && (
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 28, height: 28 }}
                  onClick={() => handleSearchChange("")}
                  aria-label="Borrar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Categorías (Checkboxes múltiples) */}
          <div className="filter-sec">
            <span className="filter-title">Categoría</span>
            <div className="check-list">
              {categories.map((c) => {
                const isChecked = selectedCats.includes(c);
                const count = products.filter((p) => p.category === c).length;
                return (
                  <label key={c} className="check-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCat(c)}
                    />
                    <span style={{ flex: 1 }}>{c}</span>
                    <small className="muted">({count})</small>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Marcas (Checkboxes múltiples) */}
          <div className="filter-sec">
            <span className="filter-title">Marca</span>
            <div className="check-list">
              {brands.map((b) => {
                const isChecked = selectedBrands.includes(b);
                const count = products.filter((p) => p.brand === b).length;
                return (
                  <label key={b} className="check-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleBrand(b)}
                    />
                    <span style={{ flex: 1 }}>{b}</span>
                    <small className="muted">({count})</small>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rango de Precios */}
          <div className="filter-sec">
            <span className="filter-title">Precio (COP)</span>
            <div className="price-row">
              <input
                type="number"
                min="0"
                max={maxPrice}
                step="50000"
                value={minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                placeholder="Mín"
                aria-label="Precio mínimo"
              />
              <span>a</span>
              <input
                type="number"
                min={minPrice}
                max={MAX_PRICE}
                step="50000"
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                placeholder="Máx"
                aria-label="Precio máximo"
              />
            </div>
            <input
              type="range"
              min="100000"
              max={MAX_PRICE}
              step="50000"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              aria-label="Ajustar precio máximo"
            />
            <small className="muted" style={{ display: "block", textAlign: "right" }}>
              Hasta {cop(maxPrice)}
            </small>
          </div>

          {/* Disponibilidad (Solo en stock) */}
          <div className="filter-sec">
            <span className="filter-title">Disponibilidad</span>
            <label className="check-item">
              <input
                type="checkbox"
                checked={onlyStock}
                onChange={(e) => handleStockChange(e.target.checked)}
              />
              <span>Solo productos en stock</span>
            </label>
          </div>

          {/* Ordenar */}
          <div className="filter-sec">
            <span className="filter-title">
              <ArrowUpDown size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Ordenar por
            </span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              aria-label="Criterio de ordenación"
            >
              <option value="rel">Relevancia</option>
              <option value="new">Novedades (recientes)</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
              <option value="alpha">Alfabético: A – Z</option>
            </select>
          </div>

          {/* Botón limpiar */}
          <button
            type="button"
            className="btn ghost"
            style={{ width: "100%", marginTop: "0.5rem" }}
            onClick={handleClearFilters}
          >
            <RotateCcw size={16} /> Limpiar filtros
          </button>
        </aside>

        {/* Contenido principal: Contador y Grid */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--s2)",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <p className="count" role="status" style={{ margin: 0 }}>
              Mostrando{" "}
              <strong>
                <span ref={counterRef}>{filteredList.length}</span>
              </strong>{" "}
              {filteredList.length === products.length
                ? "productos"
                : `de ${products.length} productos`}
            </p>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="link-hover muted"
                style={{ background: "none", border: 0, cursor: "pointer", fontSize: "0.88rem" }}
                onClick={handleClearFilters}
              >
                Limpiar {activeFiltersCount} {activeFiltersCount === 1 ? "filtro" : "filtros"}
              </button>
            )}
          </div>

          {/* Estado Vacío */}
          {filteredList.length === 0 ? (
            <div className="empty" style={{ background: "var(--bg2)", borderRadius: "var(--r)", border: "1px solid var(--line)" }}>
              <PackageX size={48} className="muted" />
              <h3>No encontramos productos con esos filtros</h3>
              <p className="muted" style={{ maxWidth: "42ch" }}>
                Prueba ajustando el rango de precios, removiendo categorías o buscando con un término más general.
              </p>
              <button
                type="button"
                className="btn"
                onClick={handleClearFilters}
              >
                <RotateCcw size={18} /> Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <>
              {/* Grid de Productos con key estable por producto (p.id) */}
              <div className="grid g3 catalog-grid">
                {displayedList.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>

              {/* Paginación / Cargar más */}
              {displayedList.length < filteredList.length && (
                <div className="more">
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setPage(page + 1)}
                  >
                    Cargar más ({filteredList.length - displayedList.length} restantes)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
