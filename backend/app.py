from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, os, json
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

API_URL = "https://models.inference.ai.azure.com/chat/completions"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


@app.route("/api/travel-plan", methods=["POST"])
def travel_plan():
    data = request.json
    location = data.get("location", "Not provided")
    days = data.get("days", "1")
    budget = data.get("budget", "Not provided")
    preferences = data.get("preferences", "None")

    # 🔥 STRONG, STRICT PROMPT
    prompt = f"""
    You are a travel planning assistant.

    Return a travel plan in **valid JSON only**, with this exact structure:

    {{
      "budget_breakdown": {{
        "accommodation": {{ "per_day": number, "total": number }},
        "food":          {{ "per_day": number, "total": number }},
        "transport":     {{ "per_day": number, "total": number }},
        "entry_fees":    {{ "per_day": number, "total": number }},
        "misc":          {{ "per_day": number, "total": number }}
      }},
      "itinerary": [
        {{
          "day": number,
          "title": string,
          "places": [string, string, string],
          "food":   [string, string]
        }}
      ]
    }}

    Rules:
    - Always use keys exactly: "budget_breakdown", "itinerary", "day", "title", "places", "food".
    - For each day, "places" must be an array with at least 3 items.
    - For each day, "food" must be an array with at least 2 items.
    - DO NOT include any explanation, markdown, or text outside the JSON.

    Now generate the plan for:

    Location: {location}
    Days: {days}
    Budget: {budget}
    Preferences: {preferences}
    """

    payload = {
        "model": "gpt-4.1",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        reply_text = response.json()["choices"][0]["message"]["content"]
        # print(reply_text)  # <-- you can uncomment this to debug in console

        reply_json = json.loads(reply_text)

        # ✅ Safety: normalise itinerary structure
        itinerary = reply_json.get("itinerary", [])
        if isinstance(itinerary, list):
            for day in itinerary:
                # handle alternative keys if model still misbehaves
                if "places" not in day:
                    if "places_to_visit" in day:
                        day["places"] = day["places_to_visit"]
                    else:
                        day["places"] = []
                if "food" not in day:
                    if "food_suggestions" in day:
                        day["food"] = day["food_suggestions"]
                    else:
                        day["food"] = []

                # ensure they are lists
                if not isinstance(day.get("places"), list):
                    day["places"] = [str(day["places"])]
                if not isinstance(day.get("food"), list):
                    day["food"] = [str(day["food"])]

        return jsonify(reply_json)

    except Exception as e:
        # Fallback error response
        return jsonify({
            "error": "Failed to generate plan",
            "details": str(e)
        }), 500




@app.route("/")
def home():
    return "AI Backend running!"


if __name__ == "__main__":
    app.run(debug=True)
