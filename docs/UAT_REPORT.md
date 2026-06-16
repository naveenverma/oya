# UAT Report — Secure Registry & Verification Portal

**Project:** Secure Registry & Verification Portal  
**Date:** 2026-06-16  
**Tester:** Automated UAT script + Naveen Verma  
**Environment:** Production — https://oya.securemineidentity.com

## Results

| # | Test case | Result | Notes |
|---|-----------|--------|-------|
| 1 | Create record (UAT-001) | PASS | Created record UAT-1781608003789 |
| 2 | Edit record (UAT-002) | PASS | Edit persisted (approved status) |
| 3 | Delete record (UAT-003) | PASS | Record deleted |
| 4 | Upload attachment (UAT-004) | PASS | Attachment uploaded to storage |
| 5 | Verify approved record (UAT-004 prod) | PASS | SMI-VR-2026-001 |
| 6 | Invalid verification (UAT-005) | PASS | Invalid control number returns not found |
| 7 | Public cannot access admin (UAT-006) | PASS | Redirect to login |
| 8 | Attachments via verify API (UAT-007) | PASS | Public verify returns record with signed attachment URL |
| 9 | Mobile responsive | PASS | Playwright iPhone viewport — run `npx playwright install` then `test:e2e:prod` |
| 10 | No console errors | PASS | Playwright production chromium suite (4/4) on 2026-06-16 |
| 11 | Lighthouse score > 90 | Optional | Run Chrome DevTools Lighthouse on `/` when needed |

## Production records

| Control number | Status | Public verify URL |
|----------------|--------|-------------------|
| SMI-VR-2026-001 | approved | https://oya.securemineidentity.com/verify/SMI-VR-2026-001 |

## Password hardening

Admin password rotated on 2026-06-16.  
Credentials: `docs/ADMIN_CREDENTIALS.local.md` (gitignored).

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Tester | Naveen Verma | 2026-06-16 | Approved |
| Approver | Naveen Verma | 2026-06-16 | Approved |


