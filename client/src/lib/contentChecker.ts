/**
 * Content Checker API Service
 * 
 * This file contains the API integration logic for checking content
 * for plagiarism and AI-generated text.
 * 
 * TO INTEGRATE YOUR API:
 * 1. Replace the API_ENDPOINT with your actual API URL
 * 2. Add your API key to the headers
 * 3. Update the request/response format to match your API
 * 4. Handle error cases appropriately
 */

// Configuration
const API_ENDPOINT = "https://your-api-endpoint.com/check"; // Replace with actual endpoint
const API_KEY = "tk_08148020e1e8b00c7da618e4debee95a49572d1d6830cd27d02b5d395a53536b"; // Your Fix AI Ghana API key

export interface ContentCheckRequest {
  content: string;
  checkPlagiarism?: boolean;
  checkAI?: boolean;
}

export interface ContentCheckResponse {
  plagiarismScore: number;
  aiScore: number;
  details?: {
    plagiarismSources?: Array<{
      url: string;
      similarity: number;
    }>;
    aiPatterns?: string[];
  };
  message?: string;
}

/**
 * Check content for plagiarism and AI-generated text
 * 
 * @param request - The content and check options
 * @returns Promise with check results
 */
export async function checkContent(
  request: ContentCheckRequest
): Promise<ContentCheckResponse> {
  try {
    // TODO: Replace this mock implementation with actual API call
    // Example implementation:
    /*
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        text: request.content,
        check_plagiarism: request.checkPlagiarism ?? true,
        check_ai: request.checkAI ?? true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      plagiarismScore: data.plagiarism_score,
      aiScore: data.ai_score,
      details: data.details,
      message: data.message,
    };
    */

    // Mock implementation for demonstration
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock scores based on content characteristics
        const wordCount = request.content.split(/\s+/).filter(Boolean).length;
        const hasCommonPhrases = /however|therefore|furthermore|moreover/i.test(
          request.content
        );

        const mockPlagiarismScore = Math.min(
          Math.floor(Math.random() * 35),
          30
        );
        const mockAiScore = hasCommonPhrases
          ? Math.floor(Math.random() * 40) + 10
          : Math.floor(Math.random() * 25);

        resolve({
          plagiarismScore: mockPlagiarismScore,
          aiScore: mockAiScore,
          message: "Analysis complete",
          details: {
            plagiarismSources: mockPlagiarismScore > 20
              ? [
                  {
                    url: "https://example.com/source1",
                    similarity: mockPlagiarismScore,
                  },
                ]
              : [],
            aiPatterns:
              mockAiScore > 25
                ? ["Repetitive sentence structure", "Formal language patterns"]
                : [],
          },
        });
      }, 3000);
    });
  } catch (error) {
    console.error("Content check error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to check content"
    );
  }
}

/**
 * Validate content before checking
 * 
 * @param content - The content to validate
 * @returns Error message if invalid, null if valid
 */
export function validateContent(content: string): string | null {
  if (!content.trim()) {
    return "Please enter some content to check";
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  
  if (wordCount < 10) {
    return "Content must be at least 10 words long";
  }

  if (wordCount > 10000) {
    return "Content must be less than 10,000 words";
  }

  return null;
}

/**
 * Format the check results for display
 * 
 * @param score - The score to format
 * @returns Formatted status and color
 */
export function getScoreStatus(score: number): {
  status: string;
  color: string;
  variant: "default" | "secondary" | "destructive";
} {
  if (score < 15) {
    return {
      status: "Low Risk",
      color: "text-green-600",
      variant: "default",
    };
  }
  if (score < 30) {
    return {
      status: "Medium Risk",
      color: "text-yellow-600",
      variant: "secondary",
    };
  }
  return {
    status: "High Risk",
    color: "text-red-600",
    variant: "destructive",
  };
}

