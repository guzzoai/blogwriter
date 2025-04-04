import BlogForm from '@/components/BlogForm';

export default function CreatePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Blog Post</h1>
        <p className="text-gray-600">
          Fill out the form below to generate a high-quality, SEO-optimized blog post for affiliate marketing.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <BlogForm />
      </div>
    </div>
  );
}
