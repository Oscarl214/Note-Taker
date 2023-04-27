const notes = require("express").Router();
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

notes.get("/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.post("/notes", (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  let data = fs.readFileSync("./db/db.json", "utf8");

  const parsedData = JSON.parse(data);

  parsedData.push(newNote);

  writeToFile("./db/db.json", JSON.stringify(parsedData), (err, text) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log("New note added !");
  res.json(data);
});

notes.get("/notes/:id", (req, res) => {
  const noteId = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);

      res.send(result);

      console.log("Successful note");
    });
});

notes.delete("/notes/:id", (req, res) => {
  const noteId = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", JSON.stringify(result))
        .then(() => {
          res.json(`Item ${noteId} has been deleted 🗑️`);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json("Error deleting note");
        });

      // Respond to the DELETE request
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json("Error deleting note");
    });
});

module.exports = notes;
