require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const api = require("./endpoints");

app.get("/", (req, res) => res.json({ info: "Youtube Tracker" }));
app.get("/videos/", api.getVideos);
app.get("/videosMetrics/", api.getVideosMetrics);
app.get("/channels", api.getChannels);
app.put("/channels/:id", api.refreshChannel);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
