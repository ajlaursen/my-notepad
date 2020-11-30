// const { json } = require("express");
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extend: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const savedNotes = JSON.parse(data);
    res.json(savedNotes);
  });
});

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

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
