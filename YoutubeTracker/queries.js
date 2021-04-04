require("dotenv").config();
const pgp = require("pg-promise")();
const connection = {
  host: `${process.env.PGHOST}`,
  port: `${process.env.PGPORT}`,
  database: `${process.env.PGDATABASE}`,
  user: `${process.env.PGUSER}`,
  password: `${process.env.PGPASSWORD}`,
  max: 30, // use up to 30 connections
};
const db = pgp(connection);

const saveVideoData = async (data) => {
  //performs on each obj: "INSERT INTO videos (video_id, channel_id, title, duration, image_url, time_published) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (video_id) DO UPDATE SET (title, duration, image_url, time_published) = ($3, $4, $5, $6)",
  const cs = new pgp.helpers.ColumnSet(
    [
      "video_id",
      "channel_id",
      "title",
      "duration",
      "image_url",
      "time_published",
    ],
    { table: "videos" }
  );
  let query =
    pgp.helpers.insert(data, cs) +
    " ON CONFLICT(video_id) DO UPDATE SET " +
    cs.assignColumns({ from: "EXCLUDED", skip: ["video_id"] });
  let res = await db.none(query);
  console.log(`video information updated`);
};

const saveVideoMetrics = async (data, videoData) => {
  //performs on each obj: "INSERT INTO videos_metrics (video_id, view_count, like_count, dislike_count, comment_count) VALUES ($1, $2, $3, $4, $5)",
  const cs = new pgp.helpers.ColumnSet(
    ["video_id", "view_count", "like_count", "dislike_count", "comment_count"],
    { table: "videos_metrics" }
  );
  let query = pgp.helpers.insert(data, cs);
  let queryDone = await db.none(query);
  console.log(`video metrics updated`);
};

const saveChannelData = async (data) => {
  db.none(
    "INSERT INTO channels (channel_id, channel_url, title, description, view_count, subscriber_count, video_count, image_url, time_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (channel_id) DO UPDATE SET (channel_id, channel_url, title, description, view_count, subscriber_count, video_count, image_url, time_created) = ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    Object.values(data)
  )
    .then(() =>
      console.log(`channel_id: ${data.channel_id} information updated`)
    )
    .catch((err) => console.error(err));
};

const getAllChannels = async () => {
  const query = "SELECT * FROM channels";
  return db
    .any(query)
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

const getAllVideos = async () => {
  const query = "SELECT * FROM videos";
  return db
    .any(query)
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

const getAllVideosMetrics = async () => {
  const query = "SELECT * FROM videos_metrics";
  return db
    .any(query)
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

module.exports = {
  saveVideoData,
  saveVideoMetrics,
  saveChannelData,
  getAllChannels,
  getAllVideos,
  getAllVideosMetrics,
};
