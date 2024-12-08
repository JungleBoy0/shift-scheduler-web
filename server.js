const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the dist directory
app.use(express.static('dist'));

// Parse JSON bodies
app.use(express.json());

// Ensure calendars directory exists
const calendarsDir = path.join(__dirname, 'dist', 'calendars');
if (!fs.existsSync(calendarsDir)) {
  fs.mkdirSync(calendarsDir, { recursive: true });
}

// Handle calendar file saves
app.post('/save-calendar', (req, res) => {
  try {
    const { filename, content } = req.body;
    const filePath = path.join(calendarsDir, filename);
    fs.writeFileSync(filePath, content);
    res.json({ success: true, message: 'Kalendarz został zapisany' });
  } catch (error) {
    console.error('Error saving calendar:', error);
    res.status(500).json({ success: false, message: 'Błąd podczas zapisywania kalendarza' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});