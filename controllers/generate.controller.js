const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const clipdropApiKey = process.env.CLIPDROP_API_KEY;

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;
  const uploadsDir = path.join(__dirname, '..', 'public', 'images', 'uploads');

  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  try {
    const response = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      { prompt },
      {
        headers: {
          'x-api-key': clipdropApiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const filename = `generated_${Date.now()}.png`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, response.data);

    res.json({ success: true, filename });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    console.log(error)
    res.json({ success: false, error: "Failed to generate image. Try again." });
  }
};
