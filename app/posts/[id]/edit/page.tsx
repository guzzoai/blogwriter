import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { getPostById, hasSupabaseConfig } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

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

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage(props: EditPostPageProps) {
  // Extract the ID safely - use a type assertion instead of toString()
  const id = props.params.id as string;
  let post;

  // If Supabase is not configured, use demo data
  if (!hasSupabaseConfig) {
    if (id.startsWith('demo-')) {
      // First try to get it from the API (in-memory storage)
      post = await getPostById(id);

      // If not found in in-memory storage, check predefined demos
      if (!post) {
        post = demoPosts.find(p => p.id === id);
      }
    }
  } else {
    // If Supabase is configured, fetch real data
    post = await getPostById(id);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Link>
          
          <Link
            href={`/posts/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Eye className="mr-2 h-5 w-5" />
            View Post
          </Link>
        </div>

        <h1 className="text-3xl font-bold mt-4 mb-2">Edit Blog Post</h1>
        <p className="text-gray-600">
          Make changes to your blog post content and metadata.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <PostEditor post={post} />
      </div>
    </div>
  );
}
