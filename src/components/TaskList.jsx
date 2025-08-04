
import { useState } from "react"
import { isThisWeek, isThisMonth, isSameDay, isToday, isPast, parseISO, format } from "date-fns" // Import format and isPast
import { Check, Pencil, Trash2 } from "lucide-react"
import "./TaskList.css"

export default function TaskList({
  todos,
  selectedDate,
  timeFilter,
  handleEditTodo,
  handleDeleteTodo,
  handleToggleComplete,
  setSelectedDate, 
}) {
  const filterTodos = (todos) => {
    let filtered = todos

    if (selectedDate) {
      // If a date is selected from the calendar, filter by that specific date
      filtered = filtered.filter((todo) => todo.dueDate && isSameDay(parseISO(todo.dueDate), selectedDate))
    } else {
      // Otherwise, apply the time filter
      switch (timeFilter) {
        case "week":
          filtered = filtered.filter((todo) => todo.dueDate && isThisWeek(parseISO(todo.dueDate), { weekStartsOn: 1 }))
          break
        case "month":
          filtered = filtered.filter((todo) => todo.dueDate && isThisMonth(parseISO(todo.dueDate)))
          break
        case "today":
          filtered = filtered.filter((todo) => todo.dueDate && isToday(parseISO(todo.dueDate)))
          break
      }
    }

    return filtered
  }

  const filteredTodos = filterTodos(todos)

  return (
    <div className="task-list-section">
      <div className="task-list">
        {filteredTodos.length === 0 ? (
          <div className="no-tasks">No tasks found. Create your first task above!</div>
        ) : (
          filteredTodos.map((todo) => (
            <TaskItem
              key={todo.id}
              todo={todo}
              handleEditTodo={handleEditTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleToggleComplete={handleToggleComplete}
            />
          ))
        )}
      </div>
    </div>
  )
}

// New TaskItem component for inline editing
function TaskItem({ todo, handleEditTodo, handleDeleteTodo, handleToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)

  const handleSubmitEdit = () => {
    if (editValue.trim()) {
      handleEditTodo(todo.id, editValue.trim())
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditValue(todo.text) // Revert to original text
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitEdit()
    }
  }

  const getStatusBadge = () => {
    if (todo.completed) return null // Completed tasks don't need a due date badge

    if (!todo.dueDate) {
      return <span className="status-badge no-due-date">No Due Date</span> // New badge for no due date
    }

    const dueDate = parseISO(todo.dueDate)

    // Check if dueDate is a valid date before proceeding with date-fns functions
    if (isNaN(dueDate.getTime())) {
      return <span className="status-badge no-due-date">Invalid Date</span> // Handle invalid dates explicitly
    }

    if (isPast(dueDate) && !isToday(dueDate)) {
      return <span className="status-badge overdue">Overdue</span>
    } else if (isToday(dueDate)) {
      return <span className="status-badge due-today">Due Today</span>
    } else {
      return <span className="status-badge upcoming">Upcoming</span> // Future due dates
    }
  }

  return (
    <div className={`task-item ${todo.completed ? "completed" : ""}`}>
      {isEditing ? (
        <div className="edit-container">
          <input
            className="edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button className="save-button" onClick={handleSubmitEdit}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="task-content">
            <div
              className={`task-checkbox ${todo.completed ? "completed" : ""}`}
              onClick={() => handleToggleComplete(todo.id)}
            >
              {todo.completed && <Check size={12} color="white" />}
            </div>
            <div className={`task-text ${todo.completed ? "completed" : ""}`}>
              {todo.text}
              {todo.dueDate &&
                !todo.completed && ( // Only show due date if not completed
                  <span className="due-date-text"> (Due: {format(parseISO(todo.dueDate), "MMM dd")})</span>
                )}
            </div>
            {getStatusBadge()}
          </div>
          <div className="task-actions">
            <button className="task-action-button" onClick={() => setIsEditing(true)} title="Edit task">
              <Pencil size={14} />
            </button>
            <button className="task-action-button" onClick={() => handleDeleteTodo(todo.id)} title="Delete task">
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
