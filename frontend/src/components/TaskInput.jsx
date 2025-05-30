import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Loader2,
  Sparkles,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Mic,
  Send,
  Lightbulb,
} from "lucide-react";

export function TaskInput({ onAddTask }) {
  const [taskText, setTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef(null);

  // Sample suggestions for better UX
  const sampleSuggestions = [
    "Schedule meeting with John for project review on Friday 2pm",
    "Assign Sarah to handle client presentation by next Tuesday",
    "Review budget proposal with finance team before month end",
    "Complete UI mockups for mobile app by Wednesday evening",
  ];

  useEffect(() => {
    setSuggestions(sampleSuggestions);
  }, []);

  useEffect(() => {
    const words = taskText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [taskText]);

  const handleAddTask = async () => {
    if (!taskText.trim()) return;

    onAddTask(taskText);
  };

  const handleSuggestionClick = (suggestion) => {
    setTaskText(suggestion);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isLoading && taskText.trim()) {
        handleAddTask();
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you'd implement speech-to-text here
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Input Card */}
      <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                AI Task Parser
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Transform your notes, meetings, or conversations into organized
              tasks
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="task"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Enter your task description or meeting transcript
              </label>
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  id="task"
                  placeholder="Example: 'Hey team, let's have Aman work on the landing page redesign by Friday 10pm, and Rajeev can handle the client follow-up calls by Wednesday morning. Sarah, please review the proposal by EOD today.'"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[120px] md:min-h-[160px] resize-none pr-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
                />
                <Button
                  onClick={toggleRecording}
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 top-2 h-8 w-8 p-0 ${
                    isRecording
                      ? "text-red-500 bg-red-50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Mic
                    className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`}
                  />
                </Button>
              </div>

              {/* Word Count & Shortcuts */}
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{wordCount} words</span>
                <span>⌘+Enter to submit</span>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Tasks successfully parsed and added!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FileText className="h-3 w-3" />
                <span>Supports meeting transcripts, notes, and task lists</span>
              </div>

              <Button
                onClick={handleAddTask}
                disabled={isLoading || !taskText.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 transition-all duration-200"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Parse Tasks
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Suggestions */}
      {!taskText && suggestions.length > 0 && (
        <Card className="p-4 bg-slate-50 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Try these examples:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-slate-200 transition-colors text-xs p-2 max-w-xs truncate"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
