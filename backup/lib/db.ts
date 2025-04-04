import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Check if we have the required environment variables for Supabase
const hasSupabaseConfig =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key';

// Create a dummy client or a real one based on available config
let supabase: any = null;

if (hasSupabaseConfig) {
  try {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabase = null;
  }
}

export { supabase, hasSupabaseConfig };

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  meta_description: string;
  target_keyword: string;
  word_count: number;
  post_type: string;
  tone: string;
  audience: string;
  language: string;
  created_at: string;
  updated_at: string;
  first_person: boolean;
  stories_examples: boolean;
  hook: boolean;
  interactive_element: boolean;
  interactive_element_code?: string;
  faq: boolean;
};

// In-memory cache of demo posts (will be synchronized with our file-based storage)
const dynamicDemoPosts: Record<string, BlogPost> = {};

// Predefined demo posts that are always available
const PREDEFINED_DEMO_POSTS: BlogPost[] = [
  {
    id: 'demo-1',
    title: 'Best Gaming Laptops for 2025',
    content: '# Best Gaming Laptops for 2025\n\nMeta Description: Discover the top gaming laptops of 2025 with our comprehensive guide. Find the perfect balance of performance, portability, and price.\n\n## Introduction\n\nGaming laptops have come a long way in 2025...',
    meta_description: 'Discover the top gaming laptops of 2025 with our comprehensive guide. Find the perfect balance of performance, portability, and price.',
    target_keyword: 'best gaming laptops',
    word_count: 1500,
    post_type: 'listicle',
    tone: 'conversational',
    audience: 'gamers',
    language: 'English',
    first_person: false,
    stories_examples: true,
    hook: true,
    interactive_element: false,
    interactive_element_code: undefined,
    faq: false,
    created_at: '2025-04-01T12:00:00Z',
    updated_at: '2025-04-01T12:00:00Z',
  },
  {
    id: 'demo-2',
    title: 'How to Choose the Perfect Coffee Machine in 2025',
    content: '# How to Choose the Perfect Coffee Machine in 2025\n\nMeta Description: Learn how to select the ideal coffee machine for your home with our step-by-step guide. Compare features, prices, and brands to make the best choice.\n\n## Introduction\n\nA great cup of coffee starts with the right machine...',
    meta_description: 'Learn how to select the ideal coffee machine for your home with our step-by-step guide. Compare features, prices, and brands to make the best choice.',
    target_keyword: 'choose coffee machine',
    word_count: 1200,
    post_type: 'how-to guide',
    tone: 'friendly',
    audience: 'coffee enthusiasts',
    language: 'English',
    first_person: true,
    stories_examples: true,
    hook: true,
    interactive_element: true,
    interactive_element_code: `<div class="coffee-comparison-tool">
  <h3>Coffee Machine Comparison Tool</h3>
  <div class="comparison-form">
    <div class="form-row">
      <label for="budgetRange">Your Budget:</label>
      <input type="range" id="budgetRange" min="50" max="1000" value="500" step="50">
      <span id="budgetValue">$500</span>
    </div>
    <div class="form-row">
      <label>Machine Type:</label>
      <select id="machineType">
        <option value="espresso">Espresso Machine</option>
        <option value="drip">Drip Coffee Maker</option>
        <option value="pod">Pod/Capsule Machine</option>
        <option value="french">French Press</option>
      </select>
    </div>
    <button id="findMachines" class="compare-button">Find My Perfect Coffee Machine</button>
  </div>
  <div id="resultsContainer" class="results-container"></div>
</div>
<script>
  // This would be replaced with actual functionality in a real implementation
  document.getElementById('budgetRange').addEventListener('input', function() {
    document.getElementById('budgetValue').textContent = '$' + this.value;
  });
  
  document.getElementById('findMachines').addEventListener('click', function() {
    const budget = document.getElementById('budgetRange').value;
    const type = document.getElementById('machineType').value;
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h4>Recommended Coffee Machines</h4>' +
      '<p>Based on your budget of $' + budget + ' and preference for ' + type + ' machines:</p>' +
      '<ul>' +
      '<li>Coffee Machine Model X - $' + (budget - 100) + '</li>' +
      '<li>Premium Model Y - $' + budget + '</li>' +
      '<li>Budget-friendly Model Z - $' + (budget / 2) + '</li>' +
      '</ul>';
  });
</script>`,
    faq: true,
    created_at: '2025-03-15T10:30:00Z',
    updated_at: '2025-03-15T10:30:00Z',
  },
];

// File path for storing demo posts
const DEMO_POSTS_FILE = path.join(process.cwd(), 'demo_posts.json');

// Load demo posts from file
const loadDemoPostsFromFile = (): Record<string, BlogPost> => {
  try {
    if (fs.existsSync(DEMO_POSTS_FILE)) {
      const data = fs.readFileSync(DEMO_POSTS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      console.log(`[loadDemoPostsFromFile] Loaded ${Object.keys(parsed).length} posts from file`);
      return parsed;
    }
  } catch (error) {
    console.error('[loadDemoPostsFromFile] Error loading demo posts:', error);
  }
  return {};
};

// Save demo posts to file
const saveDemoPostsToFile = (posts: Record<string, BlogPost>) => {
  try {
    fs.writeFileSync(DEMO_POSTS_FILE, JSON.stringify(posts, null, 2));
    console.log(`[saveDemoPostsToFile] Saved ${Object.keys(posts).length} posts to file`);
  } catch (error) {
    console.error('[saveDemoPostsToFile] Error saving demo posts:', error);
  }
};

// Initialize dynamicDemoPosts from file on module load
try {
  const savedPosts = loadDemoPostsFromFile();
  Object.keys(savedPosts).forEach(key => {
    dynamicDemoPosts[key] = savedPosts[key];
  });
} catch (error) {
  console.error('[init] Error initializing demo posts:', error);
}

// Export for debugging
export { dynamicDemoPosts, PREDEFINED_DEMO_POSTS };

export async function getAllPosts() {
  // If Supabase is not configured, return demo data
  if (!hasSupabaseConfig) {
    // Load any dynamically created posts from file
    const savedPosts = loadDemoPostsFromFile();
    
    // Update our in-memory cache
    Object.keys(savedPosts).forEach(key => {
      dynamicDemoPosts[key] = savedPosts[key];
    });
    
    // Get dynamic posts from our updated cache
    const dynamicPosts = Object.values(dynamicDemoPosts);
    console.log('Dynamic posts in getAllPosts:', dynamicPosts.length, dynamicPosts.map(p => p.id));

    // Return all posts, sorted by creation date (newest first)
    const allPosts = [...PREDEFINED_DEMO_POSTS, ...dynamicPosts].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log('All posts in getAllPosts:', allPosts.length, allPosts.map(p => p.id));
    return allPosts;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data as BlogPost[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id: string) {
  console.log(`[getPostById] Called with ID: ${id}`);
  
  // If Supabase is not configured, return demo data
  if (!hasSupabaseConfig) {
    // Check if it's one of our predefined demo posts
    if (id === 'demo-1') {
      console.log('[getPostById] Returning predefined demo-1 post');
      return PREDEFINED_DEMO_POSTS[0];
    } else if (id === 'demo-2') {
      console.log('[getPostById] Returning predefined demo-2 post');
      return PREDEFINED_DEMO_POSTS[1];
    }
    
    // Check if it's in our in-memory cache first
    if (dynamicDemoPosts[id]) {
      console.log(`[getPostById] Found dynamic post in memory with ID: ${id}`);
      return dynamicDemoPosts[id];
    }
    
    // If not in memory, check our file storage
    try {
      const savedPosts = loadDemoPostsFromFile();
      if (savedPosts[id]) {
        console.log(`[getPostById] Found dynamic post in file storage with ID: ${id}`);
        // Update our in-memory cache
        dynamicDemoPosts[id] = savedPosts[id];
        return savedPosts[id];
      }
    } catch (error) {
      console.error(`[getPostById] Error loading post ${id} from file:`, error);
    }
    
    // Return null for any IDs we don't recognize
    console.log(`[getPostById] Post not found with ID: ${id}`);
    console.log(`[getPostById] Available dynamic posts: ${Object.keys(dynamicDemoPosts).join(', ')}`);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data as BlogPost;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> | any) {
  // If Supabase is not configured, create and store a demo post
  if (!hasSupabaseConfig) {
    // If the post already has an ID, use it (for the API route)
    const demoId = post.id ? post.id : `demo-${Date.now()}`;
    const newPost = {
      id: demoId,
      ...post,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || new Date().toISOString(),
    } as BlogPost;

    console.log(`[createPost] Creating demo post with ID: ${newPost.id}, Title: ${newPost.title}`);
    
    // Store the post in our in-memory cache
    dynamicDemoPosts[demoId] = newPost;
    
    // Load any existing posts from file
    const existingPosts = loadDemoPostsFromFile();
    
    // Add our new post
    existingPosts[demoId] = newPost;
    
    // Save all posts back to file
    saveDemoPostsToFile(existingPosts);
    
    console.log(`[createPost] Current dynamic posts: ${Object.keys(dynamicDemoPosts).join(', ')}`);
    console.log(`[createPost] Post stored successfully: ${!!dynamicDemoPosts[demoId]}`);

    return newPost;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data[0] as BlogPost;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

export async function updatePost(id: string, post: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) {
  // If Supabase is not configured, update demo post
  if (!hasSupabaseConfig) {
    // First check our in-memory cache
    let existingPost = id.startsWith('demo-') ? dynamicDemoPosts[id] : null;
    
    // If not found in memory, try to load from file
    if (!existingPost) {
      const savedPosts = loadDemoPostsFromFile();
      existingPost = savedPosts[id];
    }

    if (existingPost) {
      // Update the existing post
      const updatedPost = {
        ...existingPost,
        ...post,
        updated_at: new Date().toISOString(),
      };

      // Store the updated post in memory
      dynamicDemoPosts[id] = updatedPost;
      
      // Load all posts from file
      const allPosts = loadDemoPostsFromFile();
      
      // Update this post
      allPosts[id] = updatedPost;
      
      // Save all posts back to file
      saveDemoPostsToFile(allPosts);

      return updatedPost;
    } else {
      // For demo posts we don't have, create a mock response
      const mockPost = {
        id,
        ...post,
        title: post.title || 'Updated Demo Post',
        content: post.content || 'Updated content',
        meta_description: post.meta_description || 'Updated meta description',
        target_keyword: post.target_keyword || 'demo',
        word_count: post.word_count || 500,
        post_type: post.post_type || 'informational',
        tone: post.tone || 'professional',
        audience: post.audience || 'general',
        language: post.language || 'English',
        first_person: post.first_person !== undefined ? post.first_person : false,
        stories_examples: post.stories_examples !== undefined ? post.stories_examples : false,
        hook: post.hook !== undefined ? post.hook : false,
        interactive_element: post.interactive_element !== undefined ? post.interactive_element : false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as BlogPost;

      // Store it in memory
      dynamicDemoPosts[id] = mockPost;
      
      // Load all posts from file
      const allPosts = loadDemoPostsFromFile();
      
      // Add this post
      allPosts[id] = mockPost;
      
      // Save all posts back to file
      saveDemoPostsToFile(allPosts);

      return mockPost;
    }
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data[0] as BlogPost;
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

export async function deletePost(id: string) {
  // If Supabase is not configured, delete demo post
  if (!hasSupabaseConfig) {
    // Remove from memory if it exists
    if (id.startsWith('demo-') && dynamicDemoPosts[id]) {
      delete dynamicDemoPosts[id];
    }
    
    // Load all posts from file
    const allPosts = loadDemoPostsFromFile();
    
    // Remove this post if it exists
    if (allPosts[id]) {
      delete allPosts[id];
      
      // Save the updated posts back to file
      saveDemoPostsToFile(allPosts);
    }
    
    return true;
  }

  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}
