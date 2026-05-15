# Beauty Lashes CRM Fixes

## Date: 2026-05-15

### Fixed Issues:

1. **Dashboard 404** - Added explicit `/admin/dashboard` route (was only `/admin`)

2. **Clients/Leads 500** - Missing `statuses` and `statusFilter` variables in routes:
   - `/admin/clients` now passes `statuses=["new","contacted","active","inactive","vip"]` and `statusFilter`
   - `/admin/leads` now passes `statuses=["new","contacted","qualified","converted","lost"]` and `statusFilter`

3. **Missing routes** - Added routes for: `/admin/followups`, `/admin/marketing`, `/admin/reports`, `/admin/modules`

4. **Missing route variables**:
   - `/admin/marketing` now passes `tips=[], campaigns=[], referralStats=[], topSources=[]`
   - `/admin/modules` now passes `modules` and `allModules`

5. **Sidebar include fix** - `views/partials` was a symlink to broken path. Replaced with actual copy of `views/admin/partials/` containing `sidebar.ejs`

### Mobile Compliance:
- Dashboard now has inline mobile CSS with `@media(max-width:768px)` and `@media(max-width:480px)`
- Hamburger menu button present
- Sidebar overlay present
- All admin pages (clients, leads, appointments, etc.) already had mobile CSS

### Files Modified on VPS:
- `/var/www/lashes.3nd.dev/app.js` - Routes fixes + added missing routes
- `/var/www/lashes.3nd.dev/views/admin/dashboard.ejs` - Added mobile CSS
- `/var/www/lashes.3nd.dev/views/partials/` - Replaced symlink with actual sidebar files
