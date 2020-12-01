const express = require("express");
const path = require("path");
const fs = require("fs");
// random id generator
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.use(express.static("public"));

// server paths
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// grabs information from db.json file
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const savedNotes = JSON.parse(data);
    res.json(savedNotes);
  });
});

// writes new information to db.json file
app.post("/api/notes", function (req, res) {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const savedNotes = JSON.parse(data);
    savedNotes.push(newNote);
    console.log(savedNotes);
    fs.writeFile("./db/db.json", JSON.stringify(savedNotes), function () {
      console.log("Write File Success");
      return res.json(savedNotes);
    });
  });
});

// deletes file from db.json using randomly generated ID
app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const notesArray = JSON.parse(data);
    const updatedArray = notesArray.filter((item) => item.id != req.params.id);
    console.log(updatedArray);
    fs.writeFile("./db/db.json", JSON.stringify(updatedArray), function () {
      console.log("Write File Success");
      return res.json(updatedArray);
    });
  });
});

// moved to bottom because it was running before other gets were running 
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// where server is listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
