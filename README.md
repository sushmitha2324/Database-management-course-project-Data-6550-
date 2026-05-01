QR-Based Lost & Found Management System

1. Project Overview
The QR-Based Lost & Found Management System is a full-stack web application designed to improve the traditional lost and found process using QR code technology. Each registered item is assigned a unique QR code. When someone scans the QR code, they are taken to a secure public page where they can notify the owner through email.

2. Objectives
- Implement secure user authentication
- Maintain structured database relationships
- Generate unique QR codes for each item
- Enable role-based admin access
- Send automated email notifications
- Maintain data integrity and validation

3. System Architecture
Frontend: EJS, Bootstrap 5  
Backend: Node.js, Express.js  
Database: MongoDB  
Other Integrations: QR Code Generator, Nodemailer, Session-based Authentication

4. Database Design

Users Entity:
- user_id (Primary Key)
- name
- email (Unique)
- password
- role

Items Entity:
- item_id (Primary Key)
- item_name
- description
- status
- owner_id (Foreign Key -> Users)

Reports Entity:
- report_id (Primary Key)
- item_id (Foreign Key -> Items)
- reporter_email
- timestamp

5. Relationships
- One User -> Many Items
- One Item -> Many Reports

6. Role-Based Access

User Role:
- Add items
- Mark items as lost/found
- View personal items

Admin Role:
- View all users
- Promote/Demote users
- Delete users
- View analytics

7. Email Notification System
When an item is marked as lost or found, the owner receives an automated email notification.

8. Key Features
- Secure login and signup
- QR-based item identification
- Public scan view (limited info)
- Admin dashboard
- Data validation
- Clean responsive UI

9. How to Run
1. Clone the repo
2. Navigate to qr-lost-found/
3. Run npm install
4. Create a .env file with MongoDB URI, session secret, email credentials, and port
5. Run node app.js or nodemon app.js

10. Authors
- Valaboju Shiva Kumar Chary
- Divya Sai Sukanya Indala
- Sushmitha Sana
- Satvick Yadlapalli

11. Course
DBMS 4560/5560 - Semester Project
