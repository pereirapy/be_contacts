# This is the backend for the project Contacts

## First Steps

1 - Clone the project

2 - Update the files knexfile.js (both) to use your credentials in development or test environment. In production environment when you attach the database, heroku will creates the env `DATABASE_URL`.

3 - Development environment:

- Run `npm install`
- After you have created the database run `npm run db:migrate` to create all tables, views and the mandatory data
- Run `npm run dev`

4 - Production environment:

- Creates a new database using Heroku (You need to have a account here)
  - Go to `https://dashboard.heroku.com/apps` and create a new app
  - Connect with your GitHub repo that has your backend files
  - Enable automatic deploys
  - Go to `Resources` and search by `Heroku Postrgres` and add it
  - Close the Database windows and go back to the first one, there click over the button `Open app` and copy the URL and save it because you will use in the frontend app
  - Go to `Settings` tab -> Reveal Config Vars and add a new one: `PGSSLMODE` as key and `no-verify`and the value
  - Go to `Deploy` tab -> Manual deploy -> Choose a branch to deploy -> Deploy Branch (If some error happens, you will have to reset database before try again)
  - Those information you will use in frontend app
- In heroku the app will run automatically the scripts `npm run db:migrate` and `npm start`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

- Runs the app in the development mode.
- You will also see any lint errors in the console.

### `npm start`

- Builds the app for production.
- It correctly bundles React in production mode and optimizes the build for the best performance.
