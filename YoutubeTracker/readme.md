# Youtube Tracker

By Matthew Chea

## To run:

git clone https://github.com/mattachea/Youtube-tracker.git
cd YoutubeTracker
npm install

You can can the database credentials and Youtube API key in the .env file

### Examples:

I used postman to test the endpoints:

GET http://localhost:3000/channels/

GET http://localhost:3000/videos/

GET http://localhost:3000/videosMetrics/

GET http://localhost:3000/fastestPastWeek

GET http://localhost:3000/fastestPastFiveMinutes

PUT http://localhost:3000/channels/UCiGm_E4ZwYSHV3bcW1pnSeQ

## Endpoints

/videos
returns all videos in database

/channels
returns all channels in database

/videosMetrics
returns all data for video metrics

/fastestGrowing
returns the top five fastest growing videos (by view count) over this past week

/channels/:id
refreshes channel information and all its videos' information, and tracks growth for the channel's videos

## Database

```sql
create table channels
    (channel_id text primary key,
    channel_url text,
    title text,
    description text,
    view_count text,
    subscriber_count text,
    video_count text,
    image_url text,
    time_created text,
    uploads_playlist text);

create table videos
    (video_id text primary key,
    channel_id text references channels(channel_id),
    title text,
    duration text,
    image_url text,
    time_published text);

create table videos_metrics
    (video_id text references videos(video_id),
    time_updated timestamp default now(),
    view_count text,
    like_count text,
    dislike_count text,
    comment_count text);

create index channel_index on videos (channel_id);
create index videos_index_for_metrics on videos_metrics (video_id, time_updated);

```

## Google API

- fetch channel data
- fetch all videoIds from google (could take a few calls due to limit of 50 per call)
- fetch data for each videoId

### Getting an individual channel's information

https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&key={api_key}&id=UC9CoOnJkIBMdeijd9qYoT_g

### Getting video ids for a channel (50 at a time, need page_token to get next page), filter out video ids

https://www.googleapis.com/youtube/v3/search?maxResults=50&part=id&order=date&key={api_key}&channelId={channel_id}&pageToken={page_token}

### Getting an individual video's information

https://www.googleapis.com/youtube/v3/videos?key={api_key}&part=snippet,statistics,contentDetails&id={video_id}

### Thoughts to reduce number of calls:

- query our database for the videoIds for a channel, then fetching pages from Google and when you encounter an already saved videoId stop fetching pages, this only saves a few calls due to small number of videos per channel anyway

- couldn't find a better way other than one call per videoId to get video statistics

## Top 5 Fastest Growing Videos

select video_id, max(view_count) as max_views, min(view_count) as min_views, max(view_count)::INTEGER-min(view_count)::INTEGER as views
from videos_metrics
where time_updated > now() - interval '5 hour'
group by video_id
order by views desc
limit 5;
