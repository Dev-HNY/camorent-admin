const sharp = require('sharp');
const fs = require('fs');

async function convertIcon() {
  try {
    // Convert to PNG
    await sharp('./assets/icon.png')
      .png()
      .toFile('./assets/icon-new.png');

    console.log('Icon converted successfully to assets/icon-new.png!');
    console.log('Please manually replace icon.png with icon-new.png');
  } catch (error) {
    console.error('Error converting icon:', error);
    process.exit(1);
  }
}

convertIcon();
