DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS user_notifications CASCADE;


CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  user_type VARCHAR(255) NOT NULL,
  picture_url VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  postal_code VARCHAR(255),
  country VARCHAR(255),
  phone_number VARCHAR(255)
);

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


CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  quantity INTEGER,
  price INTEGER,
  total INTEGER,
  invoice_id INTEGER REFERENCES invoices (id) ON DELETE CASCADE
);

CREATE TABLE user_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  invoice_id INTEGER REFERENCES invoices(id),
  notification_type VARCHAR(255),
  status VARCHAR(255)
);