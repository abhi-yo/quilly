import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogAnalyzer from './BlogAnalyzer';
import PDFAnalyzer from './PDFAnalyzer';
import { checkServerHealth } from '@/lib/api';
import { Brain, Link, FileText, Wifi, WifiOff } from 'lucide-react';

export default function NLPAnalyzer() {
  const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('blog');

  useEffect(() => {
    const checkServer = async () => {
      const isOnline = await checkServerHealth();
      setIsServerOnline(isOnline);
    };
    
    checkServer();
    const interval = setInterval(checkServer, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              NLP Content Analyzer
            </div>
            <div className="flex items-center gap-2">
              {isServerOnline === null ? (
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                  Checking...
                </Badge>
              ) : isServerOnline ? (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Server Online
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-500/20 text-red-300 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Server Offline
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 mb-4">
            Powered by advanced AI models, analyze content from blog URLs or PDF documents 
            to extract insights including sentiment analysis, key topics, named entities, 
            document statistics, and more.
          </p>
          
          {!isServerOnline && isServerOnline !== null && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <h4 className="text-red-300 font-medium mb-2">Backend Server Not Available</h4>
              <p className="text-red-200 text-sm">
                The NLP analysis backend is currently offline. Please make sure the FastAPI server 
                is running on <code className="bg-red-500/20 px-1 rounded">http://localhost:8000</code>
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-red-500/20 text-red-300 hover:bg-red-500/10"
                onClick={() => checkServerHealth().then(setIsServerOnline)}
              >
                Retry Connection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
          <TabsTrigger 
            value="blog" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            Blog URL
          </TabsTrigger>
          <TabsTrigger 
            value="pdf" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            PDF Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog" className="mt-6">
          <BlogAnalyzer />
        </TabsContent>
        
        <TabsContent value="pdf" className="mt-6">
          <PDFAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
} 