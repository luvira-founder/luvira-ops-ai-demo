import requests
import json

# The URL where your main.py is running
BASE_URL = "http://localhost:8080/ingest"


def run_test(test_name, service, error_rate, message):
    print(f"\n{'='*60}")
    print(f"Running Test: {test_name}")
    print(f"{'='*60}")

    payload = {
        "service_name": service,
        "error_rate": error_rate,
        "message": message
    }

    try:
        response = requests.post(BASE_URL, json=payload)
        data = response.json()

        print(f"✅ Status: {response.status_code}")
        print(f"\n--- Incident Details ---")
        print(f"Incident ID: {data.get('incident_id')}")
        print(f"Analysis: {data.get('analysis')}")

        print(f"\n--- Risk Assessment ---")
        risk = data.get('risk', {})
        print(f"Risk Score: {risk.get('score')}")
        print(f"Threshold: {risk.get('threshold')}")
        print(f"Triggered: {risk.get('triggered')}")

        print(f"\n--- Knowledge Base Match ---")
        kb = data.get('knowledge_match', {})
        print(f"Document: {kb.get('document')}")
        print(f"Similarity: {kb.get('similarity')}")
        print(f"Source: {kb.get('source')}")

        print(f"\n--- Remediation Plan ---")
        plan = data.get('plan', {})
        steps = plan.get('steps', [])
        if steps:
            for i, step in enumerate(steps, 1):
                print(f"  {i}. {step}")
        else:
            print("  No steps generated")

        print(f"\n--- Observability ---")
        obs = data.get('observability', {})
        print(f"Trace ID: {obs.get('trace_id')}")
        print(f"Total Latency: {obs.get('latency_ms')} ms")

        print(f"\n--- Trace Steps ---")
        trace_steps = obs.get('trace_steps', {})
        print(f"  1. ingest_event: {trace_steps.get('ingest_event')} ms")
        print(f"  2. policy_evaluation: {trace_steps.get('policy_evaluation')} ms")
        print(f"  3. kb_retrieval: {trace_steps.get('kb_retrieval')} ms")
        print(f"  4. ai_inference: {trace_steps.get('ai_inference')} ms")

        print(f"\n--- System Status ---")
        print(f"Mode: {data.get('mode')}")
        fallback = data.get('fallback', {})
        print(f"Fallback Used: {fallback.get('used')}")
        if fallback.get('used'):
            print(f"Fallback Reason: {fallback.get('reason')}")

        errors = data.get('errors', [])
        if errors:
            print(f"\n--- Errors ---")
            for error in errors:
                print(f"  ⚠️  {error}")

        print(f"\n--- Full JSON Response ---")
        print(json.dumps(data, indent=2))

    except Exception as e:
        print(f"❌ Error: Could not connect to the server. Is main.py running? \n{e}")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("LUVIRA OPS AI - Backend Test Suite")
    print("Testing Updated Response Contract")
    print("="*60)

    # TEST 1: Normal Traffic (Should NOT trigger AI)
    run_test(
        test_name="TEST 1: Normal Operations (Below Threshold)",
        service="Auth API",
        error_rate=0.12,
        message="System heartbeat normal."
    )

    # TEST 2: Incident Spike (Should TRIGGER AI & Retrieval)
    run_test(
        test_name="TEST 2: Auth API Critical Spike (Above Threshold)",
        service="Auth API",
        error_rate=0.92,
        message="Auth API error rate exceeding 85%"
    )

    # TEST 3: Edge case - exactly at threshold
    run_test(
        test_name="TEST 3: Threshold Boundary Test",
        service="Payment Service",
        error_rate=0.85,
        message="Payment service at threshold"
    )

    print("\n" + "="*60)
    print("Test Suite Complete")
    print("="*60 + "\n")