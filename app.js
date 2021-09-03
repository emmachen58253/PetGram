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
 * Retrieves all posts from the database (if there is no search paramter). If there is
 * a search parameter, then queries all posts that contain the search query parameter
 * fragment in their caption
 */
 app.get('/petgram/posts', async function(req, res) {
   try {
    let input = req.query.search;
    let category = req.query.type;
    let query = '';
    if (input !== null && input !== undefined && category !== null && category !== undefined) {
      if (category === 'Post') {
        query = 'SELECT * FROM posts WHERE caption LIKE \'%' + input + '%\' ORDER BY DATETIME(date) DESC';
      } else {
        query = 'SELECT * FROM posts WHERE animal LIKE \'%' + input + '%\' ORDER BY DATETIME(date) DESC';
      }
    } else {
      query = 'SELECT * FROM posts ORDER BY DATETIME(date) DESC';
    }
    let db = await getDBConnection();
    let posts = await db.all(query);
    let result = {
      'posts': posts
    };
    await db.close();
    res.type('json');
    res.json(result);
  } catch (err) {
    res.status(SERVER_ERROR).type('text');
    res.send('An error occurred on the server. Try again later.');
  }
});

/**
 * When the someone likes a post (by clicking on the heart icon found in the bottom left hand
 * corner of a post), updates the database so that the number of likes in
 * the database matches the number of times the user has clicked the heart icon
 * of that post
 */
 app.post('/petgram/likes', async function(req, res) {
  try {
    let id = req.body.id;
    if (id === null || id === undefined) {
      res.status(CLIENT_ERROR).type('text');
      res.send('Missing one or more of the required params.');
    } else {
      let db = await getDBConnection();
      let query = 'SELECT likes FROM posts WHERE id = ' + id;
      let getLikes = await db.all(query);
      let numLikes = getLikes[0].likes + 1;
      let update = 'UPDATE posts SET likes = ' + numLikes + ' WHERE id = ' + id;
      await db.run(update);
      await db.close();
      res.type('text');
      res.send(numLikes.toString());
    }
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

