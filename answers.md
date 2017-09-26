# Answers
1. What do we do in the Server and UserController constructors to set up our connection to the development database?
    - The server calls the `UserController` which can create and query data (users) from the database.
2. How do we retrieve a user by ID in the UserController.getUser(String) method?
    - It it takes an _id and iterates through each user in the database by _id and it returns a string with the found id or null if its not found.
3. How do we retrieve all the users with a given age in UserController.getUsers(Map...)? What's the role of filterDoc in that method?
    - We first get some age from a human and it checks if an age was entered. If so, we set that to the target age and search the database in the age category of the user with the target age and iterate over the database and find every user that has the target age.
4. What are these Document objects that we use in the UserController? Why and how are we using them?
    - Documents are essentially users. We are using them to construct users and put them into the database
    - We use documents to store the data in Mongo format rather than something like SQL
    - We are using them to store user data
    
