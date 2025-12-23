const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: "FACE_DETECTION" },
              { type: "LABEL_DETECTION" }
            ]
          }
        ]
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
