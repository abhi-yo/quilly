import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeBlog } from '@/lib/api';
import AnalysisResults from './AnalysisResults';
import { Link, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisData {
  sentiment?: {
    label: string;
    score: number;
  };
  summary?: string;
  keywords?: string[];
  entities?: Array<{
    text: string;
    label: string;
  }>;
  stats?: {
    word_count: number;
    sentence_count: number;
    reading_time: number;
  };
  emotion?: {
    label: string;
    confidence: number;
  };
  topics?: string[];
}

export default function BlogAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisData(null);
      
      const result = await analyzeBlog(url);
      console.log('Blog Analysis Result:', result);
      setAnalysisData(result);
      
      toast({
        title: 'Success',
        description: 'Blog analysis completed successfully!',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the blog. Please check the URL and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Link className="w-5 h-5" />
            Blog URL Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter blog URL (e.g., https://example.com/blog-post)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAnalyzing}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>
          
          <p className="text-white/60 text-sm">
            Enter a blog URL to get comprehensive NLP analysis including sentiment, 
            key topics, entities, and more.
          </p>
        </CardContent>
      </Card>

      {(isAnalyzing || analysisData) && (
        <AnalysisResults 
          data={analysisData || {}}
          isLoading={isAnalyzing}
          title="Blog Analysis Results"
        />
      )}
    </div>
  );
} 