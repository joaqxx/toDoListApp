"use client"

import { useState } from "react"
import { format, isToday, isPast, parseISO } from "date-fns"
import { Pencil, Trash2, Check, Calendar } from "lucide-react"
import "./ToDoCard.css"

export default function TodoCard(props) {
  const { todo, handleDeleteTodo, handleEditTodo, handleToggleComplete } = props
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)

  const handleSubmit = () => {
    handleEditTodo(todo.id, editValue)
    setIsEditing(false)
  }

  const getStatusBadge = () => {
    if (!todo.dueDate) return null

    const dueDate = parseISO(todo.dueDate)

    if (isPast(dueDate) && !isToday(dueDate) && !todo.completed) {
      return <span className="status-badge overdue">Overdue</span>
    } else if (isToday(dueDate) && !todo.completed) {
      return <span className="status-badge due-today">Due Today</span>
    } else if (!todo.completed) {
      return <span className="status-badge upcoming">Upcoming</span>
    }
    return null
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className={`todo-card ${todo.completed ? "completed" : ""}`}>
      {isEditing ? (
        <div className="edit-container">
          <input
            className="edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button className="save-button" onClick={handleSubmit}>
            Save
          </button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                className="todo-checkbox"
              />
              <div className="checkbox-custom">{todo.completed && <Check size={12} color="white" />}</div>
            </div>
            <div className="todo-text-container">
              <p className={`todo-text ${todo.completed ? "completed-text" : ""}`}>{todo.text}</p>
              {todo.dueDate && (
                <p className="due-date">
                  <Calendar size={12} />
                  Due: {format(parseISO(todo.dueDate), "MMM dd, yyyy")}
                </p>
              )}
            </div>
            {getStatusBadge()}
          </div>
          <div className="actions-container">
            <button className="action-button edit-button" onClick={() => setIsEditing(true)} title="Edit task">
              <Pencil size={14} />
            </button>
            <button
              className="action-button delete-button"
              onClick={() => handleDeleteTodo(todo.id)}
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
