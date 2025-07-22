import requests
import json

# Test the edit survey endpoint
survey_id = "6683ec22-542f-4507-a357-587e9b501971"
base_url = "http://localhost:5000"

# Test data to update the survey
update_data = {
    "title": "Updated Survey Title",
    "subtitle": "Updated description",
    "questions": [
        {
            "id": "q1",
            "question": "How are you feeling today?",
            "type": "rating",
            "required": True
        },
        {
            "id": "q2", 
            "question": "What's your favorite color?",
            "type": "multiple_choice",
            "options": ["Red", "Blue", "Green", "Yellow"],
            "required": False
        }
    ]
}

print(f"Testing edit survey endpoint for ID: {survey_id}")
print(f"Update data: {json.dumps(update_data, indent=2)}")

# Make the PUT request
response = requests.put(
    f"{base_url}/survey/{survey_id}/edit",
    json=update_data,
    headers={"Content-Type": "application/json"}
)

print(f"\nResponse status: {response.status_code}")
print(f"Response body: {response.text}")

if response.status_code == 200:
    print("✅ Survey updated successfully!")
    
    # Verify the update by fetching the survey
    verify_response = requests.get(f"{base_url}/survey/{survey_id}/view")
    if verify_response.status_code == 200:
        updated_survey = verify_response.json()
        print(f"\n✅ Verification successful!")
        print(f"Updated title: {updated_survey.get('title', 'No title')}")
        print(f"Updated subtitle: {updated_survey.get('subtitle', 'No subtitle')}")
        print(f"Questions count: {len(updated_survey.get('questions', []))}")
    else:
        print(f"❌ Verification failed: {verify_response.status_code}")
else:
    print(f"❌ Update failed: {response.status_code}")
    print(f"Error details: {response.text}")
