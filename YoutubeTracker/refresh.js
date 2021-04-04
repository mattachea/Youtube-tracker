require("dotenv").config();
const axios = require("axios");

// get all channels
const getChannels = async (req, res) => {
  try {
    const queryResult = await db.getAllChannels();
    res.status(200).json(queryResult);
  } catch (err) {
    console.error(err);
    res.status(403).json(err);
  }
};
//get all videos
const getVideos = async (req, res) => {
  try {
    const queryResult = await db.getAllVideos();
    res.status(200).json(queryResult);
  } catch (err) {
    console.error(err);
    res.status(403).json(err);
  }
};

// get all video metrics
const getVideosMetrics = async (req, res) => {
  try {
    const queryResult = await db.getAllVideosMetrics();
    res.status(200).json(queryResult);
  } catch (err) {
    console.error(err);
    res.status(403).json(err);
  }
};

module.exports = {
  getChannels,
  getVideos,
  getVideosMetrics,
};
