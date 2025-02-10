const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public/videos');
const testFilePath = path.join(directoryPath, 'testfile.txt');

fs.writeFile(testFilePath, 'Test content', (err) => {
  if (err) {
    console.error(`Directory is not writable. Error: ${err.message}`);
  } else {
    console.log('Directory is writable. Cleaning up test file...');
    fs.unlink(testFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Failed to delete test file. Error: ${unlinkErr.message}`);
      } else {
        console.log('Test file deleted successfully.');
      }
    });
  }
});
