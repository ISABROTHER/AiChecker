# API Integration Guide

This document explains how to integrate your content checking API with the Student Content Checker website.

## Current Status

The website is currently using **mock data** for demonstration purposes. To enable real content checking, you need to integrate with an actual API service.

## Your API Key

You have provided the following API key:
```
API Key: tk_08148020e1e8b00c7da618e4debee95a49572d1d6830cd27d02b5d395a53536b
Key Name: Fix AI Ghana
```

## Integration Steps

### 1. Locate the API Service File

Open the file: `client/src/lib/contentChecker.ts`

### 2. Update API Configuration

Replace the placeholder values with your actual API details:

```typescript
// Configuration
const API_ENDPOINT = "https://your-actual-api-endpoint.com/check"; // Replace with your API URL
const API_KEY = "tk_08148020e1e8b00c7da618e4debee95a49572d1d6830cd27d02b5d395a53536b"; // Already set
```

### 3. Update the API Request

Replace the mock implementation in the `checkContent` function with your actual API call. Here's a template:

```typescript
export async function checkContent(
  request: ContentCheckRequest
): Promise<ContentCheckResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        // Add any other headers required by your API
      },
      body: JSON.stringify({
        text: request.content,
        check_plagiarism: request.checkPlagiarism ?? true,
        check_ai: request.checkAI ?? true,
        // Adjust the request body to match your API's expected format
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the API response to the expected format
    return {
      plagiarismScore: data.plagiarism_score, // Adjust field names as needed
      aiScore: data.ai_score, // Adjust field names as needed
      details: {
        plagiarismSources: data.sources?.map((s: any) => ({
          url: s.url,
          similarity: s.similarity,
        })),
        aiPatterns: data.ai_patterns,
      },
      message: data.message,
    };
  } catch (error) {
    console.error("Content check error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to check content"
    );
  }
}
```

### 4. Adjust Response Mapping

Make sure the response from your API is correctly mapped to the `ContentCheckResponse` interface:

```typescript
export interface ContentCheckResponse {
  plagiarismScore: number;      // 0-100 percentage
  aiScore: number;               // 0-100 percentage
  details?: {
    plagiarismSources?: Array<{
      url: string;
      similarity: number;
    }>;
    aiPatterns?: string[];
  };
  message?: string;
}
```

## API Documentation Needed

To complete the integration, you'll need the following information from your API provider:

1. **API Endpoint URL** - The full URL where requests should be sent
2. **Authentication Method** - How to authenticate (Bearer token, API key in header, etc.)
3. **Request Format** - The expected JSON structure for requests
4. **Response Format** - The JSON structure of responses
5. **Error Handling** - How errors are returned and should be handled
6. **Rate Limits** - Any rate limiting or usage restrictions

## Recommended API Services

If you don't have a specific API yet, here are some popular content checking services:

### For Plagiarism Detection:
- **Copyleaks** - https://copyleaks.com/api
- **Turnitin** - https://www.turnitin.com/products/api
- **Grammarly** - https://www.grammarly.com/business/api

### For AI Content Detection:
- **Copyleaks AI Detector** - https://copyleaks.com/ai-content-detector
- **GPTZero** - https://gptzero.me/
- **Originality.ai** - https://originality.ai/

### Combined Services:
- **Copyleaks** offers both plagiarism and AI detection in one API

## Testing Your Integration

After updating the API configuration:

1. Save the changes to `client/src/lib/contentChecker.ts`
2. The development server will automatically reload
3. Test by submitting content through the website
4. Check the browser console (F12) for any error messages
5. Verify that the results display correctly

## Environment Variables (Optional)

For better security, you can move the API key to an environment variable:

1. Create a `.env` file in the project root (if using a backend)
2. Add: `VITE_API_KEY=your_api_key_here`
3. Update the code to use: `const API_KEY = import.meta.env.VITE_API_KEY;`

**Note:** For client-side apps, API keys will be visible in the browser. For production, consider implementing a backend proxy to keep keys secure.

## Support

If you encounter issues during integration:
1. Check the API provider's documentation
2. Verify your API key is valid and has the correct permissions
3. Check the browser console for detailed error messages
4. Test the API endpoint directly using tools like Postman or curl

## Next Steps

Once the API is integrated and tested:
1. Test with various content samples
2. Verify score accuracy and thresholds
3. Adjust the UI feedback messages if needed
4. Consider adding more features like detailed reports or history

