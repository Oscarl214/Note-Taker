const router = require("express").Router();

const notesRouter = require("./notes");

router.use("/", notesRouter);

module.exports = router;
