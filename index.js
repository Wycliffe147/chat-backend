require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const HUGGINGFACE_TOKEN = `Bearer ${process.env.HUGGINGFACE_TOKEN}`;
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-0.5B-Instruct";

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: userMessage },
      {
        headers: {
          Authorization: HUGGINGFACE_TOKEN,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("Hugging Face API response:", response.data);

    let reply;

    // Handle different possible structures
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      reply = response.data[0].generated_text;
    } else if (response.data?.generated_text) {
      reply = response.data.generated_text;
    } else {
      reply = "Sorry, I didn’t understand.";
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error contacting Hugging Face:", error.response?.data || error.message);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
