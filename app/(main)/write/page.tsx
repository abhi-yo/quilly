"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  PenTool,
  AlertTriangle,
  Eye,
  FileText,
  Bold,
  Italic,
  Link as LinkIcon,
  Image,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface EditorState {
  title: string;
  content: string;
  tags: string;
  lastSaved: Date | null;
}

export default function WritePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    title: "",
    content: "",
    tags: "",
    lastSaved: null,
  });

  const isWriter =
    session?.user?.role === "writer" || session?.user?.role === "admin";

  const autoSave = useCallback(async () => {
    if (!editorState.title && !editorState.content) return;

    setIsAutoSaving(true);
    localStorage.setItem(
      "article-draft",
      JSON.stringify({
        ...editorState,
        lastSaved: new Date().toISOString(),
      })
    );

    setTimeout(() => {
      setIsAutoSaving(false);
      setEditorState((prev) => ({ ...prev, lastSaved: new Date() }));
    }, 500);
  }, [editorState]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("article-draft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setEditorState({
        ...draft,
        lastSaved: draft.lastSaved ? new Date(draft.lastSaved) : null,
      });

      // Set the content in the contentEditable div
      setTimeout(() => {
        if (contentRef.current && draft.content) {
          contentRef.current.innerHTML = draft.content;
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    const autoSaveTimer = setTimeout(autoSave, 2000);
    return () => clearTimeout(autoSaveTimer);
  }, [editorState.title, editorState.content, autoSave]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && !isWriter) {
      toast({
        title: "Access Denied",
        description:
          "Only writers can create articles. Contact support to upgrade your account.",
        variant: "destructive",
      });
      router.push("/dashboard");
    }
  }, [status, isWriter, router, toast]);

  useEffect(() => {
    if (!contentRef.current) return;
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") || "";
      document.execCommand("insertText", false, text);
    };
    const el = contentRef.current;
    el.addEventListener("paste", handlePaste as any);
    return () => el.removeEventListener("paste", handlePaste as any);
  }, []);

  const execCommand = (command: string, value?: string) => {
    if (!contentRef.current) return;

    contentRef.current.focus();
    document.execCommand(command, false, value);

    setTimeout(() => {
      if (contentRef.current) {
        setEditorState((prev) => ({
          ...prev,
          content: contentRef.current?.innerHTML || "",
        }));
      }
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url && contentRef.current) {
      contentRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
          document.execCommand("createLink", false, url);
        } else {
          const linkText = prompt("Enter link text:") || url;
          const link = document.createElement("a");
          link.href = url;
          link.textContent = linkText;
          link.target = "_blank";
          range.insertNode(link);
          range.setStartAfter(link);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        setTimeout(() => {
          if (contentRef.current) {
            setEditorState((prev) => ({
              ...prev,
              content: contentRef.current?.innerHTML || "",
            }));
          }
        }, 0);
      }
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url && contentRef.current) {
      contentRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Image";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "16px 0";

        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        setTimeout(() => {
          if (contentRef.current) {
            setEditorState((prev) => ({
              ...prev,
              content: contentRef.current?.innerHTML || "",
            }));
          }
        }, 0);
      }
    }
  };

  const formatText = (command: string) => {
    if (!contentRef.current) return;
    contentRef.current.focus();
    document.execCommand(command, false);
    setTimeout(() => {
      if (contentRef.current) {
        setEditorState((prev) => ({
          ...prev,
          content: contentRef.current?.innerHTML || "",
        }));
      }
    }, 0);
  };

  const insertHeading = (level: number) => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Get the current block element
      let blockElement: Node | HTMLElement | null =
        range.commonAncestorContainer;
      if (blockElement.nodeType === Node.TEXT_NODE) {
        blockElement = blockElement.parentElement;
      }

      // Find the closest block-level element
      while (
        blockElement &&
        blockElement !== contentRef.current &&
        blockElement instanceof HTMLElement &&
        ![
          "DIV",
          "P",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "BLOCKQUOTE",
        ].includes(blockElement.nodeName)
      ) {
        blockElement = blockElement.parentElement;
      }

      if (
        blockElement &&
        blockElement !== contentRef.current &&
        blockElement instanceof HTMLElement
      ) {
        // Create new heading element
        const heading = document.createElement(`h${level}`);
        heading.innerHTML = blockElement.innerHTML || "<br>";
        heading.style.fontSize =
          level === 1 ? "2em" : level === 2 ? "1.5em" : "1.25em";
        heading.style.fontWeight = "bold";
        heading.style.margin = "1em 0 0.5em 0";
        heading.style.lineHeight = "1.2";

        // Replace the block element with the heading
        blockElement.parentElement?.replaceChild(heading, blockElement);

        // Set cursor at the end of the heading
        range.selectNodeContents(heading);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // If no block element found, use formatBlock
        document.execCommand("formatBlock", false, `h${level}`);
      }

      setTimeout(() => {
        if (contentRef.current) {
          setEditorState((prev) => ({
            ...prev,
            content: contentRef.current?.innerHTML || "",
          }));
        }
      }, 0);
    }
  };

  const insertList = (ordered: boolean) => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const command = ordered ? "insertOrderedList" : "insertUnorderedList";
    document.execCommand(command, false);

    setTimeout(() => {
      if (contentRef.current) {
        // Style the lists properly
        const lists = contentRef.current.querySelectorAll("ul, ol");
        lists.forEach((list) => {
          if (list instanceof HTMLElement) {
            list.style.margin = "1em 0";
            list.style.paddingLeft = "2em";
          }
        });

        setEditorState((prev) => ({
          ...prev,
          content: contentRef.current?.innerHTML || "",
        }));
      }
    }, 0);
  };

  const insertBlockquote = () => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Get current block element
      let blockElement: Node | HTMLElement | null =
        range.commonAncestorContainer;
      if (blockElement.nodeType === Node.TEXT_NODE) {
        blockElement = blockElement.parentElement;
      }

      while (
        blockElement &&
        blockElement !== contentRef.current &&
        blockElement instanceof HTMLElement &&
        ![
          "DIV",
          "P",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "BLOCKQUOTE",
        ].includes(blockElement.nodeName)
      ) {
        blockElement = blockElement.parentElement;
      }

      if (
        blockElement &&
        blockElement !== contentRef.current &&
        blockElement instanceof HTMLElement
      ) {
        const blockquote = document.createElement("blockquote");
        blockquote.innerHTML = blockElement.innerHTML || "<br>";
        blockquote.style.borderLeft = "4px solid #374151";
        blockquote.style.paddingLeft = "1em";
        blockquote.style.margin = "1em 0";
        blockquote.style.fontStyle = "italic";
        blockquote.style.color = "#9ca3af";

        blockElement.parentElement?.replaceChild(blockquote, blockElement);

        range.selectNodeContents(blockquote);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      setTimeout(() => {
        if (contentRef.current) {
          setEditorState((prev) => ({
            ...prev,
            content: contentRef.current?.innerHTML || "",
          }));
        }
      }, 0);
    }
  };

  const insertCodeBlock = () => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = range.toString() || "Enter your code here...";
      code.style.display = "block";
      code.style.padding = "1em";
      code.style.backgroundColor = "#1f2937";
      code.style.color = "#e5e7eb";
      code.style.borderRadius = "0.5em";
      code.style.fontFamily =
        'Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      code.style.fontSize = "0.875em";
      code.style.lineHeight = "1.5";
      code.style.overflowX = "auto";

      pre.appendChild(code);
      pre.style.margin = "1em 0";

      range.deleteContents();
      range.insertNode(pre);
      range.setStartAfter(pre);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      setTimeout(() => {
        if (contentRef.current) {
          setEditorState((prev) => ({
            ...prev,
            content: contentRef.current?.innerHTML || "",
          }));
        }
      }, 0);
    }
  };

  const setAlignment = (alignment: string) => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const alignmentMap: Record<string, string> = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
    };

    document.execCommand(alignmentMap[alignment], false);

    setTimeout(() => {
      if (contentRef.current) {
        setEditorState((prev) => ({
          ...prev,
          content: contentRef.current?.innerHTML || "",
        }));
      }
    }, 0);
  };

  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setEditorState((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!editorState.title.trim() || !editorState.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editorState.title.trim(),
          content: editorState.content.trim(),
          tags: editorState.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create article");
        return;
      }

      localStorage.removeItem("article-draft");

      toast({
        title: "Success",
        description: "Article published successfully!",
      });

      router.push(`/articles/${data.id}`);
    } catch (error) {
      setError("An error occurred while publishing the article");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="prose prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
          {editorState.title || "Untitled Article"}
        </h1>
        <div
          className="text-base md:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: editorState.content || "<p>No content yet...</p>",
          }}
        />
        {editorState.tags && (
          <div className="flex flex-wrap gap-2 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-800">
            {editorState.tags.split(",").map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-800 text-gray-300"
              >
                #{tag.trim()}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !isWriter) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="h-12 w-12 md:h-16 md:w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl md:text-2xl font-bold text-white mb-3">
            Access Restricted
          </h1>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            Only writers can create articles. Please contact support to upgrade
            your account or explore existing content.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/explore">
              <Button className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto">
                Explore Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded-xl">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold">
                  Article Editor
                </h1>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                  <span>Draft</span>
                  <span>•</span>
                  {isAutoSaving ? (
                    <span>Saving...</span>
                  ) : editorState.lastSaved ? (
                    <span className="hidden sm:inline">
                      Auto-saved{" "}
                      {Math.floor(
                        (Date.now() - editorState.lastSaved.getTime()) / 60000
                      )}{" "}
                      min ago
                    </span>
                  ) : (
                    <span>Not saved</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-gray-400 hover:text-white flex-1 md:flex-none"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="sm"
                className="bg-white text-black hover:bg-gray-100 px-4 md:px-6 flex-1 md:flex-none"
              >
                <PenTool className="w-4 h-4 mr-2" />
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>

        {!showPreview && (
          <div className="border-b border-gray-800 hidden md:block">
            <div className="flex items-center gap-1 p-4 overflow-x-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("bold")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("italic")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("underline")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Underline className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText("strikeThrough")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Strikethrough className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-700 mx-2" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(1)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Heading1 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(2)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(3)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Heading3 className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-700 mx-2" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertList(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertList(true)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={insertBlockquote}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={insertCodeBlock}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Code className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-700 mx-2" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertLink()}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertImage()}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Image className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-700 mx-2" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlignment("left")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlignment("center")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlignment("right")}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {showPreview ? (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">{renderPreview()}</div>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-180px)]">
            {error && (
              <div className="text-red-400 text-sm p-3 md:p-4 bg-red-950/20 rounded-xl border border-red-900/20 m-4 md:m-8 mb-0">
                {error}
              </div>
            )}

            <div className="flex-1 flex flex-col p-4 md:p-8">
              <div className="w-full flex flex-col flex-1">
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Enter your article title..."
                    className="text-2xl md:text-4xl font-bold bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 p-0 h-auto leading-tight"
                    value={editorState.title}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="hidden md:block flex-1">
                    <div
                      ref={contentRef}
                      contentEditable
                      onInput={handleContentInput}
                      className="w-full h-full min-h-[400px] text-lg leading-relaxed bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 p-4 focus:outline-none"
                      suppressContentEditableWarning={true}
                      data-placeholder="Start writing your article here... Use the toolbar above to format your text."
                    />
                  </div>
                  <div className="md:hidden flex-1">
                    <Textarea
                      placeholder="Start writing your article here...

You can write naturally - just type your content and it will be formatted properly when published. Focus on your ideas and let the words flow.

Tips:
- Write clear, engaging content
- Break up long paragraphs for better readability
- Use descriptive headings and subheadings
- Include examples and stories to illustrate your points"
                      className="w-full h-full min-h-[400px] text-base leading-relaxed bg-transparent border border-gray-800/50 text-white placeholder-gray-500 focus:ring-0 resize-none p-4 rounded-lg hover:border-gray-700/50 focus:border-gray-600/50 transition-colors"
                      value={editorState.content}
                      onChange={(e) =>
                        setEditorState((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-900/50 pt-6 mt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Tags (help readers discover your article)
                  </label>
                  <Input
                    type="text"
                    placeholder="react, typescript, web development, tutorial..."
                    className="bg-gray-950/50 border-gray-800 text-white placeholder-gray-500 rounded-xl h-10 md:h-12 focus:border-gray-600 focus:ring-0 text-sm md:text-base"
                    value={editorState.tags}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                  />
                  {editorState.tags && (
                    <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                      {editorState.tags.split(",").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-800 text-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm"
                        >
                          #{tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
