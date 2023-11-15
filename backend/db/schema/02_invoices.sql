DROP TABLE IF EXISTS invoices CASCADE;

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  description VARCHAR(255),
  status VARCHAR(255) DEFAULT 'draft',
  payment_terms VARCHAR(255) NOT NULL,
  due_date DATE NOT NULL,
  business_user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  customer_user_id INTEGER REFERENCES users (id) ON DELETE CASCADE
);