const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let results = [];
  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      results.push({ isbn: key, ...books[key] });
    }
  });
  return res.status(200).send(JSON.stringify(results, null, 4));
});

// Get book details based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let results = [];
  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      results.push({ isbn: key, ...books[key] });
    }
  });
  return res.status(200).send(JSON.stringify(results, null, 4));
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
