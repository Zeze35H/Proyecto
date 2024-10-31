# School Website Thingy

"School Website Thingy" is a full-stack website formation project for the University of Salamanca.

## Usage
After cloning the repository, execute the following commands to get the website running:

#### 1. Start the Server side (backend):
```bash
node server
```
#### 2. Start the Client side (frontend):
```bash
npm run dev
```
#### 3. Open the website on your browser:
[http://localhost:8081/](http://localhost:8081/)

## Example users
- Professor: **zeze35h**
- Student: **postgres**
- Inactive account: **goodstudent**

All passwords are set as "a".
To edit users, change the `users_data` variable inside the 'server.js' file

## Main features
- Register account + Email confirmation for account activation

![register](https://github.com/user-attachments/assets/692c374f-91a4-4081-baa7-c8a0d866c7df)
- Password reset (forgot password?)

![forgot password](https://github.com/user-attachments/assets/960eef52-6633-4190-9458-ea4aabb95fec)
- Login/Logout authentication with session management

![login](https://github.com/user-attachments/assets/01bebbb5-6174-4ddd-8013-65a0cb6756a8)
- Homepage for students and professors + Student info and class enrolment management for professors

![homepage](https://github.com/user-attachments/assets/53c86191-7776-40e7-ba0e-5e30dc542623)
- User list with search and filter functionalities

![userlist](https://github.com/user-attachments/assets/5e9b40d7-231d-449d-87da-ac29c6e1692b)
- View other profiles and own profile + Edit account information

![profile](https://github.com/user-attachments/assets/1320db09-4fd4-4422-bf6d-ae6d32289a8f)


## Architecture
This project uses the following software:
- Frontend: [Vue](https://vuejs.org/) + [Bootstrap](https://getbootstrap.com/)
- Backend: [Node.js](https://nodejs.org/en) + [Express](https://expressjs.com/) + [Passport](https://www.passportjs.org/) + [Sequelize](https://sequelize.org/) + [MySQL](https://www.mysql.com/)
![architecture](https://github.com/user-attachments/assets/e3267c49-1eb9-4f23-b30c-7505c3f17e32)

  
