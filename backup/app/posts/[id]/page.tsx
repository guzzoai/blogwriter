import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';
import { getPostById, hasSupabaseConfig, dynamicDemoPosts, getAllPosts, PREDEFINED_DEMO_POSTS } from '@/lib/db';
import PostPreview from '@/components/PostPreview';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage(props: PostPageProps) {
  // Extract the ID safely - use a type assertion instead of toString()
  const id = props.params.id as string;
  console.log(`[PostPage] Attempting to load post with ID: ${id}`);
  
  // Get all available posts for debugging
  const allPosts = await getAllPosts();
  console.log(`[PostPage] All available posts: ${allPosts.map(p => p.id).join(', ')}`);
  
  // Check dynamicDemoPosts directly
  console.log(`[PostPage] Dynamic demo posts from import: ${Object.keys(dynamicDemoPosts).join(', ')}`);
  
  let post;

  // If Supabase is not configured, use demo data
  if (!hasSupabaseConfig) {
    // First try to get it directly from the API (which will check file storage)
    post = await getPostById(id);
    console.log(`[PostPage] Result from getPostById: ${post ? 'Found' : 'Not found'}`);

    // If not found, check predefined demos as a fallback
    if (!post && id.startsWith('demo-')) {
      post = PREDEFINED_DEMO_POSTS.find(p => p.id === id);
      console.log(`[PostPage] Result from predefined demos: ${post ? 'Found' : 'Not found'}`);
      
      // If still not found, check if it matches one of the local posts
      if (!post) {
        post = allPosts.find(p => p.id === id);
        console.log(`[PostPage] Result from allPosts: ${post ? 'Found' : 'Not found'}`);
      }
    }
  } else {
    // If Supabase is configured, fetch real data
    post = await getPostById(id);
  }

  if (!post) {
    console.error(`[PostPage] Post with ID ${id} not found - Redirecting to not found page`);
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Link>

        <Link
          href={`/posts/${id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Edit className="mr-2 h-5 w-5" />
          Edit Post
        </Link>
      </div>

      <PostPreview post={post} />
    </div>
  );
}
