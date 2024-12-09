const express = require('express');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
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

// Validate ICS content
const validateIcsContent = (content) => {
  // Basic validation of ICS structure
  const requiredFields = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'END:VCALENDAR'];
  return requiredFields.every(field => content.includes(field)) &&
         !content.includes('..') && // Prevent directory traversal
         !content.includes('<script') && // Prevent XSS
         content.length < 1000000; // Limit file size
};

// Handle calendar file saves
app.post('/save-calendar', (req, res) => {
  try {
    const { filename, content } = req.body;
    
    // Sanitize filename and validate path
    const sanitizedFilename = sanitize(filename);
    if (!sanitizedFilename.endsWith('.ics')) {
      throw new Error('Invalid file extension');
    }

    // Validate content
    if (!validateIcsContent(content)) {
      throw new Error('Invalid ICS content');
    }

    const filePath = path.join(calendarsDir, sanitizedFilename);
    
    // Ensure we're still in the calendars directory
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(calendarsDir))) {
      throw new Error('Invalid file path');
    }

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
        
        const lines = content.split('\n');
        let currentEvent = null;
        
        lines.forEach(line => {
          if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
          } else if (line.startsWith('DTSTART:')) {
            if (currentEvent) {
              const date = line.substring(8);
              currentEvent.date = date.substring(6, 8); // Extract day from YYYYMMDD
            }
          } else if (line.startsWith('SUMMARY:')) {
            if (currentEvent) {
              currentEvent.type = line.includes('Dzienna') ? 'day' : 'night';
            }
          } else if (line.startsWith('END:VEVENT')) {
            if (currentEvent) {
              if (currentEvent.type === 'day') {
                dayShifts.push(currentEvent.date);
              } else {
                nightShifts.push(currentEvent.date);
              }
            }
            currentEvent = null;
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