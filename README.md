# School Website Thingy

"School Website Thingy" is a full-stack website formation project for "BISITE Research Group" at the University of Salamanca.

## Usage
After cloning the repository, execute the following commands to get the website running:

#### 1. Install dependencies:
```bash
npm install
```
#### 2. Start the Server side (backend):
```bash
node server
```
#### 3. Start the Client side (frontend):
```bash
npm run dev
```
#### 4. Open the website on your browser:
[http://localhost:8081/](http://localhost:8081/)

## Example users
- Professor: **zeze35h**
- Student: **postgres**
- Inactive account: **goodstudent**

All passwords are set as "a".

To edit users, change the `users_data` variable inside the 'server.js' file

## Architecture
This project uses the following software:
- Frontend: [Vue](https://vuejs.org/) + [Bootstrap](https://getbootstrap.com/)
- Backend: [Node.js](https://nodejs.org/en) + [Express](https://expressjs.com/) + [Passport](https://www.passportjs.org/) + [Sequelize](https://sequelize.org/) + [MySQL](https://www.mysql.com/)


![architecture](https://github.com/user-attachments/assets/15bfd360-4b20-41b1-b9f2-6e9f699cb308)

## UML Diagram

![UML Diagram](https://github.com/user-attachments/assets/1eb71626-1cde-431d-bc63-6ce69df1351b)

## Main features
- Register Account

https://github.com/user-attachments/assets/dcaf8c46-decc-4615-a94a-1d613b055b41

- Activate Account and Login

    **Note:** For security reasons, the credentials in 'EmailService.js' are not currently associated with the project's OAuth Client. Therefore, the automatic email service is not functional.

https://github.com/user-attachments/assets/3bd6f279-a131-4a0d-919d-c73ef3d7f6ab

- Logout and Password Reset (_Forgot Password?_)

https://github.com/user-attachments/assets/00145e59-ff07-4969-afcc-aa901cb2cf80

- Change Password

https://github.com/user-attachments/assets/f2a714c5-c9fe-442d-951c-08040c954573

- Edit Profile View and Edit

https://github.com/user-attachments/assets/dd8dc63c-8123-474e-8ff4-5866177b63fa

- User List with Search and Filter functionalities

https://github.com/user-attachments/assets/edd0cb63-d062-4190-84b3-38efae776a41

- Professor View: Homepage + Profile

https://github.com/user-attachments/assets/4e570c3e-7a9c-4571-9efa-017119313545

- Student Homepage View

![Student Homepage View](https://github.com/user-attachments/assets/7d8a3d36-7d1c-45f2-b641-9926d2d18d62)

- 404 Page

https://github.com/user-attachments/assets/2eb5e85c-bef4-4034-a055-6bf8b58702b1  
