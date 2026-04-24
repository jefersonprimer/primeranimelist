'use client';

import { useState, useEffect } from 'react';
import { Post } from '../types/posts'; 

const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        const response = await fetch('/api/v1/posts');
        if (!response.ok) {
          throw new Error(`Failed to fetch posts (${response.status})`);
        }
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        // The API returns { data: [...], pagination: {...} }
        const rawPosts = responseData.data ?? responseData;
        const postsData = Array.isArray(rawPosts) ? rawPosts : [rawPosts];
        
        // Validate each post has required fields
        const validPosts = postsData.filter(post => {
          const isValid = post && 
            (typeof post.id === 'number' || typeof post.id === 'string') && 
            typeof post.title === 'string' &&
            typeof post.category === 'string' &&
            typeof post.created_at === 'string' &&
            typeof post.slug === 'string';
          
          if (!isValid) {
            console.warn('Invalid post found:', post);
          }
          return isValid;
        });

        console.log('Valid posts:', validPosts);
        setPosts(validPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Erro ao buscar os posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export default useFetchPosts;