# Contracts: Platform Admin Dashboard

This directory defines interface contracts for the Dashboard feature module.

## Files

- `dashboard-api.md`: REST contract for `/api/dashboard/summary` consumed by `DashboardService`.

## Contract Principles

- Response envelope is standardized as `{ status, data, meta }`.
- Contract is frontend-consumable and framework-aligned with Angular typed models.
- Timeout behavior and partial response behavior are explicit to support resilient section-level rendering.
