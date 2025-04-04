import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost, BlogPost, hasSupabaseConfig } from '@/lib/db';

export async function GET() {
  // If Supabase is not configured, return demo data
  if (!hasSupabaseConfig) {
    // Start with our predefined demo posts
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

    // Get any dynamically generated posts from the getAllPosts function
    const allPosts = await getAllPosts();
    console.log('Posts for dashboard:', allPosts.length, allPosts.map(p => p.id));

    return NextResponse.json({
      posts: allPosts
    });
  }

  // If Supabase is configured, fetch real data
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.target_keyword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const post = await createPost({
      title: body.title,
      content: body.content,
      meta_description: body.meta_description,
      target_keyword: body.target_keyword,
      word_count: body.word_count || 0,
      post_type: body.post_type || 'informational',
      tone: body.tone || 'professional',
      audience: body.audience || 'general readers',
      language: body.language || 'English',
      first_person: body.first_person || false,
      stories_examples: body.stories_examples || false,
      hook: body.hook || false,
      interactive_element: body.interactive_element || false,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
