import { createContext, useContext, useEffect, useRef, useState } from "react";
import { byId } from "../data/products";

const Ctx = createContext();

const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("nx_cart", []));
  const [favs, setFavs] = useState(() => load("nx_favs", []));
  const [user, setUser] = useState(() => load("nx_user", null));
  const [orders, setOrders] = useState(() => load("nx_orders", []));
  const [discount, setDiscount] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState(null);
  const t = useRef();

  useEffect(() => {
    try {
      localStorage.setItem("nx_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("nx_favs", JSON.stringify(favs));
    } catch {}
  }, [favs]);

  useEffect(() => {
    try {
      localStorage.setItem("nx_user", JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("nx_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const say = (msg) => {
    setToast({ msg, k: Date.now() });
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast(null), 2600);
  };

  const add = (id, variant, qty = 1) => {
    const p = byId(id);
    if (!p) return;
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.variant === variant);
      if (i > -1) {
        const n = [...c];
        n[i] = { ...n[i], qty: Math.min(p.stock, n[i].qty + qty) };
        return n;
      }
      return [...c, { id, variant, qty: Math.min(p.stock, qty) }];
    });
    say(`${p.name} añadido al carrito`);
  };

  const setQty = (id, variant, qty) =>
    setCart((c) =>
      c.map((l) => {
        if (l.id === id && l.variant === variant) {
          const prod = byId(id);
          const maxStock = prod ? prod.stock : 99;
          return { ...l, qty: Math.max(1, Math.min(maxStock, qty)) };
        }
        return l;
      }),
    );

  const remove = (id, variant) =>
    setCart((c) => c.filter((l) => !(l.id === id && l.variant === variant)));

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const lines = cart
    .filter((l) => byId(l.id))
    .map((l) => ({ ...l, p: byId(l.id) }));

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.p.price, 0);
  const discounted = discount ? subtotal * (1 - discount.pct) : subtotal;

  const toggleFav = (id) => {
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    say(favs.includes(id) ? "Quitado de favoritos" : "Añadido a favoritos");
  };

  return (
    <Ctx.Provider
      value={{
        lines,
        count,
        subtotal,
        discounted,
        discount,
        setDiscount,
        add,
        setQty,
        remove,
        clear: () => setCart([]),
        favs,
        toggleFav,
        user,
        setUser,
        orders,
        addOrder,
        drawer,
        setDrawer,
        toast,
        say,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
