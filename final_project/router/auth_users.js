const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> user.username === username

const authenticatedUser = (username,password)=>{ //returns boolean
let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization.username;
    let isbn = req.params.isbn;
    let review = req.body.review; 
  
    if (!books[isbn]) {
      return res.status(404).send("Book not found");
    }
  
    if (!review) {
      return res.status(400).send("Review query is required");
    }
  
    // Add or update the review
    books[isbn].reviews[username] = review;
  
    res.send({
      message: `Review ${username in books[isbn].reviews ? "updated" : "added"} successfully.`,
      isbn,
      reviewBy: username,
      review
    });
  });
  
// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    let isbn = req.params.isbn;
    let review = req.body.review;
    if (!books[isbn]) {
        return res.status(404).send("Book not found");
      }
    
      if (!review) {
        return res.status(400).send("Review query is required");
      }

      delete books[isbn].reviews[username];
      res.send({
        message: `Review deleted successfully.`,
        isbn,
        reviewBy: username,
        review
      });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
