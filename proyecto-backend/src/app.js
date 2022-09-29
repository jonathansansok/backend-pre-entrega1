const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");

//! SETTINGS

app.set("port", process.env.PORT || 8080); //! CONFIG port
app.set("json spaces", 2); //! JSON formatter

//! MIDDLEWARES

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "../public"))); //! STATIC FILES

//! ROUTES

const indexRoute = require("./routes/index.routes");
app.use("/api", indexRoute); //

//! 404 - Not Found

app.use((req, res) => {
  res.status(404).json({ Message: "Error 404 - Page not found" });
});

module.exports = app;
