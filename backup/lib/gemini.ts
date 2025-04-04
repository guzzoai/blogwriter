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
  faq: boolean;
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

  if (params.faq) {
    content += "\n\n## Frequently Asked Questions (FAQ)\n\n";
    content += "### What is the best " + params.topic + " for beginners?\n";
    content += "For beginners, we recommend [Product A] because it offers an intuitive interface, reliable performance, and excellent value for money. It has all the essential features without overwhelming new users.\n\n";
    
    content += "### How much should I expect to spend on a quality " + params.topic + "?\n";
    content += "Quality " + params.topic + "s typically range from $50-$500, depending on features and brand. For most users, the sweet spot is around $150-$250, which offers a good balance of quality and affordability.\n\n";
    
    content += "### Are expensive " + params.topic + "s worth the investment?\n";
    content += "Expensive " + params.topic + "s often include premium materials, extended warranties, and advanced features. Whether they're worth it depends on your specific needs. For professionals or heavy users, the investment may pay off in longevity and performance.\n\n";
    
    content += "### How often should I replace my " + params.topic + "?\n";
    content += "Most quality " + params.topic + "s should last 3-5 years with proper care. High-end models may last even longer. Consider replacing when performance significantly declines or repair costs exceed 50% of a new purchase.\n\n";
    
    content += "### What are the most important features to look for?\n";
    content += "The most important features depend on your specific needs, but generally look for durability, reliability, warranty coverage, customer support, and compatibility with your existing setup. For " + params.topic + "s, also consider [specific relevant features].\n";
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
   - Include the primary keyword "${params.targetKeyword}" near the beginning of the title.
   - Keep the title under 60 characters.
   - Make the title compelling and click-worthy.

2. Meta Description:
   - Include the primary keyword naturally.
   - Keep it between 120-155 characters.
   - Make it compelling and summarize the content.

3. Content Structure:
   - Use proper heading hierarchy (H1, H2, H3, H4) with keywords in headings.
   - IMPORTANT: Use proper Markdown syntax for headings:
     - # for H1 (main title only)
     - ## for H2 (main sections)
     - ### for H3 (subsections)
     - #### for H4 (minor sections)
   - Never write headings as plain text like "H3: Title" - always use proper Markdown format "### Title"
   - Include the primary keyword in at least one H2 heading.
   - Use bullet points and numbered lists where appropriate.
   - Keep paragraphs short (3-4 sentences maximum).
   - Bold important points and keywords.

4. Keyword Usage:
   - Primary keyword: "${params.targetKeyword}" - include 3-5 times naturally.
   - Use semantic variations and related terms.
   - Avoid keyword stuffing.

# Content Requirements:
- Create valuable, informative content that helps the reader.
- Include practical advice, tips, or recommendations.
- Back claims with facts where possible.
- Address common questions or concerns the audience might have.
`;

  // Add type-specific prompt
  let typeSpecificPrompt = '';
  switch (params.type) {
    case 'listicle':
      typeSpecificPrompt = `
# Additional Elements to Include:
- Include real-world examples or case studies that illustrate the benefits or applications of ${params.topic}. These stories should make the content more relatable and persuasive.
`;
      break;

    case 'how-to guide':
      typeSpecificPrompt = `
# Additional Elements to Include:
- Include real-world examples or case studies that illustrate the benefits or applications of ${params.topic}. These stories should make the content more relatable and persuasive.
`;
      break;

    case 'anecdote':
      typeSpecificPrompt = `
# Additional Elements to Include:
- Include real-world examples or case studies that illustrate the benefits or applications of ${params.topic}. These stories should make the content more relatable and persuasive.
`;
      break;

    case 'story':
      typeSpecificPrompt = `
# Additional Elements to Include:
- Include real-world examples or case studies that illustrate the benefits or applications of ${params.topic}. These stories should make the content more relatable and persuasive.
`;
      break;

    default: // informational
      typeSpecificPrompt = `
# Additional Elements to Include:
- Include real-world examples or case studies that illustrate the benefits or applications of ${params.topic}. These stories should make the content more relatable and persuasive.
`;
      break;
  }

  // Output format instructions
  const outputInstructions = `
# Output Format Instructions:
1. Start with "# [Your Title]" for the main blog post title (H1).
2. After the title, include "Meta Description: [your meta description]" 
3. Then proceed with the blog post structure, using proper markdown heading levels.
4. Include 2-4 sections with H2 headings (## Heading).
5. Use H3 headings (### Heading) and H4 headings (#### Heading) for subsections as appropriate.
6. Include a conclusion section.
7. Format the article with proper markdown, including bold, bullet points, and numbered lists where appropriate.
8. Format any product recommendations with clear headings, brief descriptions, and placeholder links.
`;

  return basePrompt + typeSpecificPrompt + outputInstructions;
}
