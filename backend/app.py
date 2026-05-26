import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()

app = Flask(__name__)

# Allow requests from any browser/device
CORS(app, resources={r"/*": {"origins": "*"}})

# Supabase credentials from .env
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "").strip()

# Safety check
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in the .env file")

# This prevents the common mistake of adding /rest/v1 inside .env
if SUPABASE_URL.endswith("/rest/v1"):
    SUPABASE_URL = SUPABASE_URL.replace("/rest/v1", "")

SUPABASE_TABLE_URL = f"{SUPABASE_URL}/rest/v1/study_plans"

print("Connected Supabase URL:", SUPABASE_URL)
print("Supabase Table API:", SUPABASE_TABLE_URL)


def supabase_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "StudyPlan Buddy v2 API is running",
        "supabase_url": SUPABASE_URL,
        "table_endpoint": SUPABASE_TABLE_URL
    }), 200


@app.route("/api/test", methods=["GET"])
def test_api():
    return jsonify({
        "message": "Frontend can reach backend"
    }), 200


@app.route("/api/study-plans", methods=["POST"])
def create_study_plan():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    required_fields = [
        "student_name",
        "course",
        "subject",
        "deadline",
        "hours_per_week"
    ]

    for field in required_fields:
        if field not in data or data[field] in ["", None]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    try:
        payload = {
            "student_name": data["student_name"],
            "course": data["course"],
            "subject": data["subject"],
            "deadline": data["deadline"],
            "hours_per_week": int(data["hours_per_week"]),
        }

        response = requests.post(
            SUPABASE_TABLE_URL,
            json=payload,
            headers=supabase_headers()
        )

        if response.status_code in [200, 201]:
            return jsonify({
                "message": "Study plan saved successfully",
                "data": response.json()
            }), 201

        return jsonify({
            "error": f"Supabase error: {response.status_code}",
            "detail": response.text,
            "url_used": SUPABASE_TABLE_URL
        }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/study-plans", methods=["GET"])
def get_study_plans():
    try:
        response = requests.get(
            SUPABASE_TABLE_URL,
            headers=supabase_headers(),
            params={
                "select": "*",
                "order": "created_at.desc"
            }
        )

        if response.status_code == 200:
            return jsonify({"data": response.json()}), 200

        return jsonify({
            "error": f"Supabase error: {response.status_code}",
            "detail": response.text,
            "url_used": SUPABASE_TABLE_URL
        }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/study-plans/<int:plan_id>", methods=["DELETE"])
def delete_study_plan(plan_id):
    try:
        response = requests.delete(
            f"{SUPABASE_TABLE_URL}?id=eq.{plan_id}",
            headers=supabase_headers()
        )

        if response.status_code in [200, 204]:
            return jsonify({
                "message": "Study plan deleted successfully"
            }), 200

        return jsonify({
            "error": f"Supabase error: {response.status_code}",
            "detail": response.text
        }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)