# This is the backend for the project Contacts

## First Steps

1- Clone the project
2 - Update the files knexfile.js (both) to use your credentials in development or test environment. In production environment you have to create the env "DATABASE_URL". In Heroku you have a special space to add new environment variable.

3 - Development environment:

- After you have created the database run `npm run db:migrate` to create all tables and views
- run `npm run db:seed` to insert all data
- run `npm run dev`

4 - Production environment:

- Creates a new database and save the URL to use in variable environment
  - Go to `https://dashboard.heroku.com/apps` and create a new app
  - Connect with your GitHub repo that has your backend files
  - Enable automatic deploys
  - Go to `Resources` and search by `Heroku Postrgres` and add it
  - Close the Database windows and go back to the first one, there click over the button `Open app` and copy the URL and save it because you will use in the frontend app
  - Go to `Settings` tab -> Reveal Config Vars and add a new one: `PGSSLMODE` as key and `no-verify`and the value
  - Update the script `heroku-postbuild`in the file `package.json` to be `"heroku-postbuild": "node_modules/.bin/knex migrate:latest && node_modules/.bin/knex seed:run"` in THE FIRST TIME THAT YOU DEPLOY. This is necessary to insert mandatory data. After the first deploy removes `&& node_modules/.bin/knex seed:run` to avoid try to insert the same data again and push this update to your repo. Other option to avoid this is using some IDE of database to make manually the insert data mandatory.
  - Go to `Deploy` tab -> Manual deploy -> Choose a branch to deploy -> Deploy Branch (If some error happens, you will have to reset database before try again)
  - Those information you will use in frontend app
- In heroku the app will run automatically the scripts `npm run db:migrate` and `npm start`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
You will also see any lint errors in the console.

### `npm start`

Builds the app for production.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.
