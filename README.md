**InvoiceNow**

InvoiceNow is an all-in-one invoicing solution designed to simplify the management of invoices for small businesses and freelancers. This platform empowers users to effortlessly create, send, and track invoices while offering a comprehensive client management system.

**Key Features**

Effortless Invoicing: Create, send, and track invoices seamlessly.
Accessible Anywhere: Access your invoices on any device for optimal functionality, whether at the office or on the go.
Client Portal: Allow clients to view and pay invoices directly through a secure Stripe integration.
Real-Time Notifications: Stay updated from invoice creation to payment confirmation.

**Setup:**

**Backend**
Install dependencies with npm install.
Use psql -U labber in the provided vagrant terminal to log in to the PostgreSQL server using username labber and password labber.
Create a database with CREATE DATABASE invoicenow_development;.
Copy .env.example to .env and fill in the PostgreSQL configuration.
Seeding
Execute npm run dev in the Host environment to run the development server.
Use npm run reset-db to seed the database.

**Technologies Used**
Backend
Node.js
Express
PostgreSQL
Stripe API
Twilio API
Frontend
React
Vite

**Directory Structure**
backend: Contains the Node.js backend server.
frontend: Includes the React frontend setup.

**Backend Dependencies**
express
pg
stripe
twilio

**Frontend Dependencies**
react
vite
react-router-dom
@stripe/react-stripe-js

**Contribution Guidelines**
Fork and clone the repository.
Create a new branch for your contribution.
Submit a pull request detailing the changes made.

**How to Run**

Backend
Install dependencies: npm install
Start the server: npm run dev

Frontend
Install dependencies: npm install
Start the development server: npm run dev

**Landing Page:**
![Landing Page-invoicenow2](https://github.com/ascotlan/invoice-now/assets/105958169/3f7b16ed-8363-49b0-abfa-f73d03f339ff)

**Invoices:**
![Invoices-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/8c27e34d-6504-4ed1-bcfe-04338fe62dcc)

**New Invoice Creation:**
![New Invoice creation -InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/bc245245-1c61-4722-b424-55a44cc027b1)

**Customer portal:**
![Transact-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/6e6d6ab0-278d-4a12-8c77-a5e722984ac8)

**Pay Invoice:**
![Pay invoice- invoicenow](https://github.com/ascotlan/invoice-now/assets/105958169/6c017c29-9b30-4a11-91fb-6677b95d55f9)

**Card Details:**
![Card Details-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/ee167146-2f98-4abc-a752-7f72daaa5447)

**Successful Payment Notification:**
![Successful Payment Notification-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/936fe966-882f-42b6-8be0-dfb75f42a3c3)

**Sms Notification:**
![Sms Notification-invoicenow2](https://github.com/ascotlan/invoice-now/assets/105958169/cb5f004a-8b48-4694-8796-58e3518ff79c)







