"use client"

import { Filter } from "lucide-react"
import "./TimeFilter.css"

export default function TimeFilter({ timeFilter, setTimeFilter, setSelectedDate }) {
  const handleFilterChange = (newFilter) => {
    setTimeFilter(newFilter)
    setSelectedDate(null) // Clear selected date when time filter changes
  }

  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ]

  return (
    <div className="filter-section">
      <div className="filter-container">
        <div className="filter-header">
          <div className="filter-title">
            <Filter size={18} />
            Filter Tasks
          </div>
        </div>
        <div className="filter-options">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-option ${timeFilter === option.value ? "active" : ""}`}
              onClick={() => handleFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
