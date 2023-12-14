require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const invoicesRouter = require("./routes/invoices");
const notificationsRouter = require("./routes/notifications");
const authRouter = require("./routes/auth");
const stripeRouter = require("./routes/stripe");
const { validateUserSession } = require("./util/userSessionHelper");
const {
  UserNotAuthorizedError,
  InvoiceNotFoundError,
  InvoiceItemNotFoundError,
  UserNotFoundError,
  InvalidInvoiceStatusError,
} = require("./util/errorHelper");
const cookieSession = require("cookie-session");

//set port
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON bodies & log HTTP requests
app.use(morgan("dev"));
app.use(express.json());

// Validate user session for all the incoming requests except for main page
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    // Set the SameSite attribute to 'None' and ensure cookies are sent only over HTTPS
    // sameSite: "None",
    // secure: process.env.NODE_ENV === "production", // Set to true in production
  })
);

// Enable All CORS Requests for development
const corsOptions = {
  origin: "https://antonio-invoice-now.netlify.app",
  credentials: true, // Allow credentials (cookies)
};

app.options("*", cors(corsOptions)); // Use corsOptions for the options route

app.use(cors(corsOptions));

// use helmet to set various HTTP headers for protecting against common vulnerabilities
app.use(helmet());

app.use((req, res, next) => {
  if (req.url !== "/" && !req.url.startsWith("/api/auth"))
    validateUserSession(req, res, next);
  next();
});

// Use routers
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/stripe", stripeRouter);

// Serve any static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// middleware error handling
app.use((err, req, res, next) => {
  console.error(`Error stack -> ${err.stack}`);
  if (
    err instanceof UserNotAuthorizedError ||
    err instanceof InvoiceNotFoundError ||
    err instanceof InvoiceItemNotFoundError ||
    err instanceof UserNotFoundError ||
    err instanceof InvalidInvoiceStatusError
  ) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  return res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
