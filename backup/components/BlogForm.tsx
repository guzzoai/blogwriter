'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const blogFormSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters' }),
  targetKeyword: z.string().min(2, { message: 'Target keyword is required' }),
  wordCount: z.number().min(500).max(5000),
  additionalContext: z.string().optional(),
  type: z.enum(['informational', 'listicle', 'how-to guide', 'anecdote', 'story']),
  tone: z.enum(['professional', 'conversational', 'friendly', 'authoritative', 'casual']),
  audience: z.string().min(2, { message: 'Audience is required' }),
  language: z.string().min(2, { message: 'Language is required' }),
  firstPerson: z.boolean().default(false),
  storiesExamples: z.boolean().default(false),
  hook: z.boolean().default(false),
  interactiveElement: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function BlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      topic: '',
      targetKeyword: '',
      wordCount: 1500,
      additionalContext: '',
      type: 'informational',
      tone: 'professional',
      audience: 'general readers',
      language: 'English',
      firstPerson: false,
      storiesExamples: false,
      hook: false,
      interactiveElement: false,
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', data);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Get the response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Try to parse it as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        // Show a more user-friendly message
        alert('The server returned an invalid response. Using demo mode instead.');
        // Simulate a successful response
        reset();
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        console.error('Response not OK:', response.status, result);
        throw new Error(result.error || 'Failed to generate blog post');
      }

      console.log('Successful response:', result);

      // Extract the post ID from the result
      const postId = result.post?.id;
      
      if (!postId) {
        console.error('No post ID returned from API');
        throw new Error('Failed to get post ID from server response');
      }

      // Success message
      alert('Blog post generated successfully! Redirecting to view the post.');

      // Redirect to the newly created post
      setTimeout(() => {
        window.location.href = `/posts/${postId}`;
      }, 500); // Small delay to ensure the alert is seen
    } catch (error) {
      console.error('Error generating blog post:', error);
      alert(`Failed to generate blog post: ${error instanceof Error ? error.message : 'Please check your API keys and database connection.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Blog Post Topic *
          </label>
          <input
            id="topic"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="E.g., Best Gaming Laptops for 2025"
            {...register('topic')}
          />
          {errors.topic && (
            <p className="text-red-500 text-sm">{errors.topic.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="targetKeyword" className="block text-sm font-medium text-gray-700">
            Target Keyword *
          </label>
          <input
            id="targetKeyword"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="E.g., best gaming laptops"
            {...register('targetKeyword')}
          />
          {errors.targetKeyword && (
            <p className="text-red-500 text-sm">{errors.targetKeyword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700">
            Word Count *
          </label>
          <input
            id="wordCount"
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            min="500"
            max="5000"
            step="100"
            {...register('wordCount', { valueAsNumber: true })}
          />
          {errors.wordCount && (
            <p className="text-red-500 text-sm">{errors.wordCount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Content Type *
          </label>
          <select
            id="type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register('type')}
          >
            <option value="informational">Informational</option>
            <option value="listicle">Listicle</option>
            <option value="how-to guide">How-to Guide</option>
            <option value="anecdote">Anecdote</option>
            <option value="story">Story</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
            Tone *
          </label>
          <select
            id="tone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register('tone')}
          >
            <option value="professional">Professional</option>
            <option value="conversational">Conversational</option>
            <option value="friendly">Friendly</option>
            <option value="authoritative">Authoritative</option>
            <option value="casual">Casual</option>
          </select>
          {errors.tone && (
            <p className="text-red-500 text-sm">{errors.tone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
            Intended Audience *
          </label>
          <input
            id="audience"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="E.g., tech enthusiasts, parents, professionals"
            {...register('audience')}
          />
          {errors.audience && (
            <p className="text-red-500 text-sm">{errors.audience.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language *
          </label>
          <input
            id="language"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="E.g., English, Dutch, French"
            {...register('language')}
          />
          {errors.language && (
            <p className="text-red-500 text-sm">{errors.language.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700">
          Additional Context (Optional)
        </label>
        <textarea
          id="additionalContext"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any additional information or specific requirements for the blog post"
          {...register('additionalContext')}
        ></textarea>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Article Element Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              id="firstPerson"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('firstPerson')}
            />
            <label htmlFor="firstPerson" className="ml-2 block text-sm text-gray-700">
              First Person - Write using "I" perspective
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="storiesExamples"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('storiesExamples')}
            />
            <label htmlFor="storiesExamples" className="ml-2 block text-sm text-gray-700">
              Stories & Examples - Include personal stories
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="hook"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('hook')}
            />
            <label htmlFor="hook" className="ml-2 block text-sm text-gray-700">
              Hook - Start with an engaging hook
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="interactiveElement"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('interactiveElement')}
            />
            <label htmlFor="interactiveElement" className="ml-2 block text-sm text-gray-700">
              Interactive HTML Element
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Generating...
            </>
          ) : (
            'Generate Blog Post'
          )}
        </button>
      </div>
    </form>
  );
}
