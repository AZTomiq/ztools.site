import { describe, it, expect } from 'vitest';
import { getBlogPosts } from '../../scripts/builds/data';

describe('Build Data Loader (Integration)', () => {
  it('should load real blog posts from file system', () => {
    const posts = getBlogPosts();

    // We know there is at least 'making-of-playground'
    expect(posts.length).toBeGreaterThan(0);

    const playgroundPost = posts.find(p => p.slug === 'making-of-playground');
    expect(playgroundPost).toBeDefined();
    expect(playgroundPost.title).toContain('Playground');
    expect(playgroundPost.body).toBeDefined();
  });
});
