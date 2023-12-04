InvoiceNow:
InvoiceNow is an invoicing application designed to streamline the process of creating, managing, and transacting invoices. It offers a user-friendly interface and a suite of features to facilitate efficient business transactions.

Application Features
Landing Page:
![Landing Page-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/a0a8ff31-2901-4d43-9eb3-a103242a61eb)
Our landing page greets you with two intuitive user interfaces: "Connect with Customers" and "Transact with Ease."

Invoices:
![Invoices-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/2c81e87f-ebae-40b1-9503-cc782a575735)

Connect with Customers: Seamlessly engage with clients and manage invoicing details.
Transact with Ease: Navigate the efficient customer portal for swift transaction handling.
Connect with Customers Interface
Upon choosing 'Connect with Customers,' users encounter:

Logout Option: Securely exit or switch between functionalities.
User Avatar: Personalize your profile for a more engaging experience.
List of Invoices: View IDs, Due dates, client’s names, Billing Amounts, and status.
Status Filtering: Effortlessly filter invoices by status categories like Paid, Pending, and Draft.
New Invoice Creation: Initiate new invoices instantly with a single click.


New Invoice creation:
![New Invoice creation -InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/e532e2e8-c70c-4368-bb07-ddf4d456af10)

Creating a new invoice is simplified into an intuitive billing form:

Business Address Details: Fill in comprehensive business and client address information.
Client Details: Capture client's essential information including contact details and address.
Invoice Specifics: Input invoice date, payment terms, project description, and an itemized list.

![New Invoice creation2-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/4e951a77-6999-460f-add3-cc530f59922b)
Item Addition: Add items with details like name, quantity, price, and total; save as draft or pending.

Efficient Workflow:

![TwilioSms-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/00204a4f-686c-448b-bac7-f1c53bc6bc78)
Pending Invoice Notification: Saving as pending triggers an automatic SMS notification to the client, urging them to view and pay via the customer portal.
Editing Invoices: Edit draft and pending invoices seamlessly; changes trigger automatic SMS notifications to clients.
Deletion Functionality: Effortlessly delete draft, pending, as well as paid invoices as needed.
Transact with Ease Interface
A click on ‘Transact with ease’ leads you to a straightforward customer’s portal where you can:

![Transact-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/d95e0e0f-bbb7-4f7e-adc6-28d2b00e2f40)
See a list of invoices: Highlighting IDs, Due dates, Business names, Billing Amounts, and Statuses.

Make Invoice Payment: Select an unpaid invoice and proceed to pay with a simple call-to-action button ‘Pay Invoice’.
![Pay Invoice-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/c628a940-66cd-465f-bf1b-47dc98b53665)

![Card Details-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/cbb7cfa8-aefb-4ae2-a48f-857021b86898)

Instant Confirmation: Upon successful payment, receive an instant confirmation as ‘successful payment’.
![Successful Payment Notification-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/536f549f-c880-444e-99e4-cd230cbe8dea)


Setup Instructions
Running InvoiceNow Locally
To run InvoiceNow locally, follow these steps:

Clone the Repository: git clone https://github.com/InvoiceNow.git

Install Dependencies:

Backend: npm install in the root directory.
Frontend: npm install in the frontend directory.
Configuration:

Twilio API: Set up a Twilio account and configure the API keys in the .env file.
Stripe API:
Backend: Obtain API keys from Stripe and configure the secret key in the .env file.
Frontend: Configure the public key in config.js located in the frontend directory.
Run the Application: npm run dev in the root directory.

Access the Application: Open a web browser and navigate to http://localhost:5173.

Backend Setup
This repository contains the backend setup for InvoiceNow, utilizing Node.js with PostgreSQL for database management.

Setup
Install Dependencies: Execute npm install to install required backend dependencies.

Database Creation:

Access the PostgreSQL server using psql -U labber with the username labber and password labber in a Vagrant terminal or according to your environment setup.
Create a new database: CREATE DATABASE invoicenow_development;
Configuration:

Copy .env.example to .env and populate the necessary PostgreSQL configurations:
dotenv
Copy code
# Environment
NODE_ENV=development

# PostgreSQL setup
DB_USER=labber
DB_PASSWORD=labber
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=invoicenow_development
Seeding:

Run the development server with npm run dev in the host environment. Utilize the Vagrant box specifically for PostgreSQL.
Frontend Setup (React + Vite)
This repository contains the frontend setup for InvoiceNow, implementing React with Vite for a smooth development experience.

Setup
Install Dependencies: Run npm install to install required frontend dependencies.

Run React Development Server:

Start the React development server with npm run dev after launching the backend server.
