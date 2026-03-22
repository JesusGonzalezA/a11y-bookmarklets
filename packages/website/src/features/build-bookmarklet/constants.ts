export const DEFAULT_CODE = `(function () {
  // Clean up previous run
  document.getElementById("headings-panel")?.remove();
  document.querySelectorAll("[data-heading-badge]").forEach(b => b.remove());
  document.querySelectorAll("[data-heading-outline]").forEach(el => {
    el.style.outline = "";
    delete el.dataset.headingOutline;
  });

  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  const colors = {
    H1: "#e74c3c", H2: "#e67e22", H3: "#f1c40f",
    H4: "#2ecc71", H5: "#3498db", H6: "#9b59b6"
  };

  // Outline each heading and add a badge
  headings.forEach(h => {
    const tag = h.tagName;
    const color = colors[tag] || "#999";
    h.style.outline = "2px solid " + color;
    h.dataset.headingOutline = "true";

    const badge = document.createElement("span");
    badge.dataset.headingBadge = "true";
    badge.textContent = tag.toLowerCase();
    badge.style.cssText =
      "background:" + color + ";color:#fff;font:bold 11px/1 monospace;" +
      "padding:2px 6px;border-radius:3px;margin-right:6px;vertical-align:middle;";
    h.insertBefore(badge, h.firstChild);
  });

  // Build panel
  const panel = document.createElement("div");
  panel.id = "headings-panel";
  panel.style.cssText =
    "position:fixed;top:10px;right:10px;width:320px;max-height:80vh;" +
    "overflow:auto;background:#1e1e2e;color:#cdd6f4;font:13px/1.5 system-ui;" +
    "border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:999999;padding:16px;";

  let html = "<h2 style='margin:0 0 12px;font-size:15px;'>Headings (" + headings.length + ")</h2><ul style='list-style:none;padding:0;margin:0;'>";
  headings.forEach(h => {
    const tag = h.tagName;
    const indent = (parseInt(tag[1]) - 1) * 16;
    const color = colors[tag] || "#999";
    const text = h.textContent.replace(tag.toLowerCase(), "").trim().slice(0, 60);
    html += "<li style='padding:4px 0 4px " + indent + "px;border-bottom:1px solid #313244;'>" +
      "<span style='background:" + color + ";color:#fff;font:bold 10px/1 monospace;padding:1px 5px;border-radius:3px;margin-right:8px;'>" + tag.toLowerCase() + "</span>" +
      (text || "<em style='opacity:.5;'>empty</em>") + "</li>";
  });
  html += "</ul>";

  // Clean-up button
  html += "<button id='headings-panel-close' style='margin-top:12px;width:100%;padding:8px;background:#f38ba8;color:#1e1e2e;border:none;border-radius:6px;font:bold 13px system-ui;cursor:pointer;'>Clean up</button>";

  panel.innerHTML = html;
  document.body.appendChild(panel);

  document.getElementById("headings-panel-close").addEventListener("click", function () {
    document.querySelectorAll("[data-heading-badge]").forEach(b => b.remove());
    document.querySelectorAll("[data-heading-outline]").forEach(el => {
      el.style.outline = "";
      delete el.dataset.headingOutline;
    });
    panel.remove();
  });
})();`;
