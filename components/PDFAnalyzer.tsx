import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzePDF } from "@/lib/api";
import AnalysisResults from "./AnalysisResults";
import { FileText, Upload, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function PDFAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setAnalysisData(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisData(null);

      const result = await analyzePDF(selectedFile);
      setAnalysisData(result);

      toast({
        title: "Success",
        description: "PDF analysis completed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Document Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragOver
                ? "border-blue-400 bg-blue-400/10"
                : "border-white/20 hover:border-white/40"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
                    "Analyze PDF"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-white/40 mx-auto" />
                <div>
                  <p className="text-white mb-1">
                    Drag and drop your PDF file here, or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-white/60 text-sm">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />

          <p className="text-white/60 text-sm">
            Upload a PDF document to get comprehensive NLP analysis including
            sentiment, key topics, entities, document statistics, and more.
          </p>
        </CardContent>
      </Card>

      {(isAnalyzing || analysisData) && (
        <AnalysisResults
          data={analysisData || {}}
          isLoading={isAnalyzing}
          title="PDF Analysis Results"
        />
      )}
    </div>
  );
}
