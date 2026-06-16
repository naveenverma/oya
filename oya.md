# Internal Registry Verification Portal

## Scope of Work & Execution Plan

### Project Overview

Build a secure internal registry portal using Softr and Airtable.

The system will allow a single Super Admin to manage records manually through an administrative dashboard while allowing public users to verify individual records through a controlled lookup process.

Public users must only be able to access records through a direct verification workflow and must never be able to browse, enumerate, or export database contents.

---

# Platform Stack

## Frontend

* Softr

## Backend Database

* Airtable

## Storage

* Airtable Attachments

## Authentication

### Super Admin

* Softr authenticated account
* Full administrative access

### Public Verification Users

* No login required
* Read-only access
* Access limited to a specific record lookup

---

# User Roles

## Role 1: Super Admin

Permissions:

* Create records
* Edit records
* Delete records
* Upload files
* Manage record status
* View all records
* Search all records
* Access dashboard analytics

Restrictions:

* None

---

## Role 2: Public Viewer

Permissions:

* Enter verification/control number
* View matching approved record

Restrictions:

* No login
* No editing
* No downloading database
* No record listing
* No access to other records
* No administrative functions

---

# Database Design

## Registry Records Table

Minimum fields:

1. Record ID
2. Control Number
3. Record Status
4. Record Type
5. Full Name
6. Organization
7. Category
8. Issue Date
9. Expiration Date
10. Verification Status
11. Description
12. Reference Number
13. Country
14. Region
15. Contact Information
16. Notes
17. Attachment 1
18. Attachment 2
19. Attachment 3
20. Created Date

Additional fields may be added during implementation.

---

# Functional Requirements

## FR-001 Record Management

Super Admin shall be able to:

* Create records
* Update records
* Archive records
* Delete records
* Upload supporting files

---

## FR-002 Verification Search

Public users shall:

* Enter control number
* Submit verification request
* Receive matching record if found

If record does not exist:

Display:

"Record not found."

---

## FR-003 Verification Results

Display only approved public fields.

Sensitive internal fields must never be shown publicly.

---

## FR-004 Attachments

System shall support:

* PDF
* PNG
* JPG
* JPEG

Maximum attachment size according to platform limits.

---

## FR-005 Status Workflow

Statuses:

* Draft
* Pending Review
* Approved
* Archived

Only Approved records are publicly viewable.

---

# Security Requirements

## Access Control

Public users:

* Cannot browse records
* Cannot enumerate records
* Cannot access Airtable directly

Admin users:

* Must authenticate before access

---

## Data Protection

* HTTPS enabled
* Airtable permissions configured
* Softr permissions configured
* Admin-only management pages hidden from public users

---

# UI Requirements

## Public Portal

Pages:

### Home

* Portal introduction
* Verification form

### Verification Results

* Record details
* Attachment viewing

### Not Found

* Friendly error page

---

## Admin Portal

Pages:

### Dashboard

* Record statistics

### Records

* Create
* Edit
* Delete

### Attachments

* File management

---

# Deliverables

## Phase 1

Database Foundation

Deliverables:

* Airtable workspace
* Record schema
* Status workflow
* Attachment structure

Acceptance Criteria:

* Records can be created
* Records can be edited
* Records can be deleted

---

## Phase 2

Portal Development

Deliverables:

* Softr frontend
* Verification search
* Results page
* Security configuration

Acceptance Criteria:

* Public search functions correctly
* Only matching records displayed
* Public cannot browse database

---

## Phase 3

Testing & Handover

Deliverables:

* Final testing
* Documentation
* Ownership transfer
* Deployment support

Acceptance Criteria:

* All UAT tests pass
* No open Critical defects
* No open High-severity defects

---

# User Acceptance Testing (UAT)

## UAT-001

Create Record

Expected:
Record saved successfully.

Pass Criteria:
100% success.

---

## UAT-002

Edit Record

Expected:
Changes persist after refresh.

Pass Criteria:
100% success.

---

## UAT-003

Delete Record

Expected:
Record removed from system.

Pass Criteria:
100% success.

---

## UAT-004

Valid Verification Search

Expected:
Correct record displayed.

Pass Criteria:
100% success.

---

## UAT-005

Invalid Verification Search

Expected:
Record not found message.

Pass Criteria:
100% success.

---

## UAT-006

Unauthorized Access

Expected:
Admin pages inaccessible.

Pass Criteria:
100% success.

---

## UAT-007

Attachment Viewing

Expected:
Attachments load correctly.

Pass Criteria:
100% success.

---

# Quality Assurance Requirements

Before final delivery:

* Complete functional testing
* Complete permission testing
* Complete workflow testing
* Complete UAT execution
* Fix all Critical defects
* Fix all High-severity defects
* Fix all Medium defects affecting core workflows

No unresolved defects may block:

* Record creation
* Record editing
* Record verification
* Attachment access
* Ownership transfer

---

# Ownership & Handover

Upon final payment:

* Transfer Softr application ownership
* Transfer Airtable ownership
* Remove developer access
* Deliver configuration documentation
* Deliver database structure documentation
* Deliver workflow documentation

Client retains full ownership of all records, files, configurations, and project assets.
