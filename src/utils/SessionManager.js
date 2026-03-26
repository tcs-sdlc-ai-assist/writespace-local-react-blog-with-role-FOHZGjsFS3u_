import { getItem, setItem, removeItem } from './localStorageUtils.js';
import { getAllUsers } from './UserManager.js';

const SESSION_KEY = 'ws_session';

export function login(username, password) {
  if (!username || !password) {
    return { error: true, message: 'Username and password are required.' };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return { error: true, message: 'Invalid username or password.' };
  }

  const session = {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    loginAt: new Date().toISOString(),
  };

  const result = setItem(SESSION_KEY, session);
  if (result.error) {
    return { error: true, message: result.message };
  }

  return session;
}

export function logout() {
  removeItem(SESSION_KEY);
}

export function getCurrentSession() {
  const session = getItem(SESSION_KEY);
  if (!session || typeof session !== 'object') {
    return null;
  }
  return session;
}