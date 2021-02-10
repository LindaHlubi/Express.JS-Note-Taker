// dependencies
const express = require("express");
const path = require("path");
const fs = require("fs")

// Express App set up

const app = express();
// Listening port
var PORT = process.env.PORT || 3000;

// Express app to handle data parsing set up
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// HTML Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname + '/notes.html'));

});
// api routes

app.post("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)

    let id = notes[notes.length - 1].id + 1
    let newNote = { title: req.body.title, text: req.body.text, id: id }
    let activeNote = notes.concat(newNote)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(activeNote), function (error, data) {
      if (error) {
        return error
      }
      console.log(activeNote)
      res.json(activeNote);
    })
  })
})

// Pull from db.json
app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
    if (error) {
      return console.log(error)
    }
    console.log("This is Notes", data)
    res.json(JSON.parse(data))
  })
});

app.delete("/api/notes/:id", (req, res) => {
  let noteId = JSON.parse(req.params.id)
  console.log(noteId)
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)

    notes = notes.filter(val => val.id !== noteId)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
      if (error) {
        return error
      }
      res.json(notes)
    })
  })
})

app.put("/api/notes/:id", function(req, res) {
  const noteId = JSON.parse(req.params.id)
  console.log(noteId)
  fs.readFile(__dirname + "/db/db.json", "utf8", function(error, notes) {
    if (error ){
      return console.log(error)
    }
    notes.JSONparse(notes)

    notes = notes.filter(val => val.id !== noteId)

    fs.writeFile(__dirname +"/db/db.json", JSON.stringify(notes), function (error, data) {
      if (error) {
        return error
      }
      res.json(notes)
    })
  })
})

// Server listening startup

app.listen(PORT, function () {
  console.log("Server listening on PORT " + PORT);
});
