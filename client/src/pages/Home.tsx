import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { APP_TITLE } from "@/const";
import { useState } from "react";
import { FileText, Shield, Sparkles, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { checkContent, validateContent, getScoreStatus, type ContentCheckResponse } from "@/lib/contentChecker";
import { toast } from "sonner";

interface CheckResult extends ContentCheckResponse {
  status: "checking" | "complete" | "error";
}

export default function Home() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    // Validate content
    const validationError = validateContent(content);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsChecking(true);
    setResult({ 
      plagiarismScore: 0, 
      aiScore: 0, 
      status: "checking",
      message: "Analyzing your content..." 
    });

    try {
      const response = await checkContent({
        content,
        checkPlagiarism: true,
        checkAI: true,
      });

      setResult({
        ...response,
        status: "complete",
      });
      toast.success("Analysis complete!");
    } catch (error) {
      setResult({
        plagiarismScore: 0,
        aiScore: 0,
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{APP_TITLE}</h1>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              For Ghanaian Students
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Check Your Content Before Submission
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ensure academic integrity by checking your written work for plagiarism and AI-generated content. 
            Get instant results and submit with confidence.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Plagiarism Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compare your content against millions of sources to ensure originality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-lg">AI Content Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identify AI-generated text to maintain authentic academic work.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get comprehensive analysis in seconds, not hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Checker */}
      <section className="container pb-16">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Content</CardTitle>
              <CardDescription>
                Paste your written content below to check for plagiarism and AI-generated text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your essay, assignment, or any written content here..."
                className="min-h-[300px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isChecking}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {content.length} characters • {wordCount} words
                </p>
                <Button 
                  onClick={handleCheck} 
                  disabled={!content.trim() || isChecking}
                  size="lg"
                >
                  {isChecking ? "Checking..." : "Check Content"}
                </Button>
              </div>

              {/* Results Section */}
              {result && (
                <div className="mt-8 space-y-4 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Analysis Results</h3>
                  </div>

                  {result.status === "checking" && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      <Progress value={33} className="h-2" />
                    </div>
                  )}

                  {result.status === "complete" && (
                    <div className="space-y-6">
                      {/* Plagiarism Score */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Plagiarism Detection</CardTitle>
                            <Badge variant={getScoreStatus(result.plagiarismScore).variant}>
                              {getScoreStatus(result.plagiarismScore).status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Similarity Score</span>
                              <span className={`text-2xl font-bold ${getScoreStatus(result.plagiarismScore).color}`}>
                                {result.plagiarismScore}%
                              </span>
                            </div>
                            <Progress value={result.plagiarismScore} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                              {result.plagiarismScore < 15 
                                ? "Your content appears to be original with minimal matches." 
                                : result.plagiarismScore < 30 
                                ? "Some similarities detected. Review flagged sections." 
                                : "High similarity detected. Significant revision recommended."}
                            </p>
                            {result.details?.plagiarismSources && result.details.plagiarismSources.length > 0 && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-md">
                                <p className="text-xs font-medium mb-2">Similar Sources Found:</p>
                                {result.details.plagiarismSources.map((source, idx) => (
                                  <div key={idx} className="text-xs text-muted-foreground">
                                    • {source.url} ({source.similarity}% match)
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI Detection Score */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">AI Content Detection</CardTitle>
                            <Badge variant={getScoreStatus(result.aiScore).variant}>
                              {getScoreStatus(result.aiScore).status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">AI Probability</span>
                              <span className={`text-2xl font-bold ${getScoreStatus(result.aiScore).color}`}>
                                {result.aiScore}%
                              </span>
                            </div>
                            <Progress value={result.aiScore} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                              {result.aiScore < 15 
                                ? "Content appears to be human-written." 
                                : result.aiScore < 30 
                                ? "Some AI-generated patterns detected." 
                                : "High probability of AI-generated content."}
                            </p>
                            {result.details?.aiPatterns && result.details.aiPatterns.length > 0 && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-md">
                                <p className="text-xs font-medium mb-2">AI Patterns Detected:</p>
                                {result.details.aiPatterns.map((pattern, idx) => (
                                  <div key={idx} className="text-xs text-muted-foreground">
                                    • {pattern}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Overall Status */}
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        {result.plagiarismScore < 15 && result.aiScore < 15 ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-green-600">Ready for Submission</p>
                              <p className="text-sm text-muted-foreground">
                                Your content shows good originality and appears to be authentically written.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-yellow-600">Review Recommended</p>
                              <p className="text-sm text-muted-foreground">
                                Consider reviewing and revising flagged sections before submission.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {result.status === "error" && (
                    <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-destructive">Error</p>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built for Ghanaian students to maintain academic integrity and excellence.
            </p>
            <p className="text-xs text-muted-foreground">
              Note: Currently using mock data for demonstration. Update the API configuration in{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">client/src/lib/contentChecker.ts</code>{" "}
              to integrate with your content checking service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

