import React, { useState, useEffect } from "react";

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoDetails, setVideoDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchVideos(query) {
    try {
      setLoading(true);

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=20&q=${query}&key=${import.meta.env.VITE_RAPIDAPI_KEY}`
      );

      const data = await response.json();

      if (!data.items) {
        setVideos([]);
        return;
      }

      const formattedVideos = data.items.map((video) => ({
        id: video.id.videoId,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.high.url,
      }));

      setVideos(formattedVideos);
      setSelectedVideo(null);
      setVideoDetails(null);
    } catch (error) {
      console.error(error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchVideoDetails(videoId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY
}`
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setVideoDetails(data.items[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchVideos("gaming");
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* NAVBAR */}
      <header className="border-b border-gray-800 sticky top-0 z-50 bg-[#0f0f0f]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">

          <div className="flex items-center gap-4">
            <button className="text-xl">☰</button>
            <div
              onClick={() => fetchVideos("gaming")}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="text-red-600 text-2xl">▶</span>
              <span className="text-lg font-semibold">YouTube</span>
            </div>
          </div>

          <div className="flex items-center w-[40%]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchVideos(searchQuery);
              }}
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-l-full outline-none"
            />
            <button
              onClick={() => fetchVideos(searchQuery)}
              className="px-6 py-2 bg-[#222] border border-gray-700 rounded-r-full hover:bg-gray-700"
            >
              🔍
            </button>
          </div>

          <div className="flex items-center gap-6 text-lg">
            <span>➕</span>
            <span>🔔</span>
            <span>👤</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6">

        {!selectedVideo ? (
          loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-400 text-lg">Loading videos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video.id);
                    fetchVideoDetails(video.id);
                  }}
                  className="cursor-pointer"
                >
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-3">
                    <h2 className="text-sm font-medium line-clamp-2">
                      {video.title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {video.channel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT SIDE */}
            <div className="flex-1">

              <div className="w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>

              {videoDetails && (
                <div className="mt-6">

                  <h1 className="text-2xl font-semibold leading-snug mb-3">
                    {videoDetails.snippet.title}
                  </h1>

                  <div className="text-sm text-gray-400 mb-4">
                    {parseInt(
                      videoDetails.statistics.viewCount
                    ).toLocaleString()}{" "}
                    views •{" "}
                    {new Date(
                      videoDetails.snippet.publishedAt
                    ).toLocaleDateString()}
                  </div>

                  <div className="bg-[#272727] p-4 rounded-xl text-sm text-gray-300 leading-relaxed">
                    {videoDetails.snippet.description}
                  </div>

                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-[380px] space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video.id);
                    fetchVideoDetails(video.id);
                  }}
                  className="flex gap-3 cursor-pointer hover:bg-[#1f1f1f] p-2 rounded-lg transition"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded-lg"
                  />

                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium leading-tight line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {video.channel}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default App;
