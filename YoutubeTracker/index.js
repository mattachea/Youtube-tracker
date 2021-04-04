require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.json({ info: "Youtube Tracker" }));
app.get("/videos/", api.getVideos);
app.get("/videosMetrics/", api.getVideosMetrics);
app.get("/channels", api.getChannels);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
