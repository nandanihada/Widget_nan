import os
import json
from flask import Blueprint, request, jsonify
import requests
from integrations import forward_survey_data_to_partners
from mongodb_config import db

# Create blueprint
postback_bp = Blueprint('postback_bp', __name__)


@postback_bp.route('/postback-handler', methods=['GET'])
def handle_postback():
    transaction_id = request.args.get("transaction_id")
    status = request.args.get("status", "confirmed")
    reward = request.args.get("reward", 0)
    currency = request.args.get("currency", "USD")
    sid1 = request.args.get("sid1")
    clicked_at = request.args.get("clicked_at")
    username = request.args.get("username", "unknown")

    if not sid1:
        return jsonify({"error": "Missing required parameter: sid1 (tracking_id)"}), 400

    try:
        # Find matching pending survey response
        response_doc = db["survey_responses"].find_one({
            "tracking_id": sid1,
            "status": "pending"
        })

        if not response_doc:
            return jsonify({"error": "No matching pending survey found"}), 404

        # Update response data with postback information
        update_data = {
            "username": username,
            "transaction_id": transaction_id,
            "reward": reward,
            "currency": currency,
            "clicked_at": clicked_at,
            "status": status
        }

        # Update the document in MongoDB
        db["survey_responses"].update_one(
            {"_id": response_doc["_id"]},
            {"$set": update_data}
        )

        # Get updated response data for forwarding
        response_data = {**response_doc, **update_data}
        
        # Forward to partners
        forward_survey_data_to_partners(response_data)

        # Forward to SurveyTitans
        surveytitans_url = "https://surveytitans.com/track"
        payload = {
            "sid": sid1,
            "responses": response_data.get("responses", {}),
            "email": response_data.get("email", "")
        }

        titan_response = requests.post(surveytitans_url, json=payload)
        print(f"SurveyTitans response: {titan_response.status_code} - {titan_response.text}")

        return jsonify({"message": "Survey forwarded to SurveyTitans"}), 200
    
    except Exception as e:
        print("❌ Error handling postback:", str(e))
        return jsonify({"error": "Internal server error"}), 500