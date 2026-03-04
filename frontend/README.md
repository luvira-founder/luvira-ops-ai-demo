# Frontend
# Luvira Ops AI Demo Flow

This document defines the expected behavior of the demo.

The demo must show the deterministic incident response pipeline built on DigitalOcean Gradient AI.

## Demo Sequence

1. User clicks **Simulate Incident Spike**

2. Backend receives simulated log input via `/ingest`

3. Deterministic policy engine evaluates risk score

4. If risk >= threshold
   - Agent is triggered

5. Agent retrieves SOP from Gradient Knowledge Base

6. Agent generates structured remediation plan using Gradient Serverless Inference

7. Response returns structured JSON including:
   - risk score
   - triggered status
   - remediation steps
   - trace ID
   - latency metrics

8. Frontend displays the result in the Mission Control dashboard.

## Visual Pipeline

The UI should clearly display:

Ingest → Analyze → Decide → Retrieve → Plan

## Goal

Demonstrate deterministic, traceable infrastructure intelligence using DigitalOcean Gradient AI.
