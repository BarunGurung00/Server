const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Set up the express app
const app = express();
const port = 3100;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());


// Configure multer to store files locally
const upload = multer({
  dest: 'uploads/', // directory to store uploaded files
  limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
});

// Middleware to create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploads')){
  fs.mkdirSync('uploads');
}

// Use this route to see if the server is running
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Route to test if the video is being sent correctly
app.post('/api/videoData', (req, res) => {
  const { videoUrl } = req.body;
  console.log("Received video URL:", videoUrl);
  if (videoUrl) {
    res.json({ message: 'Received video URL', videoUrl: videoUrl });
  } else {
    res.status(400).json({ message: 'No video URL provided' });
  }
});

// Route to upload a video file
app.post('/api/uploadVideo', upload.single('video'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log("Received video file:", req.file.originalname);
  
  // Access the file details
  const file = req.file;
  const originalName = file.originalname;
  const savedPath = path.join(__dirname, 'uploads', file.filename);

  // Rename the file to its original name
  fs.rename(savedPath, path.join(__dirname, 'uploads', originalName), (err) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to save file' });
      }

      res.status(200).json({
          message: 'File uploaded successfully',
          fileName: originalName
      });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
