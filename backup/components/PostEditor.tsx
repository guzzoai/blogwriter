'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/db';
import { Loader2 } from 'lucide-react';

interface PostEditorProps {
  post: BlogPost;
}

export default function PostEditor({ post }: PostEditorProps) {
  const [content, setContent] = useState(post.content);
  const [title, setTitle] = useState(post.title);
  const [metaDescription, setMetaDescription] = useState(post.meta_description);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Check if this is a demo post
      const isDemoPost = post.id.toString().startsWith('demo-');

      if (isDemoPost) {
        // For demo posts, just show a success message without actually saving
        setTimeout(() => {
          alert('Post updated successfully in demo mode (changes won\'t persist between page refreshes)');
          router.refresh();
        }, 1000);
      } else {
        // For real posts, save to the database
        const response = await fetch(`/api/posts/${post.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            meta_description: metaDescription,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to update post');
        }

        router.refresh();
        alert('Post updated successfully');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert(`Failed to update post: ${error instanceof Error ? error.message : 'Please check your database connection.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description
          </label>
          <input
            id="metaDescription"
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {metaDescription.length}/160 characters
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
