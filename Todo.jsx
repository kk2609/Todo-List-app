// import React, { useEffect, useState } from "react";
// import { TodoForm } from "./TodoForm";
// import { TodoList } from "./TodoList";
// import { TodoDate } from "./TodoDate";

// export const Todo = () => {
//   const [task, setTask] = useState(() => {
//     try {
//       const savedTasks = localStorage.getItem("task");
//       return savedTasks ? JSON.parse(savedTasks) : [];
//     } catch (error) {
//       return [];
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("task", JSON.stringify(task));
//   }, [task]);

//   const handleFormSubmit = (inputValue) => {
//     const trimmedValue = inputValue.trim();
//     if (!trimmedValue) return;

//     const ifTodoContentMatched = task.find(
//       (curTask) => curTask.content === trimmedValue
//     );
//     if (ifTodoContentMatched) return;

//     setTask((prevTask) => [
//       ...prevTask,
//       { id: trimmedValue, content: trimmedValue, checked: false },
//     ]);
//   };

//   const handleDeleteTodo = (value) => {
//     setTask(task.filter((curTask) => curTask.content !== value));
//   };

//   const handleClearButton = () => {
//     setTask([]);
//   };

//   const handleCheckedTodo = (value) => {
//     setTask(
//       task.map((curTask) =>
//         curTask.content === value
//           ? { ...curTask, checked: !curTask.checked }
//           : curTask
//       )
//     );
//   };

//   return (
//     <section className="min-h-screen w-full bg-[linear-gradient(100deg,#001214,#001f29)] flex flex-col items-center text-white overflow-x-hidden">
//       <div className="w-full max-w-[900px] flex flex-col items-center px-4 pt-16">

//         {/* Header */}
//         <header className="flex flex-col items-center mb-10">
//           <h1 className="text-7xl font-bold leading-none mb-4">Todo List</h1>
//           <TodoDate />
//         </header>

//         {/* Form */}
//         <TodoForm onAddTodo={handleFormSubmit} />

//         {/* Todo List */}
//         <section className="w-full flex justify-center mt-6">
//           <ul className="w-full flex flex-col items-center gap-5">
//             {task.map((curTask) => (
//               <TodoList
//                 key={curTask.id}
//                 data={curTask.content}
//                 checked={curTask.checked}
//                 onHandleDeleteTodo={handleDeleteTodo}
//                 onHandleCheckedTodo={handleCheckedTodo}
//               />
//             ))}
//           </ul>
//         </section>

//         {/* Clear Button */}
//         {task.length > 0 && (
//           <button
//             className="mt-8 bg-[#e74c3c] hover:bg-[#c0392b] px-8 py-3 rounded-md text-base font-medium text-white transition-all duration-300 cursor-pointer"
//             onClick={handleClearButton}
//           >
//             Clear All
//           </button>
//         )}
//       </div>
//     </section>
//   );
// };

import React, { useEffect, useState } from "react";
import { MdCheck, MdDeleteForever, MdEdit, MdSave, MdClose, MdRestore } from "react-icons/md";

export const Todo = () => {
  const [task, setTask] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("todoTasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      return [];
    }
  });

  const [trash, setTrash] = useState(() => {
    try {
      const savedTrash = localStorage.getItem("todoTrash");
      return savedTrash ? JSON.parse(savedTrash) : [];
    } catch (error) {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState("none");
  const [datetime, setDatetime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const categories = ["personal", "work", "health", "shopping", "projects"];
  const priorities = ["low", "medium", "high"];
  const recurringOptions = ["none", "daily", "weekly", "monthly"];

  // Date/Time Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setDatetime(`${formattedDate} • ${formattedTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(task));
  }, [task]);

  useEffect(() => {
    localStorage.setItem("todoTrash", JSON.stringify(trash));
  }, [trash]);

  // Priority Color
  const getPriorityColor = (pri) => {
    switch (pri) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Category Color
  const getCategoryColor = (cat) => {
    const colors = {
      personal: "bg-blue-500",
      work: "bg-purple-500",
      health: "bg-pink-500",
      shopping: "bg-orange-500",
      projects: "bg-indigo-500",
    };
    return colors[cat] || "bg-gray-500";
  };

  // Check if task is overdue
  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date() && !date.includes("today");
  };

  // Handle Add Task
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    const ifTodoContentMatched = task.find(
      (curTask) => curTask.content.toLowerCase() === trimmedValue.toLowerCase()
    );
    if (ifTodoContentMatched) {
      alert("Task already exists!");
      return;
    }

    setTask((prevTask) => [
      ...prevTask,
      {
        id: Date.now(),
        content: trimmedValue,
        checked: false,
        priority,
        category,
        dueDate,
        recurring,
      },
    ]);
    setInputValue("");
    setPriority("medium");
    setCategory("personal");
    setDueDate("");
    setRecurring("none");
  };

  // Handle Delete Task (move to trash)
  const handleDeleteTodo = (id) => {
    const deletedTask = task.find((t) => t.id === id);
    if (deletedTask) {
      setTrash([...trash, { ...deletedTask, deletedAt: Date.now() }]);
      setTask(task.filter((curTask) => curTask.id !== id));
    }
  };

  // Handle Restore Task
  const handleRestoreTask = (id) => {
    const restoredTask = trash.find((t) => t.id === id);
    if (restoredTask) {
      const { deletedAt, ...taskWithoutDeletedAt } = restoredTask;
      setTask([...task, taskWithoutDeletedAt]);
      setTrash(trash.filter((t) => t.id !== id));
    }
  };

  // Handle Permanently Delete
  const handlePermanentDelete = (id) => {
    setTrash(trash.filter((t) => t.id !== id));
  };

  // Handle Checked Todo
  const handleCheckedTodo = (id) => {
    setTask(
      task.map((curTask) =>
        curTask.id === id ? { ...curTask, checked: !curTask.checked } : curTask
      )
    );
  };

  // Handle Edit
  const handleStartEdit = (id, content) => {
    setEditingId(id);
    setEditingValue(content);
  };

  const handleSaveEdit = (id) => {
    const trimmedValue = editingValue.trim();
    if (!trimmedValue) return;

    const ifTodoContentMatched = task.find(
      (curTask) => curTask.content.toLowerCase() === trimmedValue.toLowerCase() && curTask.id !== id
    );
    if (ifTodoContentMatched) {
      alert("Task already exists!");
      return;
    }

    setTask(
      task.map((curTask) =>
        curTask.id === id ? { ...curTask, content: trimmedValue } : curTask
      )
    );
    setEditingId(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  // Handle Clear All
  const handleClearButton = () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTrash([...trash, ...task]);
      setTask([]);
    }
  };

  // Filter tasks
  const filteredTasks = task.filter((t) => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const completedCount = filteredTasks.filter((t) => t.checked).length;
  const totalCount = filteredTasks.length;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#001214] to-[#001f29] overflow-y-auto">
      <div className="w-full min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl flex flex-col items-center">
          
          {/* ========== Header ========== */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 w-full">
            <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
              Todo List
            </h1>
            <div className="h-0.5 sm:h-1 w-12 sm:w-14 md:w-16 lg:w-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mx-auto mb-4 sm:mb-5 md:mb-6"></div>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white font-semibold tracking-wide font-mono">
              {datetime || "Loading..."}
            </p>
          </div>

          {/* ========== Progress Bar ========== */}
          {totalCount > 0 && (
            <div className="w-full mb-6 sm:mb-8 md:mb-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm text-white font-medium">Progress</span>
                <span className="text-xs sm:text-sm text-white font-semibold">
                  {completedCount} of {totalCount}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* ========== Form ========== */}
          <form onSubmit={handleFormSubmit} className="w-full mb-6 sm:mb-8 md:mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 mb-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 outline-none"
              />

              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 outline-none"
              >
                <option value="none">No Repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Add a new task..."
                autoComplete="off"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="flex-1 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 lg:py-5 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl bg-[#f2f3f4] text-black placeholder-gray-400 outline-none rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl sm:rounded-l-2xl sm:rounded-r-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <button
                type="submit"
                className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 xs:py-3 sm:py-3.5 md:py-4 lg:py-5 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-semibold bg-[#5dade2] hover:bg-[#3498db] text-white rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl sm:rounded-l-none sm:rounded-r-2xl transition-all active:scale-95 whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </form>

          {/* ========== Filter Section ========== */}
          <div className="w-full mb-6 sm:mb-8 grid grid-cols-2 gap-2 sm:gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* ========== Tabs ========== */}
          <div className="w-full mb-6 flex gap-2">
            <button
              onClick={() => setShowTrash(false)}
              className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                !showTrash
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              Tasks ({task.length})
            </button>
            <button
              onClick={() => setShowTrash(true)}
              className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                showTrash
                  ? "bg-red-500 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              Trash ({trash.length})
            </button>
          </div>

          {/* ========== Tasks Section ========== */}
          {!showTrash ? (
            <div className="w-full">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-medium">
                    {task.length === 0 ? "No tasks yet. Add one to get started!" : "No tasks match your filters."}
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                  {filteredTasks.map((curTask) => (
                    <li
                      key={curTask.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 bg-[#f2f3f4] rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl transition-all hover:shadow-lg gap-3 sm:gap-0"
                    >
                      {editingId === curTask.id ? (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full items-start sm:items-center">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1 px-3 xs:px-4 sm:px-4 py-2 xs:py-2.5 sm:py-2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-black bg-white outline-none rounded-lg border-2 border-blue-400 focus:border-blue-600 font-medium w-full"
                            autoFocus
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleSaveEdit(curTask.id)}
                              className="flex-1 sm:flex-none px-3 xs:px-4 py-2 xs:py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-semibold rounded-lg text-xs xs:text-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                            >
                              <MdSave className="text-base xs:text-lg" />
                              <span className="hidden xs:inline">Save</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 sm:flex-none px-3 xs:px-4 py-2 xs:py-2.5 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg text-xs xs:text-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                            >
                              <MdClose className="text-base xs:text-lg" />
                              <span className="hidden xs:inline">Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 w-full flex flex-col gap-1">
                            <span
                              className={`text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-[#1c2833] break-words ${
                                curTask.checked ? "line-through opacity-60" : ""
                              }`}
                            >
                              {curTask.content}
                            </span>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className={`${getPriorityColor(curTask.priority)} text-white px-2 py-0.5 rounded text-xs font-semibold`}>
                                {curTask.priority.toUpperCase()}
                              </span>
                              <span className={`${getCategoryColor(curTask.category)} text-white px-2 py-0.5 rounded text-xs font-semibold`}>
                                {curTask.category}
                              </span>
                              {curTask.dueDate && (
                                <span className={`${isOverdue(curTask.dueDate) ? "bg-red-500" : "bg-indigo-500"} text-white px-2 py-0.5 rounded text-xs font-semibold`}>
                                  {new Date(curTask.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              {curTask.recurring !== "none" && (
                                <span className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                  {curTask.recurring}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto justify-end">
                            <button
                              onClick={() => handleCheckedTodo(curTask.id)}
                              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-md hover:shadow-lg"
                              title="Mark as complete"
                            >
                              <MdCheck className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl" />
                            </button>

                            <button
                              onClick={() => handleStartEdit(curTask.id, curTask.content)}
                              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-md hover:shadow-lg"
                              title="Edit task"
                            >
                              <MdEdit className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl" />
                            </button>

                            <button
                              onClick={() => handleDeleteTodo(curTask.id)}
                              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-md hover:shadow-lg"
                              title="Delete task"
                            >
                              <MdDeleteForever className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* ========== Trash Section ========== */
            <div className="w-full">
              {trash.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-medium">
                    Trash is empty
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                  {trash.map((trashItem) => (
                    <li
                      key={trashItem.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 bg-[#f2f3f4] rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl transition-all hover:shadow-lg gap-3 sm:gap-0 opacity-75"
                    >
                      <div className="flex-1">
                        <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-[#1c2833] break-words">
                          {trashItem.content}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleRestoreTask(trashItem.id)}
                          className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-md hover:shadow-lg"
                          title="Restore task"
                        >
                          <MdRestore className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl" />
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(trashItem.id)}
                          className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-md hover:shadow-lg"
                          title="Permanently delete"
                        >
                          <MdDeleteForever className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ========== Clear All Button ========== */}
          {!showTrash && task.length > 0 && (
            <button
              onClick={handleClearButton}
              className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-2xl lg:rounded-3xl transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              Clear All Tasks
            </button>
          )}
        </div>
      </div>
    </div>
  );
};