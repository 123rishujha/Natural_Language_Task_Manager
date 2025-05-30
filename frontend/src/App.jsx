import { useState } from "react";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import {
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Loader2,
  Github,
  Heart,
  Zap,
} from "lucide-react";
import { backendUrl } from "./CommonExports";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTask = async (taskText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}api/string-to-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskText: taskText }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse task");
      }

      const newTask = await response.json();
      setTasks([...tasks, ...newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-x-hidden w-[100vw]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  AI Task Manager
                </h1>
                <p className="text-sm text-slate-600 hidden sm:block">
                  Transform conversations into organized tasks with AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Powered by AI</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Smart Parsing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Task Input Section */}
          <div className="relative">
            <TaskInput onAddTask={handleAddTask} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200 rounded-xl p-8 shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-800 mb-1">
                      Processing Tasks
                    </h3>
                    <p className="text-sm text-slate-600">
                      AI is analyzing your input...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task List Section */}
          {!loading && (
            <div className="relative">
              <TaskList
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 bg-white/80 backdrop-blur-md border-t border-slate-200/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>using React & AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a
                href="#"
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </a>
              <span>•</span>
              <span>© 2025 AI Task Manager</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
