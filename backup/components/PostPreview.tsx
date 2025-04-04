'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '@/lib/db';

interface PostPreviewProps {
  post: BlogPost;
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">{post.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 italic mb-4">
          Meta Description: {post.meta_description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm">
            {post.target_keyword}
          </span>
          <span className="px-3 py-1 bg-[#8cbe65] dark:bg-[#44a340] text-white rounded-full text-sm">
            {post.post_type}
          </span>
          <span className="px-3 py-1 bg-[#8cbe65] dark:bg-[#44a340] text-white rounded-full text-sm">
            {post.tone}
          </span>
          <span className="px-3 py-1 bg-[#8cbe65] dark:bg-[#44a340] text-white rounded-full text-sm">
            {post.word_count} words
          </span>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {/* Render the content as markdown with HTML support */}
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
