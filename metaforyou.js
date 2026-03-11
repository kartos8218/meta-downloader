const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.set("json spaces", 2);
app.use(morgan("dev"));

// Meta (Facebook/Instagram) route handler
const handleFacebookInstaDownload = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter." });
  }

  try {
    const data = await facebookInsta(url);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Meta (Facebook/Instagram) service function
const facebookInsta = async (url) => {
  const snapsave = require("metadownloader"); // This is the dependency used for downloading

  try {
    const result = await snapsave(url); // or snapsave.facebook(url) for FB links
    return result;
  } catch (error) {
    throw new Error("Error fetching media: " + error.message);
  }
};

// Define the /api/meta route
app.get('/api/meta/download', handleFacebookInstaDownload);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    author: "Milan Bhandari",
    contact: "https://www.milanb.com.np/",
    message: "Meta Downloader API is running",
    endpoint: "/api/meta/download?url=[instagram_or_facebook_url]"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Meta Downloader Server running on port ${PORT}`);
});

module.exports = { handleFacebookInstaDownload, facebookInsta };