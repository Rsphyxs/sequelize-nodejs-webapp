# SEQUELIZE-NODEJS-WEBAPP

Simple secure CRUD program using Node.js, Express.js, and Sequelize ORM.

## Available Feature
1. Register User (User that just registered also considered login)
2. Login User
3. Update User
4. Logout User
5. Reauthenticate Token

## All Dependencies</br>
<b>Backend</b>
1. Express js `npm install express`
2. Sequelize ORM `npm i sequelize`  
3. Postgres (pg) `npm install pg`
4. Cors Middleware `npm install cors`
5. Bcrypt hash password `npm i bcrypt`
6. Dotenv `npm i dotenv`
7. JSON Web Token `npm i jsonwebtoken`
8. script Monitoring server `npm install nodemon` (optional)


## How To Run
### Prepare the database locally
1. Copy all query from `database.sql` and run it in local psql

### Running Backend Service
2. Direct folder to where `server.js` is, then run `nodemon server.js` or `node server.js` in command prompt or power shell.

### Test API
3. Import the postman collection API to start using the service with the available route
</br>
