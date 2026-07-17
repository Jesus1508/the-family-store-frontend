import { useEffect, useState } from "react";
import { getSettings } from "../services/APIservice";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((res) => setSettings(res.data))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
};
