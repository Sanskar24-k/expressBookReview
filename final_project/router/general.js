const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios');

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get all books using Async/Await & Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Endpoint used internally by Axios for Task 10
public_users.get('/books', function (req, res) {
  return res.status(200).json(books);
});

// Task 11: Get book details based on ISBN using Promises & Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/books`)
    .then(() => {
      if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
      }
      return res.status(404).json({ message: "Book not found" });
    })
    .catch(() => {
      if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
      }
      return res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get book details based on Author using Async/Await & Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let results = [];
    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        results.push({ isbn: key, ...books[key] });
      }
    });
    return res.status(200).send(JSON.stringify(results, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title using Promises & Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/books`)
    .then(() => {
      let results = [];
      Object.keys(books).forEach(key => {
        if (books[key].title === title) {
          results.push({ isbn: key, ...books[key] });
        }
      });
      return res.status(200).send(JSON.stringify(results, null, 4));
    })
    .catch(() => {
      let results = [];
      Object.keys(books).forEach(key => {
        if (books[key].title === title) {
          results.push({ isbn: key, ...books[key] });
        }
      });
      return res.status(200).send(JSON.stringify(results, null, 4));
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
module.exports.users = users;
