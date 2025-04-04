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

      // Extract interactive element if applicable
      let interactiveElementCode = undefined;
      let cleanedContent = text;
      
      if (params.interactiveElement) {
        // Look for HTML code blocks that might contain interactive elements
        const interactiveElementRegex = /<div[\s\S]*?class=["'].*?interactive.*?["'][\s\S]*?<\/div>(?:\s*<script[\s\S]*?<\/script>)?/gi;
        const matches = text.match(interactiveElementRegex);
        
        if (matches && matches.length > 0) {
          interactiveElementCode = matches[0];
          // Replace the interactive element in the content with a placeholder
          cleanedContent = text.replace(interactiveElementRegex, 
            '> **Interactive Element:** *The interactive comparison tool code is available in the "Interactive Element Code" section below.*');
          console.log('Extracted interactive element code, length:', interactiveElementCode.length);
        } else {
          // If no specific interactive element is found, look for any script tags or HTML elements
          const scriptRegex = /<script[\s\S]*?<\/script>/gi;
          const scriptMatches = text.match(scriptRegex);
          
          if (scriptMatches && scriptMatches.length > 0) {
            interactiveElementCode = scriptMatches.join('\n');
            // Replace the script tags in the content with a placeholder
            cleanedContent = text.replace(scriptRegex, 
              '> **Interactive Element:** *The interactive script code is available in the "Interactive Element Code" section below.*');
            console.log('Extracted script code, length:', interactiveElementCode.length);
          }
        }
      }

      return {
        title,
        content: cleanedContent,
        metaDescription,
        interactiveElementCode
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

  let title = '';
  let metaDescription = '';
  let content = '';
  let interactiveElementCode = undefined;

  switch (params.type) {
    case 'informational':
      title = `Everything You Need to Know About ${params.topic}`;
      metaDescription = `Learn all about ${params.topic} in this comprehensive guide targeting "${params.targetKeyword}". Get expert insights on features, benefits, and buying tips.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nWelcome to our ${params.wordCount}-word ${params.tone} guide on ${params.topic}, written specifically for ${params.audience}. This article will cover everything you need to know about ${params.topic}, from basic principles to expert tips.\n\n## What is ${params.topic}?\n\n${params.topic} is a subject of growing interest, especially for those looking to expand their knowledge in this area. Understanding the fundamentals is essential before diving deeper.\n\n## Key Benefits of ${params.topic}\n\n1. **Benefit One** - How it improves your life\n2. **Benefit Two** - Why it's worth the investment\n3. **Benefit Three** - What makes it special\n\n## How to Choose the Right ${params.topic}\n\nWhen selecting a ${params.topic}, consider these important factors:\n\n### Factor 1: Quality\n\nThe quality of your ${params.topic} will determine how long it lasts and how well it performs.\n\n### Factor 2: Price\n\nWhile it's tempting to go for the cheapest option, investing in a higher-quality ${params.topic} often saves money in the long run.\n\n### Factor 3: Features\n\nDifferent models offer various features. Prioritize those that align with your specific needs.\n\n## Top Recommendations\n\nBased on extensive research, here are our top picks for ${params.topic}:\n\n### Best Overall: [Product Name]\n\nThis option offers the perfect balance of quality, features, and price.\n\n[Check current price](#)\n\n### Budget-Friendly: [Product Name]\n\nIf you're looking for a more affordable option without sacrificing too much quality.\n\n[View details](#)\n\n### Premium Choice: [Product Name]\n\nFor those who want the absolute best and are willing to pay for premium features.\n\n[Learn more](#)\n\n## Conclusion\n\nChoosing the right ${params.topic} doesn't have to be overwhelming. By considering the factors we've discussed and focusing on your specific needs, you can make an informed decision that you'll be happy with for years to come.\n\n[Check availability](#)`;
      break;

    case 'listicle':
      title = `${params.topic.startsWith('Top') ? params.topic : `Top 10 ${params.topic} in ${new Date().getFullYear()}`}`;
      metaDescription = `Discover the best ${params.topic} with our carefully curated list targeting "${params.targetKeyword}". Compare features, prices, and find the perfect option for your needs.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nFinding the right ${params.topic} can be challenging with so many options available. In this ${params.wordCount}-word ${params.tone} article for ${params.audience}, we've researched and compiled the absolute best choices for every need and budget.\n\n## What to Look for in ${params.topic}\n\nBefore diving into our recommendations, here are the key factors we considered:\n\n* **Quality** - Durability and performance\n* **Value** - Price-to-performance ratio\n* **Features** - Important capabilities for different use cases\n* **User Feedback** - Real-world experiences from customers\n\n## The Top 10 ${params.topic}\n\n### 1. [Product Name] - Best Overall\n\n**Why we love it:** This outstanding option provides the perfect balance of quality, features, and affordability.\n\n**Key Specifications:**\n* Feature 1\n* Feature 2\n* Feature 3\n\n[Check current price](#)\n\n### 2. [Product Name] - Best Budget Option\n\n**Why we love it:** Get exceptional value without breaking the bank.\n\n**Key Specifications:**\n* Feature 1\n* Feature 2\n* Feature 3\n\n[View details](#)\n\n### 3. [Product Name] - Premium Choice\n\n**Why we love it:** When only the best will do, this premium option delivers unmatched performance.\n\n**Key Specifications:**\n* Feature 1\n* Feature 2\n* Feature 3\n\n[Learn more](#)\n\n[Entries 4-10 would continue in the same format]\n\n## Comparison Table\n\n| Product | Best For | Price Range |\n|---------|----------|-------------|\n| Product 1 | Overall Performance | $$$ |\n| Product 2 | Budget Buyers | $ |\n| Product 3 | Premium Features | $$$$ |\n\n## Conclusion\n\nWith so many great options for ${params.topic}, you're sure to find one that perfectly matches your needs from our curated list. Our top recommendation for most people remains [Product 1], but consider your specific requirements when making your choice.\n\n[Check availability](#)`;
      break;

    case 'how-to guide':
      title = `How to ${params.topic}: A Step-by-Step Guide`;
      metaDescription = `Learn how to ${params.topic} with our easy-to-follow guide targeting "${params.targetKeyword}". Step-by-step instructions, tips, and expert advice included.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nMastering how to ${params.topic} doesn't have to be difficult. This ${params.wordCount}-word ${params.tone} guide will walk ${params.audience} through the entire process, from preparation to finishing touches.\n\n## What You'll Need\n\nBefore getting started, gather these essential items:\n\n* Item 1\n* Item 2\n* Item 3\n* Item 4\n* Item 5\n\n## Preparation Steps\n\nProper preparation is key to success when learning how to ${params.topic}.\n\n### 1. Prepare Your Workspace\n\nEnsure you have adequate space and lighting for the task.\n\n### 2. Organize Your Materials\n\nHaving everything within reach will make the process smoother.\n\n## Step-by-Step Guide\n\nFollow these steps carefully to achieve the best results.\n\n### Step 1: Getting Started\n\nStart by [specific instructions for the first step]. This establishes the foundation for the entire process.\n\nPro tip: [Relevant advice for this step]\n\n### Step 2: The Main Process\n\nNext, [specific instructions for the second step]. Take your time with this step, as it's crucial for success.\n\nCommon mistake to avoid: [Typical error people make]\n\n### Step 3: Refining Your Work\n\nNow, [specific instructions for the third step]. This is where your project begins to take shape.\n\n### Step 4: Adding Finishing Touches\n\nFinally, [specific instructions for the last step]. These details will elevate your final result.\n\n## Troubleshooting Common Issues\n\nEven with careful execution, you might encounter these common problems:\n\n### Problem 1: [Common Issue]\n\nSolution: [How to fix it]\n\n### Problem 2: [Common Issue]\n\nSolution: [How to fix it]\n\n## Conclusion\n\nCongratulations! You now know how to ${params.topic}. With practice, you'll become more efficient and achieve even better results. Remember that mastery comes with experience, so don't be discouraged if your first attempt isn't perfect.\n\n## Recommended Tools and Resources\n\nTo further improve your skills, consider these tools:\n\n* [Tool/Resource 1](#) - Best for beginners\n* [Tool/Resource 2](#) - Professional-grade option\n* [Tool/Resource 3](#) - Helpful for advanced techniques`;
      break;

    case 'story':
      title = `The Journey of ${params.topic}: An Inspiring Story`;
      metaDescription = `Discover the remarkable story of ${params.topic} in this engaging narrative targeting "${params.targetKeyword}". Learn valuable lessons from this captivating journey.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nEvery great achievement begins with a simple step. This ${params.wordCount}-word ${params.tone} story about ${params.topic}, written specifically for ${params.audience}, will take you through an inspiring journey of challenges, growth, and ultimate triumph.\n\n## The Beginning\n\nIt all started on a seemingly ordinary day. [Character name], a [brief description], had always been fascinated by ${params.topic}, but never imagined becoming so deeply involved with it. The spark of interest began when [inciting incident that started the journey].\n\n## The Challenge\n\nAs with any meaningful pursuit, the path was not straightforward. Soon after embarking on this journey with ${params.topic}, [character name] encountered significant obstacles:\n\n* [Challenge 1] tested their determination\n* [Challenge 2] required developing new skills\n* [Challenge 3] pushed them to the brink of giving up\n\n## The Turning Point\n\nJust when things seemed most hopeless, a pivotal moment changed everything. [Description of the turning point that changed the trajectory of the story]. This moment taught [character name] that [important lesson learned].\n\n## Growth and Development\n\nWith renewed purpose, progress began to accelerate. Each day brought new discoveries about ${params.topic} and revealed untapped potential. The journey transformed from a mere interest into a passionate pursuit with clear direction.\n\nKey milestones along the way included:\n\n1. [First major achievement]\n2. [Second major achievement]\n3. [Third major achievement]\n\n## The Impact\n\nWhat started as one person's journey with ${params.topic} soon began affecting others. [Description of how this story and its subject began influencing a wider community or audience]. The ripple effects extended to [examples of broader impact].\n\n## Lessons Learned\n\nLooking back on this remarkable journey with ${params.topic}, several valuable lessons stand out:\n\n### Persistence Overcomes Obstacles\n\nThe path was never smooth, but consistently showing up and pushing forward eventually yielded results.  \n\n### Community Is Essential\n\nNo great achievement happens in isolation. The support and collaboration of [relevant community] proved invaluable.  \n\n### Purpose Drives Progress\n\nHaving a clear understanding of why ${params.topic} mattered created the motivation to continue through difficulties.\n\n## Conclusion\n\nThe story of ${params.topic} reminds us that extraordinary journeys often begin with ordinary curiosity. Whether you're just starting your own exploration of ${params.topic} or are well along your path, remember that each step, each challenge, and each victory contributes to a larger narrative worth sharing.\n\nAs [character name] discovered, the impact of pursuing ${params.topic} extends far beyond personal achievement—it creates ripples that can inspire and transform others.`;
      break;

    case 'anecdote':
      title = `My Experience with ${params.topic}: A Personal Story`;
      metaDescription = `Read about my personal journey with ${params.topic} targeting "${params.targetKeyword}". Learn from my experiences and discover top recommendations.`;
      content = `# ${title}\n\nMeta Description: ${metaDescription}\n\n## Introduction\n\nI still remember the first time I encountered ${params.topic}. This ${params.wordCount}-word personal account written in a ${params.tone} tone for ${params.audience} shares my journey and what I've learned along the way.\n\n## My First Experience\n\nIt all started when I decided to try ${params.topic} for the first time. The experience was both challenging and rewarding, teaching me valuable lessons I still carry today.\n\n## What I've Learned\n\nThrough my journey with ${params.topic}, I've discovered several important insights:\n\n1. **Lesson One** - Always research before making decisions\n2. **Lesson Two** - Quality matters more than price in the long run\n3. **Lesson Three** - The community around ${params.topic} is incredibly supportive\n\n## Recommendations Based on Experience\n\nAfter years of experience, here are my top recommendations for ${params.topic}:\n\n### Best Overall: [Product Name]\n\nI've personally used this for over a year, and it has never disappointed me.\n\n[View current price](#)\n\n## Conclusion\n\nMy journey with ${params.topic} has been transformative. I hope my experiences help you make better decisions in your own journey.\n\n[Check availability](#)`;
      break;
  }

  if (params.hook) {
    content = content.replace(/## Introduction/, "## Introduction\n\n**Attention!** Did you know that choosing the right ${params.topic} can save you hundreds of dollars and countless hours of frustration? This guide will ensure you make the perfect choice.\n");
  }

  if (params.storiesExamples) {
    content += "\n\n## Real-World Example\n\nJohn, a ${params.audience} from Amsterdam, was struggling with finding the right ${params.topic}. After following our advice, he found the perfect solution that matched his needs and budget. 'I couldn't be happier with my choice,' he says.\n";
  }

  if (params.interactiveElement) {
    // Instead of adding the interactive element to the content, store it separately
    interactiveElementCode = `<div class="interactive-tool">
  <h3>Compare Your Options</h3>
  <p>Use this interactive tool to compare different ${params.topic} options based on your specific needs.</p>
  <div class="comparison-form">
    <div class="form-row">
      <label for="needPriority">Your Top Priority:</label>
      <select id="needPriority">
        <option value="quality">Best Quality</option>
        <option value="price">Lowest Price</option>
        <option value="features">Most Features</option>
        <option value="durability">Longest Lasting</option>
      </select>
    </div>
    <div class="form-row">
      <label for="budgetRange">Your Budget:</label>
      <input type="range" id="budgetRange" min="100" max="1000" value="500" step="50">
      <span id="budgetValue">$500</span>
    </div>
    <button id="compareButton" class="compare-button">Find My Match</button>
  </div>
  <div id="resultsContainer" class="results-container"></div>
</div>
<script>
  // This would be implemented with real data in production
  document.getElementById('budgetRange').addEventListener('input', function() {
    document.getElementById('budgetValue').textContent = '$' + this.value;
  });
  
  document.getElementById('compareButton').addEventListener('click', function() {
    const priority = document.getElementById('needPriority').value;
    const budget = document.getElementById('budgetRange').value;
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h4>Your Recommended Options</h4>' +
      '<p>Based on your priority (' + priority + ') and budget ($' + budget + '):</p>' +
      '<ul>' +
      '<li><strong>Option A</strong> - Perfect match for your needs. $' + (budget - 50) + '</li>' +
      '<li><strong>Option B</strong> - Great alternative. $' + (budget - 150) + '</li>' +
      '<li><strong>Option C</strong> - Budget choice. $' + (budget / 2) + '</li>' +
      '</ul>';
  });
</script>`;
    
    // Add a placeholder in the content
    content += "\n\n## Interactive Comparison Tool\n\n> **Interactive Element:** *The interactive comparison tool code is available in the \"Interactive Element Code\" section below.*\n";
  }

  if (params.faq) {
    content += "\n\n## Frequently Asked Questions\n\n### What is the most important feature to look for in a " + params.topic + "?\nThe most important feature depends on your specific needs, but generally, you should prioritize quality, durability, and the specific functionalities that align with your use case.\n\n### How much should I expect to spend on a good " + params.topic + "?\nA good quality " + params.topic + " typically ranges from $X to $Y depending on the features and brand. However, there are budget-friendly options starting around $Z that still offer decent performance.\n\n### How long does a typical " + params.topic + " last?\nWith proper maintenance, a high-quality " + params.topic + " should last between X-Y years. Premium models might extend beyond this range.\n\n### Are expensive brands worth the extra cost?\nExpensive brands often offer better build quality, more features, and longer warranties. However, mid-range options can provide excellent value for most users unless you have specialized needs.\n\n### What are common mistakes people make when choosing a " + params.topic + "?\nCommon mistakes include prioritizing price over quality, not researching compatibility with existing systems, ignoring maintenance requirements, and overlooking warranty terms.\n";
  }

  return {
    title,
    content,
    metaDescription,
    interactiveElementCode
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
`;

  // Add type-specific requirements
  let typeSpecificPrompt = '';
  
  // Now, add optional elements based on parameters
  let optionalElements = '';
  
  if (params.firstPerson) {
    optionalElements += `
Use first-person perspective (I, my, me) throughout the article instead of the editorial we.
`;
  }
  
  if (params.hook) {
    optionalElements += `
Begin the article with a strong hook that captures attention immediately. This could be a surprising fact, a compelling question, or a bold statement related to ${params.topic}.
`;
  }
  
  if (params.storiesExamples) {
    optionalElements += `
Include real-world examples or case studies that illustrate the benefits or applications of ${params.topic}. These stories should make the content more relatable and persuasive.
`;
  }
  
  if (params.interactiveElement) {
    optionalElements += `
Include HTML for an interactive element that enhances user engagement. This could be a simple comparison table, pros/cons list, or a feature checklist that adds value for the reader.
`;
  }

  if (params.faq) {
    optionalElements += `
Include a "Frequently Asked Questions" section at the end of the article with at least 5 common questions about ${params.topic} and detailed answers. These questions should address common concerns, misconceptions, or decision points related to ${params.targetKeyword}. Make the FAQ section helpful for users still in the research phase of the buying journey.
`;
  }

  // Fill in the optional elements if any
  if (optionalElements) {
    typeSpecificPrompt += `
# Additional Elements to Include:
${optionalElements}
`;
  }

  // Output instructions for formatting
  const outputInstructions = `
# Output Format Instructions:
1. Start the blog post with an H1 heading (using a single #) containing the title.
2. After the title, include "Meta Description: [your meta description]" 
3. Then proceed with the blog post structure, using proper markdown heading levels.
4. Include 2-4 sections with H2 headings.
5. Use H3 and H4 for subsections as appropriate.
6. Include a conclusion section.
7. Format the article with proper markdown, including bold, bullet points, and numbered lists where appropriate.
8. Format any product recommendations with clear headings, brief descriptions, and placeholder links.
`;

  return basePrompt + typeSpecificPrompt + outputInstructions;
}
