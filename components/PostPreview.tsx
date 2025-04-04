'use client';

import ReactMarkdown from 'react-markdown';
import { BlogPost } from '@/lib/db';

interface PostPreviewProps {
  post: BlogPost;
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 italic mb-4">
          Meta Description: {post.meta_description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {post.target_keyword}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {post.post_type}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {post.tone}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {post.word_count} words
          </span>
        </div>
      </div>

      <div className="prose max-w-none">
        {/* Render the content as markdown */}
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
