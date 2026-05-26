import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveStudyPlan } from "../services/api";

function CreateStudyPlan({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_name: "",
    course: "",
    subject: "",
    deadline: "",
    hours_per_week: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const result = await saveStudyPlan(formData);
      if (result.error) {
        setError(result.error);
      } else {
        navigate("/confirmation", {
          state: { message: result.message, data: formData },
        });
      }
    } catch (err) {
      setError("Failed to save study plan. Is the backend running?");
    }
  }

  return (
    <div className="card">
      <h2>Create Study Plan</h2>
      {user && <p className="logged-in">Logged in as: {user.email}</p>}

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label>Course:</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g. BUS4012"
            required
          />
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Business Strategy"
            required
          />
        </div>

        <div className="form-group">
          <label>Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Study Hours Per Week:</label>
          <input
            type="number"
            name="hours_per_week"
            value={formData.hours_per_week}
            onChange={handleChange}
            placeholder="e.g. 10"
            min="1"
            required
          />
        </div>

        <button type="submit" className="btn">
          Save Study Plan
        </button>
      </form>
    </div>
  );
}

export default CreateStudyPlan;