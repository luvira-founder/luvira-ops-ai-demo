import requests
import json

response = requests.post(
    "http://localhost:8080/ingest",
    json={
        "service_name": "Test API",
        "error_rate": 0.92,
        "message": "Test message"
    }
)

print("Status:", response.status_code)
print("\nResponse Keys:")
data = response.json()
for key in data.keys():
    print(f"  - {key}")

print("\nChecking for new format fields:")
print(f"  'incident_id' present: {'incident_id' in data}")
print(f"  'risk' present: {'risk' in data}")
print(f"  'knowledge_match' present: {'knowledge_match' in data}")
print(f"  'mode' present: {'mode' in data}")

print("\nChecking for old format fields:")
print(f"  'status' present: {'status' in data}")
print(f"  'risk_score' present: {'risk_score' in data}")

print("\nFull Response:")
print(json.dumps(data, indent=2))
