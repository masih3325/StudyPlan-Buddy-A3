import React from "react";
import { Link, useLocation } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const { message, data } = location.state || {};

  return (
    <div className="card confirmation">
      <h2>Study Plan Saved! ✅</h2>
      <p className="success-msg">{message || "Your study plan has been saved successfully."}</p>

      {data && (
        <div className="summary">
          <h3>Summary</h3>
          <p><strong>Student Name:</strong> {data.student_name}</p>
          <p><strong>Course:</strong> {data.course}</p>
          <p><strong>Subject:</strong> {data.subject}</p>
          <p><strong>Deadline:</strong> {data.deadline}</p>
          <p><strong>Hours/Week:</strong> {data.hours_per_week}</p>
        </div>
      )}

      <div className="confirmation-links">
        <Link to="/create" className="btn">Create Another</Link>
        <Link to="/saved" className="btn">View Saved Plans</Link>
      </div>
    </div>
  );
}

export default Confirmation;