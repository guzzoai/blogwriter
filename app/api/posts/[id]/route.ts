import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost, hasSupabaseConfig } from '@/lib/db';

// Demo posts for when Supabase is not configured
const demoPosts = [
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
    created_at: '2025-03-15T10:30:00Z',
    updated_at: '2025-03-15T10:30:00Z',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // If Supabase is not configured, return demo data
  if (!hasSupabaseConfig) {
    // Check if the ID starts with 'demo-'
    if (params.id.startsWith('demo-')) {
      const demoPost = demoPosts.find(post => post.id === params.id);

      if (demoPost) {
        return NextResponse.json({ post: demoPost });
      }
    }

    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  // If Supabase is configured, fetch real data
  try {
    const post = await getPostById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // If Supabase is not configured, handle demo data
  if (!hasSupabaseConfig) {
    // Check if the ID starts with 'demo-'
    if (params.id.startsWith('demo-')) {
      try {
        const body = await request.json();
        const demoPostIndex = demoPosts.findIndex(post => post.id === params.id);

        if (demoPostIndex !== -1) {
          // Update the demo post in memory (this won't persist between requests)
          const updatedPost = {
            ...demoPosts[demoPostIndex],
            ...body,
            updated_at: new Date().toISOString()
          };

          return NextResponse.json({
            post: updatedPost,
            message: 'Post updated in demo mode (changes won\'t persist)'
          });
        }
      } catch (error) {
        console.error('Error updating demo post:', error);
      }
    }

    return NextResponse.json(
      { error: 'Post not found or update failed' },
      { status: 404 }
    );
  }

  // If Supabase is configured, update real data
  try {
    const body = await request.json();
    const post = await updatePost(params.id, body);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // If Supabase is not configured, handle demo data
  if (!hasSupabaseConfig) {
    // Check if the ID starts with 'demo-'
    if (params.id.startsWith('demo-')) {
      return NextResponse.json({
        success: true,
        message: 'Post deleted in demo mode (no actual deletion occurred)'
      });
    }

    return NextResponse.json(
      { error: 'Post not found or delete failed' },
      { status: 404 }
    );
  }

  // If Supabase is configured, delete real data
  try {
    const success = await deletePost(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Post not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
