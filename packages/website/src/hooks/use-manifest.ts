import { useEffect, useState } from "react";

interface ManifestEntry {
  id: string;
  bookmarkletUrl: string;
  scriptUrl: string;
  inlineSize: number;
  loaderSize: number;
}

interface Manifest {
  bookmarklets: ManifestEntry[];
}

export function useManifest() {
  const [manifest, setManifest] = useState<Manifest | null>(null);

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
