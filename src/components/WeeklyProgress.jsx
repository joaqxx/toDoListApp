"use client"

import { TrendingUp } from "lucide-react"
import "./WeeklyProgress.css"

export default function WeeklyProgress({ completed, remaining, completionRate }) {
  return (
    <div className="weekly-progress-section">
      <div className="progress-title">
        <TrendingUp size={18} />
        Weekly Progress
      </div>
      <div className="progress-stats">
        <div className="progress-item">
          <div className="progress-item-left">
            <div className="progress-icon completed"></div>
            <span className="progress-label">Completed</span>
          </div>
          <span className="progress-number completed">{completed}</span>
        </div>
        <div className="progress-item">
          <div className="progress-item-left">
            <div className="progress-icon remaining"></div>
            <span className="progress-label">Remaining</span>
          </div>
          <span className="progress-number remaining">{remaining}</span>
        </div>
        <div className="completion-rate">
          <span className="completion-rate-label">Completion Rate</span>
          <span className="completion-rate-value">{completionRate}%</span>
        </div>
      </div>
    </div>
  )
}
