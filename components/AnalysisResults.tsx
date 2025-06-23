import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, MessageSquare, TrendingUp, Eye, Clock, FileText } from "lucide-react";

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

interface AnalysisResultsProps {
  data: AnalysisData;
  isLoading: boolean;
  title?: string;
}

export default function AnalysisResults({ data, isLoading, title = "Analysis Results" }: AnalysisResultsProps) {
  console.log('AnalysisResults received data:', data, 'isLoading:', isLoading);
  
  if (isLoading) {
    return (
      <Card className="w-full bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Analyzing...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <Heart className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      
      {data.sentiment && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              {getSentimentIcon(data.sentiment.label)}
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${getSentimentColor(data.sentiment.label)}`}>
                {data.sentiment.label}
              </span>
              <span className="text-white/70">
                {(data.sentiment.score * 100).toFixed(1)}% confidence
              </span>
            </div>
            <Progress 
              value={data.sentiment.score * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      )}

      {data.summary && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 leading-relaxed">{data.summary}</p>
          </CardContent>
        </Card>
      )}

      {data.stats && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Document Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{data.stats.word_count}</div>
                <div className="text-white/60 text-sm">Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{data.stats.sentence_count}</div>
                <div className="text-white/60 text-sm">Sentences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.stats.reading_time}
                </div>
                <div className="text-white/60 text-sm">Min Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data.keywords && data.keywords.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Key Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.entities && data.entities.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Named Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.entities.map((entity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-white">{entity.text}</span>
                  <Badge variant="outline" className="border-white/20 text-white/70">
                    {entity.label}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.emotion && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Emotion Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{data.emotion.label}</span>
              <span className="text-white/70">
                {(data.emotion.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
            <Progress 
              value={data.emotion.confidence * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      )}

      {data.topics && data.topics.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.topics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback: Display any unhandled data */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Raw Analysis Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-white/80 text-xs overflow-auto max-h-64">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 