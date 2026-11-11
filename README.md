# Occupational Health Workbench

A React proof of concept for creating occupational health role profiles, assessing role hazards, calculating risk scores, generating rule-based recommendations, and routing profiles for clinical review.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```sh
npm install
npm run dev
```

## Validate

```sh
npm run build
npm run lint
```

## Included workflows

- Dashboard metrics for created, submitted, and pending profiles
- Profile list, search, details, and editing
- Five-step role profile wizard
- Automatic hazard generation from selected role categories
- Control and exposure-frequency risk scoring
- Functional assessment level assignment
- Mock rule-based clinical recommendations
- Clinical review actions: approve, request clarification, or specialist review
- Hazard catalogue and seeded Maintenance Technician scenario

All data is mocked and held in memory. The application does not use a database, API, authentication, or persistence. Recommendations are demonstrations only and are not clinical advice.
