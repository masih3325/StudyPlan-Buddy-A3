const API_BASE_URL = "https://studyplan-buddy-backend.onrender.com";

export async function createStudyPlan(studyPlan) {
  const response = await fetch(`${API_BASE_URL}/api/study-plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studyPlan),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Save error:", errorText);
    throw new Error("Failed to save study plan. Is the backend running?");
  }

  return response.json();
}

export async function getStudyPlans() {
  const response = await fetch(`${API_BASE_URL}/api/study-plans`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fetch error:", errorText);
    throw new Error("Failed to fetch study plans");
  }

  return response.json();
}

export const saveStudyPlan = createStudyPlan;