## Setup

Install dependencies with `npm install`.

## Creating The DB

Use the `npm install` command to login to the PostgreSQL server with the username `labber` and the password `labber`. This command **MUST** be run in a vagrant terminal, we are using the PostgreSQL installation provided in the vagrant environment. M1/M2 and WSL2 users can execute this command in their terminal.

Create a database with the command `CREATE DATABASE invoicenow_development;`.

Copy the `.env.example` file to `.env` and fill in the necessary PostgreSQL configuration. 

```
#environment
NODE_ENV=development

#pg setup
DB_USER=labber
DB_PASSWORD=labber
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=invoicenow_development
```
## Seeding

Run a the development server with ` npm run dev` in the Host environment. We are only using the vagrant box for `psql`.
