const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "10mb" })); // para imágenes en base64

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

app.get("/", (req, res) => {
  res.send("OK: RealityCheck API is running ✅");
});

app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!GOOGLE_VISION_API_KEY) {
      return res.status(500).json({ error: "Missing GOOGLE_VISION_API_KEY in Heroku Config Vars" });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body" });
    }

    const visionResp = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: "FACE_DETECTION" },
              { type: "LABEL_DETECTION" },
              { type: "SAFE_SEARCH_DETECTION" }
            ]
          }
        ]
      }
    );

    return res.json({ ok: true, vision: visionResp.data });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
