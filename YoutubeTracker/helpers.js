require("dotenv").config();
const axios = require("axios");
const db = require("./queries");

// get information on the channel, makes a query to insert/update information for the channel
const refreshChannelInformation = async (id) => {
  const jsonData = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&key=${process.env.YOUTUBEAPIKEY}&id=${id}`
  );
  const values = parseChannelData(jsonData.data);
  await db.saveChannelData(values);
};

// gets information for each video, makes a query to insert/update video data and metrics
const refreshVideos = async (channelId, channelUpdated) => {
  let allVideoIds = await getAllVideoIds(channelId);
  let allVideoData = [];
  let allVideoMetrics = [];

  for (const videoId of allVideoIds) {
    let jsonData = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBEAPIKEY}&part=snippet,statistics,contentDetails&id=${videoId}`
    );
    allVideoData.push(parseVideoData(jsonData.data));
    allVideoMetrics.push(parseVideoMetrics(jsonData.data));
  }

  let resVideoData = await db.saveVideoData(allVideoData); // make one query to save all data from videos
  await db.saveVideoMetrics(allVideoMetrics, resVideoData); //chained after saveVideoData() video data must be saved first
};

// returns array of all the videoIds for the channel
const getAllVideoIds = async (channelId) => {
  let videosInfo = [];
  let nextPageToken = "";
  while (true) {
    const jsonData = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?maxResults=10&part=id&order=date&key=${process.env.YOUTUBEAPIKEY}&channelId=${channelId}&pageToken=${nextPageToken}`
    );
    nextPageToken = jsonData.data.nextPageToken;
    //loops until no next page token
    videosInfo.push(...jsonData.data.items);
    if (nextPageToken == undefined) break;
  }

  let videoIds = videosInfo
    .map((obj) => obj.id.videoId)
    .filter((item) => typeof item == "string"); //filter out undefined values

  return [...new Set(videoIds)]; //returns unique video_ids
};

const parseChannelData = (jsonData) => {
  return {
    channel_id: jsonData.items[0].id,
    channel_url: jsonData.items[0].snippet.customUrl,
    title: jsonData.items[0].snippet.title,
    description: jsonData.items[0].snippet.description,
    view_count: jsonData.items[0].statistics.viewCount,
    subscriber_count: jsonData.items[0].statistics.subscriberCount,
    video_count: jsonData.items[0].statistics.videoCount,
    image_url: jsonData.items[0].snippet.thumbnails.default.url,
    time_created: jsonData.items[0].snippet.publishedAt,
  };
};

const parseVideoData = (jsonData) => {
  return {
    video_id: jsonData.items[0].id,
    channel_id: jsonData.items[0].snippet.channelId,
    title: jsonData.items[0].snippet.title,
    duration: jsonData.items[0].contentDetails.duration,
    image_url: jsonData.items[0].snippet.thumbnails.default.url,
    time_published: jsonData.items[0].snippet.publishedAt,
  };
};

const parseVideoMetrics = (jsonData) => {
  return {
    video_id: jsonData.items[0].id,
    view_count: jsonData.items[0].statistics.viewCount,
    like_count: jsonData.items[0].statistics.likeCount,
    dislike_count: jsonData.items[0].statistics.dislikeCount,
    comment_count: jsonData.items[0].statistics.commentCount,
  };
};

module.exports = {
  refreshChannelInformation,
  refreshVideos,
};
