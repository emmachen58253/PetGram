"use strict";
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const express = require('express');
const multer = require('multer');
const app = express();
const SERVER_ERROR = 500;
const CLIENT_ERROR = 400;
app.use(multer().none());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Queries all posts from the database (if there is no search paramter). If there is
 * a search parameter, then queries all posts that contain the search query parameter
 * fragment
 */
 app.get('/petgram/posts', async function(req, res) {
  try {
    let search = req.query.search;
    let query = '';
    if (search !== null && search !== undefined) {
      query = 'SELECT id FROM posts WHERE yip LIKE \'%' + search + '%\' ORDER BY id';
    } else {
      query = 'SELECT * FROM posts ORDER BY DATETIME(date) DESC';
    }
    let db = await getDBConnection();
    let result = await db.all(query);
    let trueResult = {
      'yips': result
    };
    await db.close();
    res.type('json');
    res.json(trueResult);
  } catch (err) {
    res.status(SERVER_ERROR).type('text');
    res.send('An error occurred on the server. Try again later.');
  }
});




async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'petgram.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const DEFAULT = 8000;
const PORT = process.env.PORT || DEFAULT;
app.listen(PORT);

