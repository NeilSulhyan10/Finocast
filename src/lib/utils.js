export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(num, options = {}) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    ...options,
  }).format(num);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(text, length = 100) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function classNames(...args) {
  return cn(...args);
}