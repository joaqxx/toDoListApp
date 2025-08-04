"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import "./ToDoInput.css"

export default function TodoInput(props) {
  const { handleAddTodos, todoValue, setTodoValue } = props
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
    <div className="todo-input-section">
      <div className="section-title">
        <Plus size={18} />
        Add New Task
      </div>
      <div className="input-container">
        <div className="input-group">
          <div className="input-row">
            <input
              className="todo-input"
              value={todoValue}
              onChange={(e) => setTodoValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
            />
            <input className="date-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <button className="add-button" onClick={handleSubmit}>
            <Plus size={16} style={{ marginRight: "0.4rem" }} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}
