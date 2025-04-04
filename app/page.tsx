import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">SEO Affiliate Blog Generator</h1>
        <p className="text-xl text-gray-600 mb-8">
          Generate high-quality, SEO-optimized blog posts for affiliate marketing using Google Gemini 2.5 Pro.
        </p>
        <div className="flex gap-4">
          <Link
            href="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
          >
            Create New Blog Post
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">SEO Optimization</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Optimized title tags with keywords
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Strategic heading structure (H1-H4)
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Proper keyword density and placement
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Schema markup for better visibility
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Affiliate Integration</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Strategic affiliate link placement
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Optimized call-to-action buttons
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Price comparisons and product highlights
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Conversion-focused content structure
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <ol className="space-y-4">
          <li className="flex">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <div>
              <h3 className="font-medium">Enter Your Parameters</h3>
              <p className="text-gray-600">Specify your topic, target keyword, and content preferences.</p>
            </div>
          </li>
          <li className="flex">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <div>
              <h3 className="font-medium">Generate Content</h3>
              <p className="text-gray-600">Our AI creates a fully optimized blog post based on your inputs.</p>
            </div>
          </li>
          <li className="flex">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <div>
              <h3 className="font-medium">Review and Edit</h3>
              <p className="text-gray-600">Preview the content, make any necessary edits, and export.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
