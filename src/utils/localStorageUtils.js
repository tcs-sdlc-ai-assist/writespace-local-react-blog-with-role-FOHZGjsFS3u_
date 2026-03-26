const fallbackMap = new Map();

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    if (fallbackMap.has(key)) return fallbackMap.get(key);
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    fallbackMap.set(key, value);
    return { error: false };
  } catch {
    fallbackMap.set(key, value);
    return { error: true, message: 'Storage unavailable.' };
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    fallbackMap.delete(key);
    return { error: false };
  } catch {
    fallbackMap.delete(key);
    return { error: true, message: 'Storage unavailable.' };
  }
}