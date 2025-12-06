# Harithon 2025 — IoT E-Waste Collection (Full App)

## What is inside
- `apps/web` — Next.js single-page web app (Agency Dashboard / Landing page)
- `services/api` — Node.js + Express API (MQTT bridge, REST endpoints)
- `infra` — docker-compose with MongoDB, Postgres, Mosquitto, and api service
- `infra/mqtt/simulator` — MQTT simulator to publish fake bin telemetry

## Quickstart (local using Docker)
1. Copy `.env.example` to `.env` in repo root and fill `GOOGLE_MAPS_API_KEY` and `JWT_SECRET`.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. API will be at `http://localhost:4000`. Next.js app will be at `http://localhost:3000`.
4. Start simulator (optional):
   ```bash
   docker-compose exec api node src/infra-mqtt-simulator/publish.js
   ```

## Notes
- This is a starter full-stack repo for hackathon demos. It is ready to push to GitHub.
