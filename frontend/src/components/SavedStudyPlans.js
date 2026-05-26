import React, { useState, useEffect } from "react";
import { getStudyPlans, deleteStudyPlan } from "../services/api";

function SavedStudyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function fetchPlans() {
    try {
      setLoading(true);
      setError("");

      const result = await getStudyPlans();

      if (result.error) {
        setError(result.error);
      } else {
        setPlans(result.data || []);
      }
    } catch (err) {
      setError("Failed to load study plans. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this study plan?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteStudyPlan(id);

      setPlans((currentPlans) =>
        currentPlans.filter((plan) => plan.id !== id)
      );
    } catch (err) {
      alert("Failed to delete study plan.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p>Loading study plans...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Saved Study Plans</h2>

      {error && <p className="error-msg">{error}</p>}

      {plans.length === 0 && !error && (
        <p>No study plans found. Create one first!</p>
      )}

      {plans.length > 0 && (
        <div className="plans-list">
          {plans.map((plan, index) => (
            <div className="plan-item" key={plan.id || index}>
              <h3>{plan.student_name}</h3>

              <p>
                <strong>Course:</strong> {plan.course}
              </p>

              <p>
                <strong>Subject:</strong> {plan.subject}
              </p>

              <p>
                <strong>Deadline:</strong> {plan.deadline}
              </p>

              <p>
                <strong>Hours/Week:</strong> {plan.hours_per_week}
              </p>

              {plan.created_at && (
                <p className="created-at">
                  Created: {new Date(plan.created_at).toLocaleString()}
                </p>
              )}

              <button
                className="btn-delete"
                onClick={() => handleDelete(plan.id)}
                disabled={deletingId === plan.id}
                style={{
                  marginTop: "10px",
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                {deletingId === plan.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedStudyPlans;