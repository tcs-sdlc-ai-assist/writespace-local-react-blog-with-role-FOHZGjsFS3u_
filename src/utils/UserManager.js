import { getItem, setItem } from './localStorageUtils.js';

const USERS_KEY = 'ws_users';

const SEED_ADMIN = {
  username: 'admin',
  displayName: 'Administrator',
  password: 'admin123',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

function validateUserData(userData) {
  const { username, displayName, password, role } = userData;

  if (!username || typeof username !== 'string') {
    return { error: true, message: 'Username is required.' };
  }
  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
    return { error: true, message: 'Username must be between 3 and 20 characters.' };
  }
  if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
    return { error: true, message: 'Username must be alphanumeric.' };
  }

  if (!displayName || typeof displayName !== 'string') {
    return { error: true, message: 'Display name is required.' };
  }
  const trimmedDisplayName = displayName.trim();
  if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 30) {
    return { error: true, message: 'Display name must be between 2 and 30 characters.' };
  }

  if (!password || typeof password !== 'string') {
    return { error: true, message: 'Password is required.' };
  }
  if (password.length < 6) {
    return { error: true, message: 'Password must be at least 6 characters.' };
  }

  if (!role || (role !== 'admin' && role !== 'viewer')) {
    return { error: true, message: 'Role must be either "admin" or "viewer".' };
  }

  return { error: false };
}

function loadUsers() {
  const users = getItem(USERS_KEY);
  if (!Array.isArray(users)) {
    return [];
  }
  return users;
}

function saveUsers(users) {
  return setItem(USERS_KEY, users);
}

function seedAdminIfNeeded() {
  const users = loadUsers();
  const adminExists = users.some((u) => u.username === SEED_ADMIN.username);
  if (!adminExists) {
    users.unshift({ ...SEED_ADMIN });
    saveUsers(users);
  }
}

seedAdminIfNeeded();

export function getAllUsers() {
  return loadUsers();
}

export function registerUser(userData) {
  const validation = validateUserData(userData);
  if (validation.error) {
    return validation;
  }

  const users = loadUsers();
  const trimmedUsername = userData.username.trim();
  const exists = users.some((u) => u.username === trimmedUsername);
  if (exists) {
    return { error: true, message: 'Username already exists.' };
  }

  const newUser = {
    username: trimmedUsername,
    displayName: userData.displayName.trim(),
    password: userData.password,
    role: userData.role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  const result = saveUsers(users);
  if (result.error) {
    return { error: true, message: result.message };
  }

  const { password: _password, ...publicUser } = newUser;
  return publicUser;
}

export function createUser(userData, actingUser) {
  if (!actingUser || actingUser.role !== 'admin') {
    return { error: true, message: 'Not authorized.' };
  }

  return registerUser(userData);
}

export function deleteUser(username, actingUser) {
  if (!actingUser || actingUser.role !== 'admin') {
    return { error: true, message: 'Not authorized.' };
  }

  if (username === SEED_ADMIN.username) {
    return { error: true, message: 'Cannot delete the default admin account.' };
  }

  const users = loadUsers();
  const index = users.findIndex((u) => u.username === username);
  if (index === -1) {
    return { error: true, message: 'User not found.' };
  }

  users.splice(index, 1);
  const result = saveUsers(users);
  if (result.error) {
    return { error: true, message: result.message };
  }

  return { error: false };
}