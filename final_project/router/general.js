const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let getBook = books[isbn];
    res.send(getBook);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let getBookByAuthor = Object.keys(books)
    ?.map(book => books[book])
    ?.filter(data => data.author === author);
    res.send(getBookByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let getDetailsByTitle = Object.keys(books)
    ?.map(book => books[book])
    ?.filter(data => data.title === title);
    res.send(getDetailsByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let getbookreviewsbyisbn = books[isbn].reviews;
  if (isbn) {
    res.send(getbookreviewsbyisbn);
  } else {
    return res.status(403).json({ message: "Book does not found" });
  }
});

const fetchBooksList = async () => {
    try {
        const { data } =  await axios.get('http://localhost:5000/');
        if (data.error) throw new Error(data.error);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
    }
}
fetchBooksList();

const getBooksByisbn = async (isbn) => {
    try {
        const { data } = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        if (data.error) throw new Error(data.error);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
    }
}
getBooksByisbn('2');

const getBookDetailsByAuthor = async (author) => {
    try {
        const { data } = await axios.get(`http://localhost:5000/author/${author}`);
        if (data.error) throw new Error(data.error);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
    }
}
getBookDetailsByAuthor("Jane Austen");

const getBookDetailsByTitle = async (title) => {
    try {
        const { data } = await axios.get(`http://localhost:5000/title/${title}`);
        if (data.error) throw new Error(data.error);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
    }
} 
getBookDetailsByTitle("Things Fall Apart");

module.exports.general = public_users;
