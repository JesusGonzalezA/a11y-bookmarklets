import {
  type Completion,
  type CompletionContext,
  type CompletionResult,
  snippetCompletion,
} from "@codemirror/autocomplete";
import { javascriptLanguage } from "@codemirror/lang-javascript";

// ─── document ────────────────────────────────────────────────────────────────

const documentMembers: Completion[] = [
  snippetCompletion("getElementById('${id}')", {
    label: "getElementById",
    type: "method",
    info: "Returns the element with the given ID",
  }),
  snippetCompletion("querySelector('${selector}')", {
    label: "querySelector",
    type: "method",
    info: "Returns the first element matching the CSS selector",
  }),
  snippetCompletion("querySelectorAll('${selector}')", {
    label: "querySelectorAll",
    type: "method",
    info: "Returns all elements matching the CSS selector",
  }),
  snippetCompletion("getElementsByClassName('${className}')", {
    label: "getElementsByClassName",
    type: "method",
  }),
  snippetCompletion("getElementsByTagName('${tag}')", {
    label: "getElementsByTagName",
    type: "method",
  }),
  snippetCompletion("getElementsByName('${name}')", {
    label: "getElementsByName",
    type: "method",
  }),
  snippetCompletion("createElement('${tag}')", {
    label: "createElement",
    type: "method",
    info: "Creates a new HTML element",
  }),
  snippetCompletion("createTextNode('${text}')", {
    label: "createTextNode",
    type: "method",
  }),
  snippetCompletion("createDocumentFragment()", {
    label: "createDocumentFragment",
    type: "method",
  }),
  snippetCompletion("addEventListener('${event}', ${handler})", {
    label: "addEventListener",
    type: "method",
  }),
  snippetCompletion("removeEventListener('${event}', ${handler})", {
    label: "removeEventListener",
    type: "method",
  }),
  snippetCompletion("dispatchEvent(${event})", {
    label: "dispatchEvent",
    type: "method",
  }),
  { label: "body", type: "property", info: "The <body> element" },
  { label: "head", type: "property", info: "The <head> element" },
  { label: "documentElement", type: "property", info: "The <html> element" },
  { label: "title", type: "property" },
  { label: "URL", type: "property" },
  { label: "domain", type: "property" },
  { label: "cookie", type: "property" },
  { label: "readyState", type: "property" },
  { label: "referrer", type: "property" },
  { label: "characterSet", type: "property" },
  { label: "location", type: "property" },
  { label: "scripts", type: "property" },
  { label: "styleSheets", type: "property" },
  { label: "forms", type: "property" },
  { label: "links", type: "property" },
  { label: "images", type: "property" },
  { label: "activeElement", type: "property" },
  { label: "hasFocus", type: "method" },
];

// ─── console ─────────────────────────────────────────────────────────────────

const consoleMembers: Completion[] = [
  snippetCompletion("log(${...args})", {
    label: "log",
    type: "method",
  }),
  snippetCompletion("warn(${...args})", {
    label: "warn",
    type: "method",
  }),
  snippetCompletion("error(${...args})", {
    label: "error",
    type: "method",
  }),
  snippetCompletion("info(${...args})", {
    label: "info",
    type: "method",
  }),
  snippetCompletion("debug(${...args})", {
    label: "debug",
    type: "method",
  }),
  snippetCompletion("table(${data})", {
    label: "table",
    type: "method",
    info: "Displays data as a table",
  }),
  snippetCompletion("dir(${object})", {
    label: "dir",
    type: "method",
    info: "Displays an interactive list of object properties",
  }),
  snippetCompletion("group('${label}')", {
    label: "group",
    type: "method",
  }),
  snippetCompletion("groupCollapsed('${label}')", {
    label: "groupCollapsed",
    type: "method",
  }),
  { label: "groupEnd", type: "method" },
  snippetCompletion("time('${label}')", { label: "time", type: "method" }),
  snippetCompletion("timeEnd('${label}')", {
    label: "timeEnd",
    type: "method",
  }),
  snippetCompletion("timeLog('${label}')", {
    label: "timeLog",
    type: "method",
  }),
  snippetCompletion("count('${label}')", { label: "count", type: "method" }),
  snippetCompletion("countReset('${label}')", {
    label: "countReset",
    type: "method",
  }),
  snippetCompletion("assert(${condition}, '${message}')", {
    label: "assert",
    type: "method",
  }),
  snippetCompletion("trace('${message}')", {
    label: "trace",
    type: "method",
  }),
  { label: "clear", type: "method" },
];

// ─── window ──────────────────────────────────────────────────────────────────

const windowMembers: Completion[] = [
  { label: "location", type: "property" },
  { label: "document", type: "property" },
  { label: "navigator", type: "property" },
  { label: "history", type: "property" },
  { label: "screen", type: "property" },
  { label: "performance", type: "property" },
  { label: "localStorage", type: "property" },
  { label: "sessionStorage", type: "property" },
  { label: "innerWidth", type: "property" },
  { label: "innerHeight", type: "property" },
  { label: "outerWidth", type: "property" },
  { label: "outerHeight", type: "property" },
  { label: "scrollX", type: "property" },
  { label: "scrollY", type: "property" },
  { label: "devicePixelRatio", type: "property" },
  snippetCompletion("open('${url}', '${target}')", {
    label: "open",
    type: "method",
    info: "Opens a new browser window or tab",
  }),
  { label: "close", type: "method" },
  { label: "focus", type: "method" },
  { label: "blur", type: "method" },
  snippetCompletion("alert('${message}')", { label: "alert", type: "method" }),
  snippetCompletion("confirm('${message}')", {
    label: "confirm",
    type: "method",
  }),
  snippetCompletion("prompt('${message}', '${default}')", {
    label: "prompt",
    type: "method",
  }),
  snippetCompletion("scrollTo(${x}, ${y})", {
    label: "scrollTo",
    type: "method",
  }),
  snippetCompletion("scrollBy(${x}, ${y})", {
    label: "scrollBy",
    type: "method",
  }),
  snippetCompletion("setTimeout(${callback}, ${delay})", {
    label: "setTimeout",
    type: "method",
  }),
  snippetCompletion("setInterval(${callback}, ${delay})", {
    label: "setInterval",
    type: "method",
  }),
  snippetCompletion("clearTimeout(${id})", {
    label: "clearTimeout",
    type: "method",
  }),
  snippetCompletion("clearInterval(${id})", {
    label: "clearInterval",
    type: "method",
  }),
  snippetCompletion("requestAnimationFrame(${callback})", {
    label: "requestAnimationFrame",
    type: "method",
  }),
  snippetCompletion("cancelAnimationFrame(${id})", {
    label: "cancelAnimationFrame",
    type: "method",
  }),
  snippetCompletion("matchMedia('${query}')", {
    label: "matchMedia",
    type: "method",
  }),
  snippetCompletion("getComputedStyle(${element})", {
    label: "getComputedStyle",
    type: "method",
    info: "Returns the computed styles for an element",
  }),
  snippetCompletion("fetch('${url}')", {
    label: "fetch",
    type: "method",
  }),
  snippetCompletion("postMessage(${message}, '${targetOrigin}')", {
    label: "postMessage",
    type: "method",
  }),
  snippetCompletion("addEventListener('${event}', ${handler})", {
    label: "addEventListener",
    type: "method",
  }),
  snippetCompletion("removeEventListener('${event}', ${handler})", {
    label: "removeEventListener",
    type: "method",
  }),
];

// ─── navigator ───────────────────────────────────────────────────────────────

const navigatorMembers: Completion[] = [
  { label: "userAgent", type: "property" },
  { label: "language", type: "property" },
  { label: "languages", type: "property" },
  { label: "platform", type: "property" },
  { label: "cookieEnabled", type: "property" },
  { label: "onLine", type: "property" },
  { label: "clipboard", type: "property" },
  { label: "geolocation", type: "property" },
  { label: "mediaDevices", type: "property" },
  { label: "permissions", type: "property" },
  { label: "serviceWorker", type: "property" },
  snippetCompletion("share({ title: '${title}', url: '${url}' })", {
    label: "share",
    type: "method",
  }),
  snippetCompletion("vibrate(${pattern})", {
    label: "vibrate",
    type: "method",
  }),
  snippetCompletion("sendBeacon('${url}', ${data})", {
    label: "sendBeacon",
    type: "method",
  }),
];

// ─── location ────────────────────────────────────────────────────────────────

const locationMembers: Completion[] = [
  { label: "href", type: "property" },
  { label: "hostname", type: "property" },
  { label: "host", type: "property" },
  { label: "pathname", type: "property" },
  { label: "protocol", type: "property" },
  { label: "port", type: "property" },
  { label: "search", type: "property" },
  { label: "hash", type: "property" },
  { label: "origin", type: "property" },
  snippetCompletion("assign('${url}')", { label: "assign", type: "method" }),
  snippetCompletion("replace('${url}')", {
    label: "replace",
    type: "method",
  }),
  snippetCompletion("reload()", { label: "reload", type: "method" }),
];

// ─── history ─────────────────────────────────────────────────────────────────

const historyMembers: Completion[] = [
  { label: "length", type: "property" },
  { label: "state", type: "property" },
  { label: "scrollRestoration", type: "property" },
  snippetCompletion("back()", { label: "back", type: "method" }),
  snippetCompletion("forward()", { label: "forward", type: "method" }),
  snippetCompletion("go(${delta})", { label: "go", type: "method" }),
  snippetCompletion("pushState(${state}, '${title}', '${url}')", {
    label: "pushState",
    type: "method",
  }),
  snippetCompletion("replaceState(${state}, '${title}', '${url}')", {
    label: "replaceState",
    type: "method",
  }),
];

// ─── localStorage / sessionStorage ───────────────────────────────────────────

const storageMembers: Completion[] = [
  snippetCompletion("getItem('${key}')", {
    label: "getItem",
    type: "method",
  }),
  snippetCompletion("setItem('${key}', ${value})", {
    label: "setItem",
    type: "method",
  }),
  snippetCompletion("removeItem('${key}')", {
    label: "removeItem",
    type: "method",
  }),
  snippetCompletion("key(${index})", { label: "key", type: "method" }),
  { label: "length", type: "property" },
  snippetCompletion("clear()", { label: "clear", type: "method" }),
];

// ─── Globals ──────────────────────────────────────────────────────────────────

const globalCompletions: Completion[] = [
  { label: "document", type: "variable", info: "The HTML document" },
  { label: "window", type: "variable", info: "The global window object" },
  {
    label: "console",
    type: "variable",
    info: "Console debugging API",
  },
  {
    label: "navigator",
    type: "variable",
    info: "Browser and device information",
  },
  { label: "location", type: "variable", info: "Current URL information" },
  { label: "history", type: "variable", info: "Browser navigation history" },
  { label: "localStorage", type: "variable", info: "Persistent key/value storage" },
  {
    label: "sessionStorage",
    type: "variable",
    info: "Session-scoped key/value storage",
  },
  { label: "performance", type: "variable", info: "Performance timing API" },
  { label: "screen", type: "variable", info: "Screen dimensions and information" },
  snippetCompletion("fetch('${url}')", {
    label: "fetch",
    type: "function",
    info: "Makes an HTTP request",
  }),
  snippetCompletion("setTimeout(${callback}, ${delay})", {
    label: "setTimeout",
    type: "function",
  }),
  snippetCompletion("setInterval(${callback}, ${delay})", {
    label: "setInterval",
    type: "function",
  }),
  snippetCompletion("clearTimeout(${id})", {
    label: "clearTimeout",
    type: "function",
  }),
  snippetCompletion("clearInterval(${id})", {
    label: "clearInterval",
    type: "function",
  }),
  snippetCompletion("requestAnimationFrame(${callback})", {
    label: "requestAnimationFrame",
    type: "function",
  }),
  snippetCompletion("cancelAnimationFrame(${id})", {
    label: "cancelAnimationFrame",
    type: "function",
  }),
  snippetCompletion("alert('${message}')", {
    label: "alert",
    type: "function",
  }),
  snippetCompletion("confirm('${message}')", {
    label: "confirm",
    type: "function",
  }),
  snippetCompletion("prompt('${message}')", {
    label: "prompt",
    type: "function",
  }),
  snippetCompletion("getComputedStyle(${element})", {
    label: "getComputedStyle",
    type: "function",
    info: "Returns computed styles for an element",
  }),
  snippetCompletion("matchMedia('${query}')", {
    label: "matchMedia",
    type: "function",
  }),
  snippetCompletion("queueMicrotask(${callback})", {
    label: "queueMicrotask",
    type: "function",
  }),
  snippetCompletion("structuredClone(${value})", {
    label: "structuredClone",
    type: "function",
    info: "Deep-clones a value",
  }),
  snippetCompletion("atob('${encoded}')", {
    label: "atob",
    type: "function",
    info: "Decodes a base64 string",
  }),
  snippetCompletion("btoa('${string}')", {
    label: "btoa",
    type: "function",
    info: "Encodes a string as base64",
  }),
  snippetCompletion("encodeURIComponent('${string}')", {
    label: "encodeURIComponent",
    type: "function",
  }),
  snippetCompletion("decodeURIComponent('${string}')", {
    label: "decodeURIComponent",
    type: "function",
  }),
  { label: "JSON", type: "variable" },
  { label: "Math", type: "variable" },
  { label: "Date", type: "variable" },
  { label: "Promise", type: "class" },
  { label: "MutationObserver", type: "class" },
  { label: "IntersectionObserver", type: "class" },
  { label: "ResizeObserver", type: "class" },
  { label: "URLSearchParams", type: "class" },
  { label: "URL", type: "class" },
  { label: "AbortController", type: "class" },
  { label: "AbortSignal", type: "class" },
  { label: "CustomEvent", type: "class" },
  { label: "Event", type: "class" },
  { label: "EventTarget", type: "class" },
  { label: "FormData", type: "class" },
  { label: "Headers", type: "class" },
  { label: "Request", type: "class" },
  { label: "Response", type: "class" },
  { label: "Blob", type: "class" },
  { label: "File", type: "class" },
  { label: "FileReader", type: "class" },
  { label: "Worker", type: "class" },
  { label: "XMLHttpRequest", type: "class" },
  { label: "WebSocket", type: "class" },
];

// ─── Member map ───────────────────────────────────────────────────────────────

const memberMap: Record<string, Completion[]> = {
  document: documentMembers,
  console: consoleMembers,
  window: windowMembers,
  navigator: navigatorMembers,
  location: locationMembers,
  history: historyMembers,
  localStorage: storageMembers,
  sessionStorage: storageMembers,
};

// ─── Completion source ────────────────────────────────────────────────────────

function completionSource(context: CompletionContext): CompletionResult | null {
  // Member access: document.querySelector, console.log, etc.
  const memberMatch = context.matchBefore(/\w+\.\w*$/);
  if (memberMatch) {
    const dot = memberMatch.text.indexOf(".");
    const obj = memberMatch.text.slice(0, dot);
    const prop = memberMatch.text.slice(dot + 1);
    const completions = memberMap[obj];
    if (completions) {
      return {
        from: memberMatch.to - prop.length,
        options: completions,
        validFor: /^\w*$/,
      };
    }
  }

  // Global identifiers
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  return {
    from: word.from,
    options: globalCompletions,
    validFor: /^\w*$/,
  };
}

export const browserCompletions = javascriptLanguage.data.of({
  autocomplete: completionSource,
});
