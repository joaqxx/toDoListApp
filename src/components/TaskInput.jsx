"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import "./TaskInput.css"

export default function TaskInput({ todoValue, setTodoValue, handleAddTodos }) {
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = () => {
    if (todoValue.trim()) {
      handleAddTodos({
        text: todoValue,
        dueDate: dueDate || null,
      })
      setTodoValue("")
      setDueDate("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="task-input-section">
      <div className="input-container">
        <input
          className="task-input"
          value={todoValue}
          onChange={(e) => setTodoValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
        />
        <input
          className="date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="mm/dd/yyyy"
        />
        <button className="add-task-button" onClick={handleSubmit}>
          <Plus size={16} />
          Add Task
        </button>
      </div>
    </div>
  )
}
