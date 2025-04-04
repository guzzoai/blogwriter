import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, BlogGenerationParams, hasApiKey } from '@/lib/gemini';
import { createPost, hasSupabaseConfig } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.topic || !body.targetKeyword || !body.wordCount || !body.type || !body.tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate blog post
    const params: BlogGenerationParams = {
      topic: body.topic,
      targetKeyword: body.targetKeyword,
      wordCount: body.wordCount,
      additionalContext: body.additionalContext || '',
      type: body.type,
      tone: body.tone,
      audience: body.audience || 'general readers',
      language: body.language || 'English',
      firstPerson: body.firstPerson || false,
      storiesExamples: body.storiesExamples || false,
      hook: body.hook || false,
      interactiveElement: body.interactiveElement || false,
      faq: body.faq || false,
    };

    // Generate content - this will return demo content if API key is missing or invalid
    console.log('Generating blog post with params:', params);
    const generatedContent = await generateBlogPost(params);

    // If we don't have Supabase configured, save to our file-based storage
    if (!hasSupabaseConfig) {
      console.log('Supabase not configured, creating demo post with generated content');
      
      // Create a unique ID for this post
      const uniqueId = `demo-${Date.now()}`;
      
      const demoPost = {
        id: uniqueId,
        title: generatedContent.title,
        content: generatedContent.content,
        meta_description: generatedContent.metaDescription,
        target_keyword: params.targetKeyword,
        word_count: params.wordCount,
        post_type: params.type,
        tone: params.tone,
        audience: params.audience,
        language: params.language,
        first_person: params.firstPerson,
        stories_examples: params.storiesExamples,
        hook: params.hook,
        interactive_element: params.interactiveElement,
        faq: params.faq,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Create the post in our file-based storage
      const savedPost = await createPost(demoPost);
      
      if (!savedPost) {
        console.error('Failed to create demo post in file storage');
        return NextResponse.json({ 
          error: 'Failed to save generated content to file storage',
          generatedContent 
        }, { status: 500 });
      }
      
      console.log(`Demo post created with ID: ${savedPost.id}, Title: ${savedPost.title}`);

      return NextResponse.json({
        message: 'Blog post generated successfully in demo mode',
        post: savedPost
      }, { status: 201 });
    }

    // Save to database if Supabase is configured
    try {
      const post = await createPost({
        title: generatedContent.title,
        content: generatedContent.content,
        meta_description: generatedContent.metaDescription,
        target_keyword: params.targetKeyword,
        word_count: params.wordCount,
        post_type: params.type,
        tone: params.tone,
        audience: params.audience,
        language: params.language,
        first_person: params.firstPerson,
        stories_examples: params.storiesExamples,
        hook: params.hook,
        interactive_element: params.interactiveElement,
        faq: params.faq,
      });

      return NextResponse.json({ 
        message: 'Blog post generated and saved successfully',
        post 
      }, { status: 201 });
    } catch (error) {
      console.error('Error saving post to database:', error);
      return NextResponse.json(
        { error: 'Generated blog post but failed to save to database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
