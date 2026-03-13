# Local API Setup Guide

This guide explains how to run the Sirva Dashboard application with a local mock API backend using JSON Server.

## Overview

The application now includes a complete local backend setup that simulates all the required API endpoints for the Sirva CMS Marketplace Platform. This allows you to develop and test the frontend without depending on a real backend.

## Architecture

### Backend (JSON Server)
- **Technology**: json-server (REST API mock server)
- **Port**: 3000
- **Base URL**: `http://localhost:3000/api`
- **Data Source**: `db.json` (root directory)
- **Routes Configuration**: `routes.json` (root directory)

### Frontend (Angular)
- **Port**: 4200 (default)
- **Environment Config**: `src/environments/`
- **API BaseURL**: Configured via environment files

## Available API Endpoints

All endpoints are automatically available through JSON Server:

### Dashboard API
- `GET /api/dashboard/summary` - Get dashboard summary with KPIs, analytics, and activity

### Vendors API
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `PATCH /api/vendors/:id` - Partial update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Widgets API
- `GET /api/widgets` - List all widgets
- `GET /api/widgets/:id` - Get widget by ID
- `POST /api/widgets` - Create widget
- `PUT /api/widgets/:id` - Update widget
- `PATCH /api/widgets/:id` - Partial update widget
- `DELETE /api/widgets/:id` - Delete widget

### Landing Pages API
- `GET /api/landing-pages` - List all landing pages
- `GET /api/landing-pages/:id` - Get landing page by ID
- `POST /api/landing-pages` - Create landing page
- `PUT /api/landing-pages/:id` - Update landing page
- `DELETE /api/landing-pages/:id` - Delete landing page

### Analytics API
- `GET /api/analytics` - List analytics data
- `GET /api/analytics/:id` - Get specific analytics entry

### Approvals API
- `GET /api/approvals` - List all approvals
- `GET /api/approvals/:id` - Get approval by ID
- `POST /api/approvals` - Create approval request
- `PATCH /api/approvals/:id` - Update approval status

### Rules API
- `GET /api/rules` - List all rules
- `GET /api/rules/:id` - Get rule by ID
- `POST /api/rules` - Create rule
- `PUT /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule

## Query Features

JSON Server provides powerful query capabilities out of the box:

### Filtering
```bash
# Get active vendors only
GET /api/vendors?status=active

# Get approved widgets
GET /api/widgets?status=approved

# Multiple filters
GET /api/widgets?status=approved&vendorId=vendor-1
```

### Pagination
```bash
# Get first 10 vendors
GET /api/vendors?_page=1&_limit=10

# Get next 10 vendors
GET /api/vendors?_page=2&_limit=10
```

### Sorting
```bash
# Sort vendors by name ascending
GET /api/vendors?_sort=name&_order=asc

# Sort widgets by createdAt descending
GET /api/widgets?_sort=createdAt&_order=desc

# Multiple sort fields
GET /api/widgets?_sort=status,createdAt&_order=asc,desc
```

### Full-text Search
```bash
# Search vendors by name
GET /api/vendors?q=Global

# Search widgets
GET /api/widgets?q=Relocation
```

### Relationships
```bash
# Get vendor with all their widgets
GET /api/vendors/vendor-1?_embed=widgets

# Get widget with vendor info
GET /api/widgets/w-101?_expand=vendor
```

## Running the Application

### Option 1: Run Both Together (Recommended)
Run both the API server and Angular app with a single command:

```bash
npm run start:with-api
```

This will start:
- JSON Server on `http://localhost:3000`
- Angular app on `http://localhost:4200`

### Option 2: Run Separately
Useful when you need more control or want to restart services independently.

**Terminal 1 - API Server:**
```bash
npm run api
```

**Terminal 2 - Angular App:**
```bash
npm start
```

## Testing the API

### Using Browser
Open your browser and navigate to:
- Dashboard Summary: `http://localhost:3000/api/dashboard/summary`
- Vendors List: `http://localhost:3000/api/vendors`
- Widgets List: `http://localhost:3000/api/widgets`

### Using PowerShell
```powershell
# Test dashboard endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/summary" -Method Get

# Test vendors endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/vendors" -Method Get

# Get specific vendor
Invoke-RestMethod -Uri "http://localhost:3000/api/vendors/vendor-1" -Method Get

# Create new vendor
$body = @{
    name = "New Vendor Inc"
    status = "pending"
    email = "contact@newvendor.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/vendors" -Method Post -Body $body -ContentType "application/json"
```

### Using curl
```bash
# Test dashboard endpoint
curl http://localhost:3000/api/dashboard/summary

# Test vendors endpoint
curl http://localhost:3000/api/vendors

# Get specific vendor
curl http://localhost:3000/api/vendors/vendor-1

# Create new vendor
curl -X POST http://localhost:3000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{"name":"New Vendor Inc","status":"pending","email":"contact@newvendor.com"}'
```

## Configuration Files

### Environment Configuration

**Development (`src/environments/environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 10000,
  autoRefreshInterval: 60000
};
```

**Production (`src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',  // Will use same domain as frontend
  apiTimeout: 10000,
  autoRefreshInterval: 60000
};
```

### Database File (`db.json`)

The `db.json` file contains all mock data. It includes:
- 1 dashboard summary object
- 5 vendors
- 8 widgets
- 7 landing pages
- 2 analytics entries
- 3 approval records
- 3 rules

You can modify this file directly while the server is running, and changes will be reflected immediately.

### Routes Configuration (`routes.json`)

Maps clean API paths to JSON Server's resource paths:
```json
{
  "/api/dashboard/summary": "/dashboard/summary",
  "/api/vendors": "/vendors",
  "/api/vendors/:id": "/vendors/:id",
  ...
}
```

## Testing Different Scenarios

### Test Loading States
The API server has a 500ms delay configured to simulate network latency. You can see loading states in action.

### Test Error Handling
Stop the API server (Ctrl+C in the API terminal) and observe how the Angular app handles the error state.

### Test Timeout (10 seconds)
Change the delay in `package.json`:
```json
"api": "json-server --watch db.json --routes routes.json --port 3000 --delay 12000"
```

Then restart the API server. The app will timeout and show the error state.

### Test Auto-Refresh
The dashboard automatically refreshes every 60 seconds. You can modify data in `db.json` and see updates on the next refresh cycle.

### Test Manual Refresh
Click the refresh button in the dashboard to trigger an immediate data fetch.

## Data Persistence

**Important:** JSON Server stores data in memory based on `db.json`. Changes made through the API are persisted to the file automatically, but:

1. **Persistence**: Changes are written to `db.json` and survive app restarts
2. **Reset Data**: To reset to original data, restore `db.json` from version control

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution:** Change the port in `package.json`:
```json
"api": "json-server --watch db.json --routes routes.json --port 3001 --delay 500"
```

Then update `src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3001/api'
```

### Issue: API not responding
**Solution:** Check if the API server is running:
```bash
npm run api
```

### Issue: CORS errors
**Solution:** JSON Server automatically handles CORS for local development. If you still see issues, ensure you're using `http://localhost:3000` (not `127.0.0.1`).

### Issue: Changes to db.json not reflecting
**Solution:** JSON Server watches the file automatically. If changes don't appear:
1. Save the file properly
2. Check the API terminal for any errors
3. Restart the API server: `Ctrl+C` then `npm run api`

## Mock Data Overview

### Dashboard Summary
- 120 vendors onboarded
- 47 active widgets
- 8 pending approvals
- 2,140 leads captured
- Analytics with 6 months of impressions/clicks data
- Widget performance trends for 3 widgets
- Geographic engagement across 5 regions
- 5 recent activity entries

### Vendors (5 total)
- 3 active vendors
- 1 pending vendor
- 1 suspended vendor
- Mix of premium and standard tiers

### Widgets (8 total)
- 5 approved widgets
- 1 pending widget
- 1 draft widget
- 1 rejected widget

### Landing Pages (7 total)
- 5 published landing pages
- 2 draft landing pages
- Each linked to corresponding widgets

## Production Deployment

When deploying to production:

1. **Remove json-server**: It's a dev dependency and won't be deployed
2. **Update API URL**: The production environment uses `/api` which should be your real backend
3. **Backend Implementation**: Replace JSON Server with actual backend (Node.js, .NET, Java, etc.)
4. **API Contract**: The API contracts defined in `specs/002-admin-dashboard/contracts/` should be implemented by your real backend

## Next Steps

1. ✅ Local mock API is ready
2. ✅ Frontend is configured to use environment-based API URLs
3. ✅ All dashboard endpoints are available
4. 🔲 Implement remaining dashboard components
5. 🔲 Connect widgets, vendors, and other modules to their respective endpoints
6. 🔲 Replace JSON Server with real backend when ready

## Support

For questions or issues:
1. Check this guide
2. Review the spec files in `specs/002-admin-dashboard/`
3. Check API contracts in `specs/002-admin-dashboard/contracts/`
4. Review the main README.md for project setup

---

**Happy Coding! 🚀**
