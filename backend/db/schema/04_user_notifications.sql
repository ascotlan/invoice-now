DROP TABLE IF EXISTS user_notifications CASCADE;

CREATE TABLE user_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  invoice_id INTEGER REFERENCES invoices(id),
  notification_type VARCHAR(255),
  status VARCHAR(255)
);