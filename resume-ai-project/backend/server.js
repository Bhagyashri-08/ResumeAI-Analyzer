const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      resumeText = fs.readFileSync(req.file.path, 'utf-8');
      fs.unlinkSync(req.file.path);
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: 'No resume provided' });
    }

    const jd = req.body.jobDescription || '';
    const jdSection = jd ? `\n\nJOB DESCRIPTION:\n${jd}` : '';

    const prompt = `You are an expert ATS resume analyzer for the Indian job market. Analyze the resume and return ONLY a valid JSON object. No explanation, no markdown, no text before or after the JSON.

RESUME:
${resumeText}${jdSection}

Return ONLY this JSON (fill all values):
{"ats_score":75,"verdict":"2-3 sentence assessment here","score_breakdown":{"Keywords":70,"Formatting":80,"Impact & Metrics":60,"Experience":75,"Skills Match":70},"keywords_found":["React.js","Node.js","MongoDB","Express.js","Git","REST API"],"keywords_missing":["TypeScript","AWS","Docker","CI/CD","Redis"],"strengths":["strength 1","strength 2","strength 3"],"fixes":["fix 1","fix 2","fix 3","fix 4"],"shortlist_chance":"Medium","best_roles":["Junior Full Stack Developer","React Developer","MERN Stack Developer"]}`;

    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
      return res.status(500).json({ error: 'Missing GROQ_API_KEY in .env file' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON API. You only respond with valid JSON objects. Never include markdown, code blocks, or any text outside the JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log('Groq status:', response.status);

    if (!data.choices || !data.choices[0]) {
      console.log('Groq error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Groq API error: ' + (data.error?.message || 'Unknown error') });
    }

    const raw = data.choices[0].message.content || '';
    console.log('Raw response:', raw.slice(0, 200));

    const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonStart = clean.indexOf('{');
    const jsonEnd = clean.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.log('No JSON found in:', clean);
      return res.status(500).json({ error: 'AI did not return valid JSON. Try again.' });
    }

    const jsonStr = clean.substring(jsonStart, jsonEnd + 1);
    const result = JSON.parse(jsonStr);
    res.json(result);

  } catch (err) {
    console.error('SERVER ERROR:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
