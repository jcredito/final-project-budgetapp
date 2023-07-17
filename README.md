## About the project 📚

BudgetApp is a digital tool that helps users track and manage their finances by providing features such as expense categorization,and a budget creation accessible through a web browser.

### Features:

- User authentication and authorization (Registration and Login)
- User's profile page with:
  -a Budget Table where users can set a Budget depends on the category created, get the transactions total amount from the Transaction List that gets automatically subtracted from the budget and have the result as the Budget Balance amount.
  -Category Table where users add a category necessary for the creation of a budget
  -Transaction List where users can add their expenses, set the date, amount, and an optional note.

### Planning:

- Wireframing and prototyping using [Figma]
- Database schema design using [drawSQL]

## Technologies ⚛️

<img height="25" src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="javascript logo"/> <img height="25" src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="next js logo"/> <img height="25" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="react logo"/> <img height="25" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript logo"/> <img height="25" src="https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white" alt="sass logo"/> <img height="25" src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="postgres logo"/>

## Screenshots 📸

#### Landing page

<img width="900" alt="landing page" src="/images/landing-page.png">

#### Profile page

<img width="900" alt="landing page" src="/images/profile-page.png">

## Setup 💻

1. Clone the repository

   ```
   git clone https://github.com/jcredito/final-project-budgetapp

   ```

2. Install dependencies using
   ```
   pnpm i
   ```
3. Setup postgreSQL database

4. Then run the following queries, with a database name, username and password of your own.

   ```
   CREATE DATABASE <database name>;
   CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
   GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
   \connect <database name>;
   CREATE SCHEMA <user name> AUTHORIZATION <user name>;
   ```

5. Connect to postgres database and run either:

   - `psql -U <user name> <database name>` on windows and macOS
   - `sudo -u <user name> psql -U <user name> <database name>` on Linux

6. Run application
   ```
   pnpm dev
   ```
   Open http://localhost:3000 on browser.

## Deployment 🚀

This project is deployed using vercel, in order to do so:

1. Create an account on [vercel](https://vercel.com/dashboard)
2. Create a postgres storage in vercel and select frankfurt
3. Create a project in vercel and import your version of this repository
4. Overwrite the install command (found in project general setting) with `pnpm install && pnpm migrate up`
5. Connect storage with project in Project > Storage > Connect
