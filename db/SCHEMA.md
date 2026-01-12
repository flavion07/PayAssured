# PayAssured CRM Database Schema

## Tables

### clients
Stores client information for the CRM.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique client identifier |
| name | VARCHAR(255) | NOT NULL, INDEX | Client name |
| email | VARCHAR(255) | NULLABLE | Client email address |
| phone | VARCHAR(20) | NULLABLE | Client phone number |
| company | VARCHAR(255) | NULLABLE | Client company name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, ON UPDATE | Record last update timestamp |

### cases
Stores invoice cases and their follow-up status.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique case identifier |
| client_id | INTEGER | NOT NULL, FOREIGN KEY → clients.id | Reference to client |
| invoice_number | VARCHAR(100) | NOT NULL, INDEX | Invoice number/reference |
| invoice_date | TIMESTAMP | NOT NULL | Date when invoice was issued |
| due_date | TIMESTAMP | NOT NULL, INDEX | Payment due date |
| amount | DECIMAL(15,2) | NOT NULL | Invoice amount in rupees |
| status | ENUM | NOT NULL, INDEX | Case status (New, In Follow-up, Partially Paid, Closed) |
| follow_up_notes | TEXT | NULLABLE | Additional notes for follow-up |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, ON UPDATE | Record last update timestamp |

## Relationships

- One Client can have multiple Cases (1:N)
- Cases are automatically deleted when a Client is deleted (CASCADE)

## Enums

### CaseStatus
- `New`: Initial status for newly created cases
- `In Follow-up`: Case is currently being followed up
- `Partially Paid`: Payment has been partially received
- `Closed`: Case is closed (fully paid or resolved)

## Indexes

- `clients.name` - Quick lookup by client name
- `cases.invoice_number` - Quick lookup by invoice number
- `cases.due_date` - Sorting and filtering by due date
- `cases.status` - Filtering by status
