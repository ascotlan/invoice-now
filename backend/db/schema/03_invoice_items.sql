DROP TABLE IF EXISTS invoice_items CASCADE;

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  quantity INTEGER,
  price INTEGER,
  total INTEGER,
  invoice_id INTEGER REFERENCES invoices (id) ON DELETE CASCADE
);