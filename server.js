const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "languagelearningapp"
});

app.post('/signup', (req, res) => {
    const sql = `INSERT INTO user (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}')`;
    console.log(sql);
    db.query(sql, (err, data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.post('/login', (req, res) => {
    const sql = `SELECT name, email FROM user WHERE email = '${req.body.email}' AND password = '${req.body.password}'`;
    console.log(sql);
    db.query(sql, (err, data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            return res.json(data[0]);
        }
        else {
            return res.json("Failed");
        }
    });
});

app.get('/languages', (req, res) => {
    db.query('SELECT name FROM languages', (error, results) => {
      if (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const languages = results.map(row => row.name);
        console.log(languages);
        res.json(languages);
      }
    });
  });
  
  app.get('/vocabulary', (req, res) => {
    const { language } = req.query;
    if (!language) {
      return res.status(400).json({ error: 'Language parameter is required' });
    }
  
    db.query('SELECT word, meaning FROM vocabulary WHERE language = ?', [language], (error, results) => {
      if (error) {
        console.error('Error fetching vocabulary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const vocabulary = results;
        console.log(vocabulary);
        res.json(vocabulary);
      }
    });
  });

  app.get('/countNumbers', (req, res) => {
    const { language } = req.query;
    if (!language) {
      return res.status(400).json({ error: 'Language parameter is required' });
    }
  
    db.query('SELECT number, word, meaning FROM count_numbers WHERE language = ?', [language], (error, results) => {
      if (error) {
        console.error('Error fetching Numbers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const countNumbers = results;
        console.log(countNumbers);
        res.json(countNumbers);
      }
    });
  });

  app.delete('/deleteUser', (req, res) => {
    const { userName, userEmail } = req.query;
    if (!userName || !userEmail) {
      return res.status(400).json({ error: 'Name and Email parameter is required' });
    }
  
    db.query("DELETE FROM user WHERE name = '" + userName + "' AND email = '" + userEmail + "'", (error, results) => {
      if (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(`User ${userName} successfully deleted`);
      }
    });
  });

  app.get('/videoUrl', (req, res) => {
    const { language } = req.query;
    if (!language) {
      return res.status(400).json({ error: 'Language parameter is required' });
    }
  
    // Query to retrieve video URL from database
    const query = 'SELECT url FROM videoUrl WHERE language = ?';
    db.query(query, [language], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Video URL not found for the specified language' });
      }
  
      const videoUrl = results[0].url;
      res.json({ url: videoUrl });
    });
  });

app.listen(8081, () => {
    console.log("Listening");
})