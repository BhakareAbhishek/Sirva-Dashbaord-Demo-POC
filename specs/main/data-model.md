# Data Model: Sirva CMS Marketplace Platform

**Branch**: `main` | **Date**: 2026-03-13  
**Source**: Feature spec entities and requirements; TypeScript interfaces in `src/app/models/`.

---

## 1. Vendor

| Field | Type | Description |
|-------|------|--------------|
| id | string | Unique identifier |
| name | string | Display name |
| status | VendorStatus | onboarding \| active \| suspended \| expired |
| profile | VendorProfile | Contact, tier, metadata |
| governanceTier | string | Policy tier (e.g. standard, premium) |
| createdAt | string (ISO 8601) | Creation timestamp |
| updatedAt | string (ISO 8601) | Last update |

**VendorProfile**: email, contactName, companyName?, logoUrl?, settings?.

**Validation**: name required; status transitions governed by workflow (e.g. suspended → active only by admin).

---

## 2. Widget

| Field | Type | Description |
|-------|------|--------------|
| id | string | Unique identifier |
| vendorId | string | Owning vendor |
| type | WidgetType | banner \| promo-card \| cta \| ... |
| title | string | Display title |
| content | WidgetContent | Creative payload (copy, media, CTA) |
| ruleIds | string[] | Applied rule/template IDs |
| status | PublicationStatus | draft \| submitted \| approved \| rejected \| published \| archived |
| version | number | Version number for history |
| landingPageId | string? | Linked landing page |
| createdAt | string (ISO 8601) | |
| updatedAt | string (ISO 8601) | |
| submittedAt | string? | When submitted for approval |
| approvedAt | string? | When approved |
| publishedAt | string? | When published |

**WidgetContent**: type-specific (headline, body, imageUrl, ctaLabel, ctaUrl, etc.).

**State transitions**: draft → submitted → approved/rejected; approved → published → archived. Rejected → draft.

---

## 3. Landing Page

| Field | Type | Description |
|-------|------|--------------|
| id | string | Unique identifier |
| vendorId | string | Owning vendor |
| title | string | Page title |
| slug | string | URL slug |
| content | LandingPageContent | Sections (rich text, media, etc.) |
| linkedWidgetIds | string[] | Widgets that link to this page |
| status | PublicationStatus | Aligned with linked widget workflow where applicable |
| version | number | |
| createdAt | string (ISO 8601) | |
| updatedAt | string (ISO 8601) | |

**Validation**: At least one section; slug unique per vendor. If a widget references a landing page, that page must be published or in same submission.

---

## 4. Rule & Rule Template

**Rule**

| Field | Type | Description |
|-------|------|--------------|
| id | string | Unique identifier |
| name | string | Display name |
| templateId | string? | Parent rule template (if any) |
| conditions | RuleCondition[] | Audience, context, schedule, etc. |
| priority | number | Evaluation order (higher = higher priority) |
| widgetIds | string[] | Widgets this rule applies to |
| isActive | boolean | |
| createdAt | string (ISO 8601) | |
| updatedAt | string (ISO 8601) | |

**RuleTemplate**

| Field | Type | Description |
|-------|------|--------------|
| id | string | Unique identifier |
| name | string | Template name (e.g. Mobile-only, Geography, Persona) |
| conditions | RuleCondition[] | Reusable condition set |
| priority | number | Default priority when applied |
| createdAt | string (ISO 8601) | |
| updatedAt | string (ISO 8601) | |

**RuleCondition**: type (e.g. segment, channel, locale, geography, schedule), operator, value(s). Structure defined in contracts for API consistency.

**Validation**: Priority ≥ 0; tie-breakers defined in governance (e.g. templateId, then createdAt).

---

## 5. Publication Submission

| Field | Type | Description |
|-------|------|--------------|
| id | string | Unique identifier |
| vendorId | string | Submitting vendor |
| widgetId | string | Widget in submission |
| landingPageId | string? | Linked landing page |
| status | submission \| approved \| rejected |
| submittedAt | string (ISO 8601) | |
| reviewedAt | string? | |
| reviewedBy | string? | Administrator user id |
| comments | string? | Approval/rejection feedback |
| version | number | Widget/landing version at submission |

**State**: submitted → approved or rejected. On approval, widget/landing status moves to approved/published per workflow.

---

## 6. Analytics Event

| Field | Type | Description |
|-------|------|--------------|
| id | string | Event id |
| type | EventType | impression \| click \| lead \| conversion |
| widgetId | string | |
| vendorId | string | |
| campaignId | string? | |
| audienceSegment | string? | |
| channel | string? | web \| mobile |
| occurredAt | string (ISO 8601) | |
| metadata | Record<string, unknown>? | Extra context |

**Aggregates**: Used for reporting by time range, vendor, widget, campaign, segment (FR-014, FR-015).

---

## 7. AI Recommendation

| Field | Type | Description |
|-------|------|--------------|
| id | string | |
| widgetId | string? | Related widget (if any) |
| type | suggestion \| personalization | Content suggestion vs. optimization recommendation |
| title | string | Short label |
| description | string | Rationale / expected impact |
| payload | Record<string, unknown>? | Suggested copy, audience, etc. (advisory only) |
| createdAt | string (ISO 8601) | |

**Governance**: Advisory only; no auto-apply to publish (constitution).

---

## 8. API Response Envelopes

**Generic list response**

- `data: T[]`
- `pagination?: { page, pageSize, totalCount, totalPages }`
- `meta?: { requestId, timestamp }`
- `errors?: { code, message, details? }[]`

**Widget delivery response** (FR-029, FR-030)

- `requestMetadata`: requestId, context (user/segment, channel, locale, time), timestamp
- `deliveryStatus`: success \| partial \| no_content
- `widgets`: WidgetDeliveryItem[] (approved, rule-qualified only)
- `pagination?: { ... }` when applicable
- `errors?: ...` when request invalid or partial; success with empty `widgets` when no eligible content

**WidgetDeliveryItem**: subset of widget + landing URL, tracking params, etc., for consumption by Sirva applications.

---

## 9. State Transitions (Summary)

- **Vendor**: onboarding → active (admin approval); active ↔ suspended; active → expired.
- **Widget / Landing**: draft → submitted → approved | rejected; approved → published → archived. Rejected → draft.
- **Submission**: submitted → approved | rejected.

All transitions auditable (author, timestamp, optional comment) per FR-007, FR-010.
