import { useEffect } from "react";

export default function LanguageTest() {
  useEffect(() => {
    const html = document.documentElement;
    const originalLang = html.getAttribute("lang");

    // ERROR: Set invalid BCP 47 language tag
    html.setAttribute("lang", "xx-invalid");

    return () => {
      if (originalLang) {
        html.setAttribute("lang", originalLang);
      } else {
        html.removeAttribute("lang");
      }
    };
  }, []);

  return (
    <div>
      <h2>Multilingual Blog</h2>
      <p>
        This page tests language attributes. The <code>&lt;html lang&gt;</code> has been set to an
        invalid value for testing.
      </p>

      {/* ERROR: Spanish paragraph without lang attribute */}
      <div className="my-4 p-4 border rounded">
        <h3>Featured Article</h3>
        <p>
          La accesibilidad web es fundamental para garantizar que todas las personas puedan usar
          internet de manera efectiva, independientemente de sus capacidades o discapacidades.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          ↑ Spanish content without <code>lang="es"</code> — screen readers will pronounce it with
          English phonetics.
        </p>
      </div>

      {/* ERROR: French paragraph without lang attribute */}
      <div className="my-4 p-4 border rounded">
        <h3>Article en Vedette</h3>
        <p>
          L'accessibilité du web est essentielle pour garantir que toutes les personnes puissent
          utiliser Internet efficacement, quelles que soient leurs capacités ou handicaps.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          ↑ French content without <code>lang="fr"</code> — screen readers will mispronounce it.
        </p>
      </div>

      {/* ERROR: Element with invalid BCP 47 lang value */}
      <div className="my-4 p-4 border rounded" lang="not-a-language">
        <h3>Quoted Text</h3>
        <p>
          This section has <code>lang="not-a-language"</code>, which is not a valid BCP 47 tag.
        </p>
      </div>

      {/* ERROR: Mixed language inline without lang attributes */}
      <div className="my-4 p-4 border rounded">
        <h3>International Greetings</h3>
        <p>
          Hello! <span>Hola, ¿cómo estás?</span> We also say{" "}
          <span>Bonjour, comment allez-vous?</span> and <span>Guten Tag, wie geht es Ihnen?</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          ↑ Inline foreign language phrases without respective <code>lang</code> attributes.
        </p>
      </div>

      {/* CORRECT: Proper lang attributes */}
      <div className="my-4 p-4 border rounded border-green-200 bg-green-50">
        <h3>Correct Example</h3>
        <p>
          English text followed by properly tagged foreign language:{" "}
          <span lang="es">Hola, ¿cómo estás?</span> and{" "}
          <span lang="fr">Bonjour, comment allez-vous?</span> and{" "}
          <span lang="de">Guten Tag, wie geht es Ihnen?</span>
        </p>
      </div>
    </div>
  );
}
