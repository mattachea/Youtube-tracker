const helpers = require("./helpers");
const db = require("./queries");

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

// refreshes channel information and refreshes all its videos' information and metrics
const refreshChannel = async (req, res) => {
  const id = req.params.id;
  try {
    const channelUpdated = await helpers.refreshChannelInformation(id);
    await helpers.refreshVideos(id, channelUpdated); //waits for channel refresh
    res.status(201).json(`channel_id ${id}: updated`);
  } catch (err) {
    console.error(err);
    res.status(403).json(`channel_id ${id}: error\n ${err}`);
  }
};

module.exports = {
  getChannels,
  getVideos,
  getVideosMetrics,
  refreshChannel,
};
