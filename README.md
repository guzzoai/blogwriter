# SEO Affiliate Blog Generator

A web application that generates high-quality SEO-optimized blog posts for affiliate marketing using Google Gemini 2.5 Pro.

## Features

- Generate SEO-optimized blog posts with a single click
- Customize content type, tone, and audience
- Add optional elements like hooks, stories, and interactive elements
- Store and manage generated blog posts
- Edit and preview content with markdown support
- Export posts in HTML or Markdown format

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Pro API
- **Authentication**: Supabase Auth (optional)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Gemini API key
- Supabase account and project

### Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in your API keys:

```
# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

Create a `blog_posts` table in your Supabase project with the following schema:

```sql
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  meta_description text not null,
  target_keyword text not null,
  word_count integer not null,
  post_type text not null,
  tone text not null,
  audience text not null,
  language text not null,
  first_person boolean default false,
  stories_examples boolean default false,
  hook boolean default false,
  interactive_element boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Navigate to the "Create Blog Post" page
2. Fill out the form with your desired parameters
3. Click "Generate Blog Post"
4. View, edit, or export your generated content

## License

MIT
