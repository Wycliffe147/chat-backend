require('dotenv').config();  // Add this line at the top of index.js
const HUGGINGFACE_TOKEN = `Bearer ${process.env.HUGGINGFACE_TOKEN}`;


const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-3B";

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

    const reply = response.data[0]?.generated_text || "Sorry, I didn’t understand.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
