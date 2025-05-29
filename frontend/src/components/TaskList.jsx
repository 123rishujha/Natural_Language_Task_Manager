import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
// Using built-in Date formatting instead of date-fns
import {
  Pencil,
  Trash2,
  Check,
  X,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  SortAsc,
  Search,
  MoreVertical,
  Archive,
  Star,
  Flag,
} from "lucide-react";

const priorityConfig = {
  P1: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: "🔥",
    label: "Critical",
    gradient: "from-red-500 to-red-600",
  },
  P2: {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: "⚡",
    label: "High",
    gradient: "from-orange-500 to-orange-600",
  },
  P3: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "📋",
    label: "Medium",
    gradient: "from-blue-500 to-blue-600",
  },
  P4: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "🌱",
    label: "Low",
    gradient: "from-green-500 to-green-600",
  },
};

export function TaskList({ tasks, onEditTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return a.priority.localeCompare(b.priority);
        case "assignee":
          return a.assignee.localeCompare(b.assignee);
        case "dueDate":
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        default:
          return 0;
      }
    });
  }, [tasks, searchTerm, filterPriority, sortBy]);

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditForm(task);
  };

  const handleSave = (id) => {
    onEditTask(id, editForm);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const toggleTaskComplete = (taskId) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const days = Math.ceil(
      (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (!tasks || tasks.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-600">No tasks yet</h3>
          <p className="text-sm text-slate-500">
            Add your first task using the input above to get started!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Controls Header */}
      <Card className="p-4 bg-white border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">
              Tasks ({filteredAndSortedTasks.length})
            </h2>
            <Badge variant="outline" className="text-xs">
              {tasks.filter((t) => completedTasks.has(t.id)).length} completed
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-48"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="all">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="assignee">Sort by Assignee</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Task List */}
      <Card className="overflow-hidden bg-white border-slate-200 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Task
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignee
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Priority
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.map((task, index) => {
                const isCompleted = completedTasks.has(task.id);
                const isEditing = editingId === task.id;
                const overdue = isOverdue(task.dueDate);
                const daysUntil = getDaysUntilDue(task.dueDate);
                const priorityInfo =
                  priorityConfig[task.priority] || priorityConfig.P4;

                return (
                  <tr
                    key={task.id}
                    className={`border-b transition-all hover:bg-slate-50 group ${
                      isCompleted ? "bg-green-50/50 opacity-75" : ""
                    } ${overdue && !isCompleted ? "bg-red-50/30" : ""}`}
                  >
                    {/* Task Name */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
                            isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-slate-300 hover:border-green-400"
                          }`}
                        >
                          {isCompleted && <Check className="h-3 w-3 m-auto" />}
                        </button>

                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                          />
                        ) : (
                          <div className="flex-1">
                            <span
                              className={`font-medium text-slate-800 ${
                                isCompleted ? "line-through text-slate-500" : ""
                              }`}
                            >
                              {task.name}
                            </span>
                            {overdue && !isCompleted && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-red-600 font-medium">
                                  Overdue
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Assignee */}
                    <td className="p-4 align-middle">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.assignee}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              assignee: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {task.assignee.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-700 font-medium">
                            {task.assignee}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="p-4 align-middle">
                      {isEditing ? (
                        <input
                          type="datetime-local"
                          value={
                            editForm.dueDate
                              ? new Date(editForm.dueDate)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              dueDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                      ) : (
                        task.dueDate && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span
                                className={`text-sm ${
                                  overdue
                                    ? "text-red-600 font-medium"
                                    : "text-slate-600"
                                }`}
                              >
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(task.dueDate).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                            {daysUntil !== null && (
                              <div
                                className={`text-xs font-medium ${
                                  daysUntil < 0
                                    ? "text-red-600"
                                    : daysUntil === 0
                                    ? "text-orange-600"
                                    : daysUntil <= 3
                                    ? "text-yellow-600"
                                    : "text-slate-500"
                                }`}
                              >
                                {daysUntil < 0
                                  ? `${Math.abs(daysUntil)} days overdue`
                                  : daysUntil === 0
                                  ? "Due today"
                                  : `${daysUntil} days left`}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </td>

                    {/* Priority */}
                    <td className="p-4 align-middle">
                      {isEditing ? (
                        <select
                          value={editForm.priority}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              priority: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        >
                          <option value="P1">P1 - Critical</option>
                          <option value="P2">P2 - High</option>
                          <option value="P3">P3 - Medium</option>
                          <option value="P4">P4 - Low</option>
                        </select>
                      ) : (
                        <Badge
                          className={`${priorityInfo.color} border font-medium px-3 py-1`}
                        >
                          <span className="mr-1">{priorityInfo.icon}</span>
                          {task.priority}
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              onClick={() => handleSave(task.id)}
                              size="sm"
                              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={handleCancel}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleEdit(task)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => onDeleteTask(task.id)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedTasks.length === 0 && (
          <div className="p-12 text-center">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              No tasks found
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {tasks.filter((t) => completedTasks.has(t.id)).length}
              </div>
              <div className="text-xs text-blue-700">Completed</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">
                {
                  tasks.filter(
                    (t) => isOverdue(t.dueDate) && !completedTasks.has(t.id)
                  ).length
                }
              </div>
              <div className="text-xs text-red-700">Overdue</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">
                {
                  tasks.filter(
                    (t) => !completedTasks.has(t.id) && !isOverdue(t.dueDate)
                  ).length
                }
              </div>
              <div className="text-xs text-orange-700">In Progress</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Flag className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {tasks.filter((t) => t.priority === "P1").length}
              </div>
              <div className="text-xs text-purple-700">Critical</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
