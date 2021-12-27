const router = require("express").Router();
const { google } = require("googleapis");

const GOOGLE_CLIENT_ID =
  "631849936298-3d06hqhckd5u1c1qnlsb5d0nicm3qbgp.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

const REFRESH_TOKEN =
  "1//0ghI8ndknw9YMCgYIARAAGBASNwF-L9Iras7_C5mFJRSOVwNT2rx-z5z3cwfdv79hD9lkG-8piRTfPArlJs6oWr5UYQFLaXrkCSU";

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: "1",
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
