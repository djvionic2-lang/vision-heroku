app.post("/analyze", async (req, res) => {
  console.log("✅ /analyze HIT");
  console.log("BODY:", req.body);
  console.log("imageBase64 length:", req.body?.imageBase64?.length);

  try {
    const visionResp = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        requests: [{
          image: { content: req.body.imageBase64 },
          features: [{ type: "LABEL_DETECTION" }]
        }]
      }
    );

    console.log("✅ Vision OK");
    return res.json({ ok: true, vision: visionResp.data });

  } catch (err) {
    console.log("❌ Vision ERROR:", err?.response?.data || err.message);
    return res.status(500).json({ ok: false, error: err?.response?.data || err.message });
  }
});
