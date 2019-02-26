'use strict'

//  read Libarys
const mariadb = require('mariadb');
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression');
const app = express()

// Activate express body parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// activating gzip compression
app.use(compression());

// Initialize Database
const pool = mariadb.createPool({
  host: 'localhost',
  user:'test',
  password: 'test',
  connectionLimit: 5,
  database: 'test'
});

/**
 * Base querry
 */

app.get('/query/:query', async function (req, res) {
  const query = decodeURIComponent(req.params.query)
  let conn
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query);
    res.status("200")
    res.send(rows)
  } catch (err) {
    res.status("500")
    res.send(JSON.stringify(err))
    throw err;
  } finally {
    if (conn) return conn.end();
  }
})

/**
 * start express listener
 */
app.listen(3000, function () {
  console.log('App listening on port ' + 3000 + ' !')
})
