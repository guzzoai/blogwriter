import BlogForm from '@/components/BlogForm';

export default function CreatePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Blog Post</h1>
        <p>
          Fill out the form below to generate a high-quality, SEO-optimized blog post for affiliate marketing.
        </p>
      </div>
      
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-bg)' }}>
        <BlogForm />
      </div>
    </div>
  );
}
