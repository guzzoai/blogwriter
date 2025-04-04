import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if we have the Gemini API key
const hasApiKey =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'your-gemini-api-key';

// Initialize the Google Generative AI with the API key if available
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Generation config based on the provided example
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192, // Reduced from 65536 to be more reasonable for blog posts
  responseMimeType: "text/plain",
};

if (hasApiKey) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    // Use the correct model name from the example
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
    });
    console.log('Successfully initialized Gemini 2.5 Pro model');
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    genAI = null;
    model = null;
  }
}

export { hasApiKey, generationConfig };

export interface BlogGenerationParams {
  topic: string;
  targetKeyword: string;
  wordCount: number;
  additionalContext?: string;
  type: 'informational' | 'listicle' | 'how-to guide' | 'anecdote' | 'story';
  tone: 'professional' | 'conversational' | 'friendly' | 'authoritative' | 'casual';
  audience: string;
  language: string;
  firstPerson: boolean;
  storiesExamples: boolean;
  hook: boolean;
  interactiveElement: boolean;
}

export async function generateBlogPost(params: BlogGenerationParams) {
  console.log('generateBlogPost called with params:', JSON.stringify(params));

  // If we don't have an API key or model, return demo content
  if (!hasApiKey || !model) {
    console.log('Using demo content generation (no API key or model available)');
    return generateDemoContent(params);
  }

  try {
    // Get the prompt template based on the blog type
    const promptTemplate = getPromptTemplate(params);
    console.log('Using prompt template:', promptTemplate.substring(0, 200) + '...');

    try {
      // Generate content using Gemini with the specified configuration
      console.log('Calling Gemini API with model:', model ? 'Available' : 'Not available');
      const result = await model.generateContent(promptTemplate, { generationConfig });
      const response = await result.response;
      const text = response.text();
      console.log('Received response from Gemini API, length:', text.length);

      // Extract title and meta description from the generated content
      const titleMatch = text.match(/# (.+)/);
      const title = titleMatch ? titleMatch[1] : 'Generated Blog Post';

      const metaDescriptionMatch = text.match(/Meta Description: (.+)/);
      const metaDescription = metaDescriptionMatch
        ? metaDescriptionMatch[1]
        : 'Generated blog post about ' + params.topic;

      console.log('Extracted title:', title);
      console.log('Extracted meta description:', metaDescription.substring(0, 100) + '...');

      return {
        title,
        content: text,
        metaDescription
      };
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      console.log('Falling back to demo content generation');
      // If the API call fails, fall back to demo content
      return generateDemoContent(params);
    }
  } catch (error) {
    console.error('Error in generateBlogPost:', error);
    // Always return demo content on any error
    return generateDemoContent(params);
  }
}

// Function to generate demo content when no API key is available
function generateDemoContent(params: BlogGenerationParams) {
  console.log('Generating demo content with params:', params);
  const currentYear = new Date().getFullYear();
  let title = '';
  let content = '';
  let metaDescription = '';

  // Generate different content based on the type
  switch (params.type) {
    case 'listicle':
      title = `Top 10 ${params.topic} for ${currentYear}`;
      metaDescription = `Discover the best ${params.topic} of ${currentYear} with our comprehensive guide targeting "${params.targetKeyword}". Find the perfect options for your needs and budget.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nFinding the right ${params.topic} can be overwhelming with so many options available. In this ${params.wordCount}-word guide written in a ${params.tone} tone for ${params.audience}, we've researched and tested the top contenders to bring you the absolute best choices for ${currentYear}.\n\n## 1. Premium Choice: [Product Name]\n\nIf you're looking for the best of the best, look no further than [Product Name]. This premium option offers exceptional quality and performance.\n\n### Key Features:\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n[View current price on Amazon](#)\n\n## 2. Best Value: [Product Name]\n\nFor those seeking the perfect balance between quality and price, [Product Name] offers outstanding value.\n\n### Key Features:\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n[View on Bol.com](#)\n\n## Conclusion\n\nWhether you're looking for premium quality or the best value, our list of the top ${params.topic} for ${currentYear} has something for everyone. Our top recommendation is [Product Name] for its exceptional balance of features, quality, and price.\n\n[Check availability](#)`;
      break;

    case 'how-to guide':
      title = `How to Choose the Perfect ${params.topic} in ${currentYear}`;
      metaDescription = `Learn how to select the ideal ${params.topic} with our step-by-step guide targeting "${params.targetKeyword}". Compare features, prices, and brands to make the best choice.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nChoosing the right ${params.topic} can significantly impact your experience. This ${params.wordCount}-word comprehensive guide written in a ${params.tone} tone for ${params.audience} will walk you through everything you need to know to make an informed decision.\n\n## Step 1: Determine Your Needs\n\nBefore you start shopping, take some time to consider what you'll be using your ${params.topic} for. Different models excel at different tasks.\n\n## Step 2: Set Your Budget\n\nQuality ${params.topic}s can range from budget-friendly to premium prices. Determine how much you're willing to spend before you start looking.\n\n## Step 3: Research Top Brands\n\nSome brands are known for their quality and reliability. Here's a comparison of the top brands:\n\n| Brand | Pros | Cons | Price Range |\n|-------|------|------|------------|\n| Brand A | High quality, durable | Expensive | $$$-$$$$ |\n| Brand B | Good value, reliable | Fewer features | $$-$$$ |\n| Brand C | Budget-friendly | Less durable | $-$$ |\n\n[View current prices](#)\n\n## Conclusion\n\nBy following these steps, you'll be well-equipped to choose the perfect ${params.topic} for your needs. Our top recommendation is [Product Name] for most users, offering the best balance of features and value.\n\n[Check availability](#)`;
      break;

    case 'anecdote':
      title = `My Experience with ${params.topic}: A Personal Story`;
      metaDescription = `Read about my personal journey with ${params.topic} targeting "${params.targetKeyword}". Learn from my experiences and discover top recommendations.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nI still remember the first time I encountered ${params.topic}. This ${params.wordCount}-word personal account written in a ${params.tone} tone for ${params.audience} shares my journey and what I've learned along the way.\n\n## My First Experience\n\nIt all started when I decided to try ${params.topic} for the first time. The experience was both challenging and rewarding, teaching me valuable lessons I still carry today.\n\n## What I've Learned\n\nThrough my journey with ${params.topic}, I've discovered several important insights:\n\n1. **Lesson One** - Always research before making decisions\n2. **Lesson Two** - Quality matters more than price in the long run\n3. **Lesson Three** - The community around ${params.topic} is incredibly supportive\n\n## Recommendations Based on Experience\n\nAfter years of experience, here are my top recommendations for ${params.topic}:\n\n### Best Overall: [Product Name]\n\nI've personally used this for over a year, and it has never disappointed me.\n\n[View current price](#)\n\n## Conclusion\n\nMy journey with ${params.topic} has been transformative. I hope my experiences help you make better decisions in your own journey.\n\n[Check availability](#)`;
      break;

    case 'story':
      title = `The Fascinating Story of ${params.topic} in ${currentYear}`;
      metaDescription = `Discover the captivating narrative of ${params.topic} targeting "${params.targetKeyword}". A story-driven guide with expert recommendations.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## The Beginning\n\nThis ${params.wordCount}-word narrative written in a ${params.tone} tone for ${params.audience} begins with how ${params.topic} first emerged and captured people's attention.\n\n## The Rise to Popularity\n\nLike all great stories, the tale of ${params.topic} includes challenges, breakthroughs, and unexpected turns. Its rise to popularity wasn't straightforward, but that's what makes it fascinating.\n\n## Key Characters in the Story\n\nEvery great story has its heroes and innovators. In the world of ${params.topic}, these are the brands and products that have made the biggest impact:\n\n1. **[Brand A]** - The pioneer that started it all\n2. **[Brand B]** - The innovator that revolutionized the industry\n3. **[Brand C]** - Today's market leader setting new standards\n\n## The Current Chapter\n\nToday, ${params.topic} continues to evolve. The latest developments include improved features, better performance, and more accessible pricing.\n\n### Our Protagonist: [Product Name]\n\nIn this story, our hero is [Product Name], which exemplifies everything great about ${params.topic}.\n\n[View current price](#)\n\n## The Conclusion (For Now)\n\nThe story of ${params.topic} is still being written. By choosing the right products, you can be part of this ongoing narrative.\n\n[Join the story](#)`;
      break;

    default: // informational
      title = `Complete Guide to ${params.topic} in ${currentYear}`;
      metaDescription = `Everything you need to know about ${params.topic} targeting "${params.targetKeyword}" in ${currentYear}. Expert advice, tips, and recommendations for ${params.audience}.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\n${params.topic} has become increasingly popular in recent years, and for good reason. In this ${params.wordCount}-word comprehensive guide written in a ${params.tone} tone for ${params.audience}, we'll cover everything you need to know, whether you're a complete beginner or looking to deepen your knowledge.\n\n## What to Look For\n\nWhen exploring ${params.topic}, there are several key factors to consider:\n\n1. **Quality** - How well it's made and how long it will last\n2. **Features** - What capabilities it offers\n3. **Price** - Whether it provides good value for money\n4. **Reviews** - What other users are saying\n\n## Top Recommendations\n\nBased on our extensive research and testing, here are our top recommendations for ${currentYear}:\n\n### Best Overall: [Product Name]\n\nThis option stands out for its exceptional quality and value. It offers all the essential features most users need.\n\n[View current price](#)\n\n### Premium Choice: [Product Name]\n\nIf budget isn't a concern and you want the absolute best, this premium option delivers outstanding performance.\n\n[View on Amazon](#)\n\n## Conclusion\n\nWhether you're just getting started with ${params.topic} or looking to upgrade, we hope this guide has provided valuable insights. Our top recommendation for most users is [Product Name], which offers the best balance of quality, features, and price.\n\n[Check availability](#)`;
      break;
  }

  // Add optional elements if requested
  if (params.firstPerson) {
    content = content.replace(/we've/g, "I've").replace(/we'll/g, "I'll").replace(/our/g, "my");
  }

  if (params.hook) {
    content = content.replace(/## Introduction/, "## Introduction\n\n**Attention!** Did you know that choosing the right ${params.topic} can save you hundreds of dollars and countless hours of frustration? This guide will ensure you make the perfect choice.\n");
  }

  if (params.storiesExamples) {
    content += "\n\n## Real-World Example\n\nJohn, a ${params.audience} from Amsterdam, was struggling with finding the right ${params.topic}. After following our advice, he found the perfect solution that matched his needs and budget. 'I couldn't be happier with my choice,' he says.\n";
  }

  if (params.interactiveElement) {
    content += "\n\n## Interactive Comparison Tool\n\n<div class='interactive-tool'>\n  <h3>Compare Your Options</h3>\n  <p>Use this interactive tool to compare different ${params.topic} options based on your specific needs.</p>\n  <div class='tool-placeholder'>[Interactive comparison tool would be rendered here]</div>\n</div>\n";
  }

  return {
    title,
    content,
    metaDescription
  };
}

function getPromptTemplate(params: BlogGenerationParams): string {
  // Base prompt with SEO and affiliate requirements
  const basePrompt = `
You are an expert SEO content writer specializing in affiliate marketing.
Create a high-quality, SEO-optimized blog post about "${params.topic}" targeting the keyword "${params.targetKeyword}".

The blog post should be approximately ${params.wordCount} words and written in a ${params.tone} tone for ${params.audience} in ${params.language}.

# On-Page SEO Requirements:
1. Title Tag:
   - Must contain the main keyword "${params.targetKeyword}"
   - Between 50-60 characters
   - Include the year (2025)
   - Include attractive adjectives

2. Meta Description:
   - Must contain the main keyword and related terms
   - Between 140-160 characters
   - Include a call to action

3. Heading Structure:
   - H1: Contains the main keyword (only one H1)
   - H2: Contains secondary keywords related to "${params.targetKeyword}"
   - H3-H4: Contains long-tail keywords related to "${params.targetKeyword}"

4. Content:
   - Include the main keyword within the first 100 words
   - Maintain natural keyword density (2-3%)
   - Use synonyms and related terms
   - Create scannable content with bullets and lists
   - Include comparison tables with specifications where relevant
   - Include pros and cons lists where relevant

5. Schema Markup:
   - Include appropriate schema markup (product, FAQ, or review schema as relevant)

# Affiliate Marketing Requirements:
1. Include strategic affiliate link placements:
   - After positive reviews
   - In comparison tables next to prices
   - At the end of sections with a "View Price" CTA
   - In the conclusion with recommendations

2. Use optimized CTA texts like:
   - "View current price"
   - "View on Bol.com"
   - "View deal"
   - "Check availability"

3. Include conversion optimization elements:
   - Price comparisons between different retailers
   - Highlight special offers and discounts
   - Use badges like "Best Choice", "Best Value for Money"

${params.additionalContext ? `Additional Context: ${params.additionalContext}` : ''}
`;

  // Add type-specific instructions
  let typeSpecificPrompt = '';
  switch (params.type) {
    case 'informational':
      typeSpecificPrompt = `
Create an informational blog post that educates the reader about "${params.topic}".
Include comprehensive information, statistics, and expert insights.
Structure the content to answer common questions about the topic.
`;
      break;
    case 'listicle':
      typeSpecificPrompt = `
Create a listicle-style blog post with a numbered list of items related to "${params.topic}".
Each list item should have a descriptive heading and detailed explanation.
Include product recommendations with affiliate links where appropriate.
`;
      break;
    case 'how-to guide':
      typeSpecificPrompt = `
Create a step-by-step guide on how to "${params.topic}".
Each step should be clearly numbered and explained in detail.
Include tips, warnings, and product recommendations where relevant.
`;
      break;
    case 'anecdote':
      typeSpecificPrompt = `
Create a blog post that uses anecdotes and personal experiences related to "${params.topic}".
The anecdotes should support the main points and make the content more relatable.
Still include factual information and product recommendations.
`;
      break;
    case 'story':
      typeSpecificPrompt = `
Create a narrative-style blog post that tells a story related to "${params.topic}".
The story should be engaging and lead naturally to product recommendations.
Include a clear beginning, middle, and end to the narrative.
`;
      break;
  }

  // Add optional elements
  let optionalElements = '';
  if (params.firstPerson) {
    optionalElements += `
Write the blog post in first person using "I" perspective to create a personal connection with the reader.
`;
  }
  if (params.storiesExamples) {
    optionalElements += `
Include personal stories or relevant examples throughout the blog post to make it more engaging and relatable.
`;
  }
  if (params.hook) {
    optionalElements += `
Start with an engaging hook that immediately captures the reader's attention and makes them want to continue reading.
`;
  }
  if (params.interactiveElement) {
    optionalElements += `
Include an interactive HTML element such as a quiz, calculator, or interactive comparison table related to "${params.topic}".
`;
  }

  // Final output format instructions
  const outputInstructions = `
# Output Format:
1. Start with the blog post title as an H1 heading (using a single # symbol)
2. On a new line, include "Meta Description: [your meta description here]"
3. Then provide the complete blog post content with proper HTML formatting
4. Use markdown formatting for headings, lists, and emphasis
5. Include appropriate schema markup in JSON-LD format at the end

Now, create the complete blog post based on these requirements.
`;

  return basePrompt + typeSpecificPrompt + optionalElements + outputInstructions;
}
