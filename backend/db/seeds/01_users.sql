INSERT INTO users (name, password, email, user_type, picture_url, street, city, postal_code, country)
VALUES
  ('Business User', 'hashed_password_1', 'business@mail.com', 'business', 'https://i.pravatar.cc/60', '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom'),
  ('Jensen Huang', 'hashed_password_2', 'jensenh@mail.com', 'customer', 'https://i.pravatar.cc/60', '106 Kendell Street', 'Sharrington', 'NR24 5WQ', 'United Kingdom'),
  ('Alex Grim', 'hashed_password_3', 'alexgrim@mail.com', 'customer', 'https://i.pravatar.cc/60', '84 Church Way', 'Bradford', 'BD1 9PB', 'United Kingdom'),
  ('John Morrison', 'hashed_password_4', 'jm@myco.com', 'customer', 'https://i.pravatar.cc/60', '79 Dover Road', 'Westhall', 'IP19 3PF', 'United Kingdom'),
  ('Alysa Werner', 'hashed_password_5', 'alysa@email.co.uk', 'customer', 'https://i.pravatar.cc/60', '63 Warwick Road', 'Carlisle', 'CA20 2TG', 'United Kingdom'),
  ('Mellisa Clarke', 'hashed_password_6', 'mellisa.clarke@example.com', 'customer', 'https://i.pravatar.cc/60', '46 Abbey Row', 'Cambridge', 'CB5 6EG', 'United Kingdom'),
  ('Thomas Wayne', 'hashed_password_7', 'thomas@dc.com', 'customer', 'https://i.pravatar.cc/60', '3964 Queens Lane', 'Gotham', '60457', 'United States of America'),
  ('Anita Wainwright', 'hashed_password_8', '', 'customer', 'https://i.pravatar.cc/60', '', '', '', ''),
  ('TechCorp Solutions', 'hashed_password_9', 'techcorp@mail.com', 'business', 'https://i.pravatar.cc/60', '123 Tech Plaza', 'Tech City', 'TECH123', 'Techland'),
  ('John Techman', 'hashed_password_10', 'john.techman@mail.com', 'customer', 'https://i.pravatar.cc/60', '456 Circuit Lane', 'Digitalburg', 'DIGI456', 'Techland'),
  ('Linda Coderella', 'hashed_password_11', 'linda.coderella@mail.com', 'customer', 'https://i.pravatar.cc/60', '789 Code Street', 'Codeville', 'CODE789', 'Techland');