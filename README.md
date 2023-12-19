# InvoiceNow App
[See live website!](https://antonio-invoice-now.netlify.app/) 

Welcome to InvoiceNow, a collaborative effort by Antonio, Maria, and Gift aimed at revolutionizing invoicing processes for small businesses and freelancers. This sophisticated platform empowers users with seamless capabilities to effortlessly generate, dispatch, and monitor invoices. Beyond streamlined invoicing, InvoiceNow offers a robust client management system, ensuring a comprehensive approach to business operations.

## Project Structure

Our project harmoniously combines frontend and backend excellence. The frontend showcase expertise in HTML, CSS, Javascript react,vite, react-router-dom, and @stripe/react-stripe-js, resulting in an intuitive and engaging user interface. The backend employs the power of express, node.js and a robust PostgreSQL database for dynamic logic, API endpoints and seamless data management.

## Summary of InvoiceNow App

### Landing Page:

	•	Greets you with a world class intuitive user interface. 
	•	Invite you to 'Connect with Customers' and 'Visit the Customer portal.

### Connect With Customer

	•	Seamlessly engage with clients and 
	•	Manage invoicing details.
 
 ### Invoices:

	•	Invoices are either in paid , pending or draft statuses.
	•	You can Effortlessly delete draft and pending as well as paid invoices as needed. 
	•	You can create a new or edit draft and pending invoices seamlessly.
	•	You choose and update invoice date, payment terms, project description 
	•	Capture client's essential information including contact details and address. 
	•	You can add items with details like name, quantity, price, and total; save as draft or pending. 
 
### Visit the Customer portal

	•	Allow clients to view and pay invoices directly through a secure Stripe integration.
	•	Navigate the efficient customer portal for swift transaction handling.

### SMS Notifications for Users:

	•	Clients receive SMS notifications from InvoiceNow, with a prompt to visit the customer portal for payment
 	•	Saving an updated draft and pending invoices trigger automatic SMS notifications to clients. 
	•	SMS Notifications are delivered directly to the clients' phone.


### Key Features

	•	Effortless Invoicing: Create, send, and track invoices seamlessly.
	•	Accessible Anywhere: Access your invoices on any device for optimal functionality, whether at the office or on the go.
	•	Client Portal: Allow clients to view and pay invoices directly through a secure Stripe integration.
	•	Real-Time Notifications: Stay updated from invoice creation to payment confirmation.


## Screenshot

### Landing Page:
![Landing Page-invoicenow2](https://github.com/ascotlan/invoice-now/assets/105958169/3f7b16ed-8363-49b0-abfa-f73d03f339ff)

### Invoices:
![Invoices-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/8c27e34d-6504-4ed1-bcfe-04338fe62dcc)

### New Invoice Creation:
![New Invoice creation -InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/bc245245-1c61-4722-b424-55a44cc027b1)

### Customer portal:
![Transact-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/6e6d6ab0-278d-4a12-8c77-a5e722984ac8)

### Pay Invoice:
![Pay invoice- invoicenow](https://github.com/ascotlan/invoice-now/assets/105958169/6c017c29-9b30-4a11-91fb-6677b95d55f9)

### Card Details:
![Card Details-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/ee167146-2f98-4abc-a752-7f72daaa5447)

### Successful Payment Notification:
![Successful Payment Notification-InvoiceNow](https://github.com/ascotlan/invoice-now/assets/105958169/936fe966-882f-42b6-8be0-dfb75f42a3c3)

### Sms Notification:
![Sms Notification-invoicenow2](https://github.com/ascotlan/invoice-now/assets/105958169/cb5f004a-8b48-4694-8796-58e3518ff79c)


## Getting Started


	1.	Create the .env file using .env.example as a reference: cp .env.example .env
	2.	Update the .env file with your local database information:
		•	username: labber
		•	password: labber
		•	host: localhost
		•	database: invoicenow_development.
	3.	Install dependencies: npm install
	4.	Execute npm run dev in the Host environment to run the development server.
	5.	Reset the database: npm run db:reset (Note: This will reset data)
	6.	Run the server: npm run dev
	7.	Visit http://localhost:5173/

## Dependencies

	•	cookie-session: "^2.0.0",
	•	cors: "^2.8.5",
	•	dotenv: "^16.3.1",
	•	express: "^4.18.2",
	•	helmet: "^7.1.0",
	•	morgan: "^1.10.0",
	•	pg: "^8.11.3",
	•	stripe: "^14.7.0",
	•	twilio: "^4.19.3,
	•	eslint: "^8.53.0",
	•	nodemon": "^3.0.1"
	•	@stripe/react-stripe-js: "^2.4.0",
	•	@stripe/stripe-js: "^2.2.0",
	•	prop-types: "^15.8.1",
	•	react: "^18.2.0",
	•	react-dom: "^18.2.0",
	•	react-router-dom: "^6.19.0",
 
## DevDependencies

	•	@types/react: "^18.2.15",
	•	@types/react-dom: "^18.2.7",
	•	@vitejs/plugin-react: "^4.0.3",
	•	eslint": "^8.45.0",
	•	eslint-plugin-react: "^7.32.2",
	•	eslint-plugin-react-hooks: "^4.6.0",
	•	eslint-plugin-react-refresh: "^0.4.3",
	•	vite": "^4.4.5",
	•	vite-plugin-eslint: "^1.8.1"

## Contact info:
For more information, feel free to contact our team members: Antonio, Maria, and Gift.



