import { getItem, setItem } from './localStorageUtils.js';
import { canEditPost, canDeletePost } from './AccessControl.js';

const POSTS_KEY = 'ws_posts';

function generateId() {
  return 'post_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

function validatePostData(postData) {
  const { title, content, excerpt } = postData;

  if (!title || typeof title !== 'string') {
    return { error: true, message: 'Title is required.' };
  }
  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
    return { error: true, message: 'Title must be between 3 and 100 characters.' };
  }

  if (!content || typeof content !== 'string') {
    return { error: true, message: 'Content is required.' };
  }
  const trimmedContent = content.trim();
  if (trimmedContent.length < 1 || trimmedContent.length > 5000) {
    return { error: true, message: 'Content must be between 1 and 5000 characters.' };
  }

  if (!excerpt || typeof excerpt !== 'string') {
    return { error: true, message: 'Excerpt is required.' };
  }
  const trimmedExcerpt = excerpt.trim();
  if (trimmedExcerpt.length < 1 || trimmedExcerpt.length > 200) {
    return { error: true, message: 'Excerpt must be between 1 and 200 characters.' };
  }

  return { error: false };
}

function loadPosts() {
  const posts = getItem(POSTS_KEY);
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts;
}

function savePosts(posts) {
  return setItem(POSTS_KEY, posts);
}

export function getAllPosts() {
  return loadPosts();
}

export function getPostById(postId) {
  if (!postId) return null;
  const posts = loadPosts();
  return posts.find((p) => p.id === postId) || null;
}

export function createPost(postData, actingUser) {
  if (!actingUser) {
    return { error: true, message: 'Not authorized.' };
  }

  const validation = validatePostData(postData);
  if (validation.error) {
    return validation;
  }

  const now = new Date().toISOString();
  const newPost = {
    id: generateId(),
    title: postData.title.trim(),
    content: postData.content.trim(),
    excerpt: postData.excerpt.trim(),
    author: actingUser.username,
    authorDisplayName: actingUser.displayName,
    createdAt: postData.createdAt || now,
    updatedAt: now,
  };

  const posts = loadPosts();
  posts.push(newPost);

  const result = savePosts(posts);
  if (result.error) {
    return { error: true, message: result.message };
  }

  return newPost;
}

export function editPost(postId, postData, actingUser) {
  if (!actingUser) {
    return { error: true, message: 'Not authorized.' };
  }

  const posts = loadPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    return { error: true, message: 'Post not found.' };
  }

  const existingPost = posts[index];

  if (!canEditPost(actingUser, existingPost)) {
    return { error: true, message: 'Not authorized.' };
  }

  const validation = validatePostData(postData);
  if (validation.error) {
    return validation;
  }

  const updatedPost = {
    ...existingPost,
    title: postData.title.trim(),
    content: postData.content.trim(),
    excerpt: postData.excerpt.trim(),
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updatedPost;

  const result = savePosts(posts);
  if (result.error) {
    return { error: true, message: result.message };
  }

  return updatedPost;
}

export function deletePost(postId, actingUser) {
  if (!actingUser) {
    return { error: true, message: 'Not authorized.' };
  }

  const posts = loadPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    return { error: true, message: 'Post not found.' };
  }

  const existingPost = posts[index];

  if (!canDeletePost(actingUser, existingPost)) {
    return { error: true, message: 'Not authorized.' };
  }

  posts.splice(index, 1);

  const result = savePosts(posts);
  if (result.error) {
    return { error: true, message: result.message };
  }

  return { error: false };
}