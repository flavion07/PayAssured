-- PayAssured CRM Database Creation Script
-- Compatible with SQLite and PostgreSQL

CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- SQLite: AUTOINCREMENT, PostgreSQL: SERIAL
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_name ON clients(name);

CREATE TABLE cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- SQLite: AUTOINCREMENT, PostgreSQL: SERIAL
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'New',  -- SQLite compatible: using VARCHAR instead of ENUM
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('New', 'In Follow-up', 'Partially Paid', 'Closed'))  -- Enforce enum values
);

CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_invoice_number ON cases(invoice_number);
CREATE INDEX idx_cases_due_date ON cases(due_date);
CREATE INDEX idx_cases_status ON cases(status);

-- Sample data
INSERT INTO clients (name, email, phone, company) VALUES
    ('Acme Corporation', 'contact@acme.com', '+91-9876543210', 'Acme Corp'),
    ('Tech Solutions Ltd', 'info@techsol.com', '+91-8765432109', 'Tech Solutions'),
    ('Global Industries', 'sales@globalinc.com', '+91-7654321098', 'Global Inc');
