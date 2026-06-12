import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const filePath = process.argv[2] || 'D:/Claude/I.luxuryegypt-main/content/blogs/Travel Tips/1. Do I Need a Visa for Egypt as a US Citizen_.docx';

async function readDocx() {
  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    console.log('=== HTML Content ===');
    console.log(result.value);
    console.log('\n=== Messages ===');
    console.log(result.messages);
  } catch (error) {
    console.error('Error:', error);
  }
}

readDocx();
