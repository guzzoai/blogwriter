import PostList from '@/components/PostList';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog Post Dashboard</h1>
        <p className="text-gray-600">
          Manage your generated blog posts. View, edit, export, or delete your content.
        </p>
      </div>
      
      <PostList />
    </div>
  );
}
