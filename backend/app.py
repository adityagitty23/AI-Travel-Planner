from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, os, json
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

API_URL = "https://models.inference.ai.azure.com/chat/completions"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

@app.route("/api/travel-plan", methods=["POST", "OPTIONS"])
def travel_plan():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json
    location = data.get("location", "Not provided")
    days = data.get("days", "1")
    budget = data.get("budget", "Not provided")
    preferences = data.get("preferences", "None")

    prompt = f"""
    You are a travel planning assistant.
    Return valid JSON only.
    Format:
    {{
      "budget_breakdown": {{
        "accommodation": {{ "per_day": number, "total": number }},
        "food": {{ "per_day": number, "total": number }},
        "transport": {{ "per_day": number, "total": number }},
        "entry_fees": {{ "per_day": number, "total": number }},
        "misc": {{ "per_day": number, "total": number }}
      }},
      "itinerary": [
        {{
          "day": number,
          "title": "string",
          "places": ["list"],
          "food": ["list"]
        }}
      ]
    }}
    Ensure response is valid JSON and contains no text outside curly braces.
    Location: {location}, Days: {days}, Budget: {budget}, Preferences: {preferences}
    """

    payload = {
        "model": "gpt-4.1",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post(
            API_URL,
            headers={"Authorization": f"Bearer {GITHUB_TOKEN}", "Content-Type": "application/json"},
            json=payload
        )

        reply_text = response.json()["choices"][0]["message"]["content"]
        return jsonify(json.loads(reply_text))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return jsonify({"server": "running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))