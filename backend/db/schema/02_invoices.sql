DROP TABLE IF EXISTS invoices CASCADE;

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  description VARCHAR(255),
  status VARCHAR(255) DEFAULT 'draft',
  payment_terms INTEGER NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  business_user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  customer_user_id INTEGER REFERENCES users (id) ON DELETE CASCADE
);