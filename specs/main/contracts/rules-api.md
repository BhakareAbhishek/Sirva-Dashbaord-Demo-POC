# Rules & Rule Templates API (`/v1/rules`, `/v1/rule-templates`)

**Purpose**: Rule and rule template CRUD; templates applied to multiple widgets (FR-008, FR-009).

## Endpoints

### Rule Templates

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/rule-templates | List templates |
| GET | /v1/rule-templates/:id | Get template |
| POST | /v1/rule-templates | Create (admin) |
| PATCH | /v1/rule-templates/:id | Update (admin) |
| GET | /v1/rule-templates/:id/widgets | Widgets using this template |

### Rules

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/rules | List rules; filters: widgetId, templateId, isActive |
| GET | /v1/rules/:id | Get rule |
| POST | /v1/rules | Create rule (or from template) |
| PATCH | /v1/rules/:id | Update conditions, priority, isActive |
| DELETE | /v1/rules/:id | Deactivate or remove |

## Request/Response (examples)

**POST /v1/rule-templates**

- Body: `{ name, conditions: RuleCondition[], priority? }`
- Response: `201` with `RuleTemplate`

**POST /v1/rules**

- Body: `{ name, templateId?, conditions, priority, widgetIds }`
- Response: `201` with `Rule`

**RuleCondition** (structure): `{ type: string, operator: string, value: string | string[] }` — e.g. segment, channel, locale, geography, schedule.

## Errors

- `400` — Invalid conditions or priority
- `403` — Admin-only for templates; vendor scope for rules
- `404` — Template or rule not found
