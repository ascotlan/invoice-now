INSERT INTO users (name, password, email, user_type, picture_url, street, city, postal_code, country, phone_number)
VALUES
  ('Business User', 'hashed_password_1', 'business@mail.com', 'business', 'https://i.pravatar.cc/60', '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom', '+15555555555'),
  ('Jensen Huang', 'hashed_password_2', 'jensenh@mail.com', 'customer', 'https://i.pravatar.cc/60', '106 Kendell Street', 'Sharrington', 'NR24 5WQ', 'United Kingdom', '+13065021204'),
  ('Alex Grim', 'hashed_password_3', 'alexgrim@mail.com', 'customer', 'https://i.pravatar.cc/60', '84 Church Way', 'Bradford', 'BD1 9PB', 'United Kingdom', '+15197224943'),
  ('John Morrison', 'hashed_password_4', 'jm@myco.com', 'customer', 'https://i.pravatar.cc/60', '79 Dover Road', 'Westhall', 'IP19 3PF', 'United Kingdom', '+14170000000'),
  ('Alysa Werner', 'hashed_password_5', 'alysa@email.co.uk', 'customer', 'https://i.pravatar.cc/60', '63 Warwick Road', 'Carlisle', 'CA20 2TG', 'United Kingdom', '+15194111111'),
  ('Mellisa Clarke', 'hashed_password_6', 'mellisa.clarke@example.com', 'customer', 'https://i.pravatar.cc/60', '46 Abbey Row', 'Cambridge', 'CB5 6EG', 'United Kingdom', '+13065021111'),
  ('Thomas Wayne', 'hashed_password_7', 'thomas@dc.com', 'customer', 'https://i.pravatar.cc/60', '3964 Queens Lane', 'Gotham', '60457', 'United States of America', '+15191231234'),
  ('Anita Wainwright', 'hashed_password_8', '', 'customer', 'https://i.pravatar.cc/60', '', '', '', '', '+14372001234'),
  ('TechCorp Solutions', 'hashed_password_9', 'techcorp@mail.com', 'business', 'https://i.pravatar.cc/60', '123 Tech Plaza', 'Tech City', 'TECH123', 'Techland', '+15021231241'),
  ('John Techman', 'hashed_password_10', 'john.techman@mail.com', 'customer', 'https://i.pravatar.cc/60', '456 Circuit Lane', 'Digitalburg', 'DIGI456', 'Techland', '+14371111112'),
  ('Linda Coderella', 'hashed_password_11', 'linda.coderella@mail.com', 'customer', 'https://i.pravatar.cc/60', '789 Code Street', 'Codeville', 'CODE789', 'Techland', '+13061111115'),
  ('Antonio Scotland', 'hashed_password_11', 'antonio.k.scotland@gmail.com', 'customer', 'https://i.pravatar.cc/60', '444 Connaught Street', 'Kitchener', 'N2C 1C3', 'Canada', '+15197224943');

INSERT INTO invoices (invoice_number, created_at, description, status, payment_terms, due_date, business_user_id, customer_user_id)
VALUES
  ('RT3080', '2021-08-18 00:00:00-05', 'Re-branding', 'paid', 1, '2021-08-19 00:00:00-05', 1, 2),
  ('XM9141', '2021-08-21 00:00:00-05', 'Graphic Design', 'pending', 30, '2021-09-20 00:00:00-05', 1, 3),
  ('RG0314', '2021-09-24 00:00:00-05', 'Website Redesign', 'paid', 7, '2021-10-01 00:00:00-05', 1, 4),
  ('RT2080', '2021-10-11 00:00:00-05', 'Logo Concept', 'pending', 1, '2021-10-12 00:00:00-05', 1, 5),
  ('AA1449', '2021-10-07 00:00:00-05', 'Re-branding', 'pending', 7, '2021-10-14 00:00:00-05', 1, 6),
  ('TY9141', '2021-10-01 00:00:00-05', 'Landing Page Design', 'pending', 30, '2021-10-31 00:00:00-05', 1, 7),
  ('FV2353', '2021-11-05 00:00:00-05', 'Logo Re-design', 'draft', 7, '2021-11-12 00:00:00-05', 1, 8),
  ('TC1234', '2023-01-15 00:00:00-05', 'Software Development', 'draft', 30, '2023-02-14 00:00:00-05', 9, 10),
  ('TC5678', '2023-02-20 00:00:00-05', 'Tech Consulting', 'pending', 14, '2023-03-06 00:00:00-05', 9, 11),
  ('JT4321', '2023-01-25 00:00:00-05', 'Tech Services', 'paid', 7, '2023-02-01 00:00:00-05', 9, 10),
  ('LC9876', '2023-01-20 00:00:00-05', 'Coding Services', 'draft', 1, '2023-01-21 00:00:00-05', 9, 11);

INSERT INTO invoice_items (name, quantity, price, total, invoice_id)
VALUES
  ('Brand Guidelines', 1, 180090, 180090, 1),
  ('Banner Design', 1, 15600, 15600, 2),
  ('Email Design', 2, 20000, 40000, 2),
  ('Website Redesign', 1, 1400233, 1400233, 3),
  ('Logo Sketches', 1, 10204, 10204, 4),
  ('New Logo', 1, 153233, 153233, 5),
  ('Brand Guidelines', 1, 250000, 250000, 5),
  ('Web Design', 1, 615591, 615591, 6),
  ('Logo Re-design', 1, 310204, 310204, 7),
  ('Software License', 2, 199.99, 399.98, 8),
  ('Consulting Hours', 5, 150.00, 750.00, 9),
  ('Web Development', 3, 120.00, 360.00, 10),
  ('Code Analysis', 2, 80.00, 160.00, 10),
  ('Algorithm Implementation', 1, 250.00, 250.00, 11),
  ('UI/UX Design', 4, 75.00, 300.00, 11);