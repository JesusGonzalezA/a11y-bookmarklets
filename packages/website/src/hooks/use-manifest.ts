import { useEffect, useState } from "react";

interface ManifestEntry {
  id: string;
  name: string;
  description: string;
  wcag: string[];
  bookmarkletUrl: string;
  jsFile: string;
  size: number;
}

export function useManifest() {
  const [manifest, setManifest] = useState<ManifestEntry[] | null>(null);

  useEffect(() => {
    fetch("/bookmarklets/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setManifest)
      .catch(() => setManifest(null));
  }, []);

  return manifest;
}
