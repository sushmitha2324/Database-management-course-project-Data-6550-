# How to Run the QR Lost & Found App

## Prerequisites

- Node.js installed
- MongoDB running (local or Atlas)
- Gmail account for email notifications

## Steps

1. Navigate to the project folder:
   ```
      cd qr-lost-found
         ```

         2. Install dependencies:
            ```
               npm install
                  ```

                  3. Create a `.env` file in the `qr-lost-found` folder with these variables:
                     ```
                        MONGO_URI=your_mongodb_connection_string
                           SESSION_SECRET=your_secret_key
                              EMAIL_USER=your_gmail@gmail.com
                                 EMAIL_PASS=your_gmail_app_password
                                    PORT=3000
                                       ```

                                       4. Start the server:
                                          ```
                                             node app.js
                                                ```
                                                   Or with nodemon:
                                                      ```
                                                         nodemon app.js
                                                            ```

                                                            5. Open your browser and go to:
                                                               ```
                                                                  http://localhost:3000
                                                                     ```

                                                                     ## Notes

                                                                     - Use a Gmail App Password, not your regular Gmail password
                                                                     - Make sure MongoDB is running before starting the server
                                                                     - The first registered user can be promoted to admin manually in the database
