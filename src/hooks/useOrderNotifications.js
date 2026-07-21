import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getOrders } from "../services/APIservice";

const STORAGE_KEY = "tfs_last_seen_order_at";
const POLL_MS = 20000;

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export const useOrderNotifications = () => {
  const [unseenCount, setUnseenCount] = useState(0);
  const toastedIds = useRef(new Set());

  const check = useCallback(async () => {
    try {
      const res = await getOrders();
      const orders = res.data || [];
      if (orders.length === 0) return;

      const lastSeen = localStorage.getItem(STORAGE_KEY);

      if (!lastSeen) {
        localStorage.setItem(STORAGE_KEY, orders[0].createdAt);
        return;
      }

      const lastSeenDate = new Date(lastSeen);
      const nuevas = orders.filter((o) => new Date(o.createdAt) > lastSeenDate);

      nuevas.forEach((o) => {
        if (!toastedIds.current.has(o._id)) {
          toastedIds.current.add(o._id);
          toast.success(`Nueva venta de ${o.cliente?.nombre || "cliente"} — ${currency(o.total)}`, {
            icon: "🛎️",
            duration: 6000,
          });
        }
      });

      setUnseenCount(nuevas.length);
    } catch {
      // Silencioso: un fallo de polling no debe interrumpir el panel.
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, POLL_MS);
    return () => clearInterval(interval);
  }, [check]);

  const markAllSeen = useCallback(async () => {
    try {
      const res = await getOrders();
      const orders = res.data || [];
      if (orders.length > 0) {
        localStorage.setItem(STORAGE_KEY, orders[0].createdAt);
      }
    } catch {
      // no-op
    }
    setUnseenCount(0);
  }, []);

  return { unseenCount, markAllSeen };
};
