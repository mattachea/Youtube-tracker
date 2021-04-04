# Youtube Tracker

By Matthew Chea

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
    channel_id text references channels(channel_id),
    time_updated timestamp default now(),
    view_count text,
    like_count text,
    dislike_count text,
    comment_count text);

create index channel_index on videos (channel_id);
create index videos_index_for_metrics on videos_metrics (video_id, time_updated);
create index channel_index_for_metrics on videos_metrics (channel_id);

```
