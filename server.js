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

// List calendar files by name
app.get('/list-calendars', (req, res) => {
  try {
    const { name } = req.query;
    const files = fs.readdirSync(calendarsDir);
    const schedules = files
      .filter(file => file.startsWith(name) && file.endsWith('.ics'))
      .map(file => {
        const content = fs.readFileSync(path.join(calendarsDir, file), 'utf-8');
        const [baseName, month, yearWithExt] = file.split('_');
        const year = yearWithExt.replace('.ics', '');
        
        // Parse day and night shifts from ICS content
        const dayShifts = [];
        const nightShifts = [];
        
        content.split('\n').forEach(line => {
          if (line.includes('SUMMARY:Dzienna')) {
            const date = line.match(/(\d+)/);
            if (date) dayShifts.push(date[1]);
          } else if (line.includes('SUMMARY:Nocna')) {
            const date = line.match(/(\d+)/);
            if (date) nightShifts.push(date[1]);
          }
        });

        return {
          name: baseName,
          month: parseInt(month),
          year: parseInt(year),
          day_shifts: dayShifts,
          night_shifts: nightShifts
        };
      });

    res.json(schedules);
  } catch (error) {
    console.error('Error listing calendars:', error);
    res.status(500).json({ success: false, message: 'Błąd podczas listowania kalendarzy' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});