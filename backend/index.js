require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const helmet = require('helmet');
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const invoicesRouter = require("./routes/invoices");
const notificationsRouter = require("./routes/notifications");
const {validateUserSession} = require("./routes/userSessionHelper");

//set port
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON bodies & log HTTP requests
app.use(morgan("dev"));
app.use(express.json());
// Enable All CORS Requests for development
app.use(cors());
// use helmet to set various HTTP headers for protecting against common vulnerabilities
app.use(helmet());

// Middleware to fetch 'userid' header value 
// and assign it to session -> userId key as a value
app.use((req, res, next) => {
  req.session = { userId: req.headers['userid'] };
  next();
});

// Validate user session for all the incoming requests except for main page
app.use((req, res, next) => {
  if (req.url !== '/') validateUserSession(req, res, next);
});


// Use routers
app.use("/api/users", usersRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/notifications", notificationsRouter);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// middleware error handling
app.use((err, req, res, next) => {
  console.error(`Error stack -> ${err.stack}`);
  res.status(500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
