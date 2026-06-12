import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper to generate slug from title if not found
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

// Helper to extract text from HTML
function extractText(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Parse the docx content to extract blog data
function parseBlogContent(html, filename) {
  const blog = {
    titleEn: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    bodyEn: '',
    excerpt: '',
    category: 'Travel Tips',
    tags: [],
    status: 'published'
  };

  // Split into lines for easier parsing
  const lines = html.split('</p>');
  let contentStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = extractText(lines[i]);

    // Extract SEO elements
    if (line.includes('Title Tag:')) {
      blog.metaTitle = line.replace('Title Tag:', '').trim();
    } else if (line.includes('Meta Description:')) {
      blog.metaDescription = line.replace('Meta Description:', '').trim();
    } else if (line.includes('URL Slug:')) {
      blog.slug = line.replace('URL Slug:', '').trim();
    } else if (line.includes('Focus Keyword:')) {
      blog.focusKeyword = line.replace('Focus Keyword:', '').trim();
    }
  }

  // Find the H1 for the title
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    blog.titleEn = extractText(h1Match[1]);
  }

  // Get the content after H1 (remove SEO section and H1)
  let bodyHtml = html;

  // Remove everything before and including H1
  const h1Index = html.indexOf('</h1>');
  if (h1Index > -1) {
    bodyHtml = html.substring(h1Index + 5);
  }

  // Remove image data URLs (they're too large and we're not using images)
  bodyHtml = bodyHtml.replace(/<img[^>]*src="data:[^"]*"[^>]*>/gi, '');

  // Clean up empty paragraphs
  bodyHtml = bodyHtml.replace(/<p>\s*<\/p>/gi, '');
  bodyHtml = bodyHtml.replace(/<p>\s*<a[^>]*>\s*<\/a>\s*<\/p>/gi, '');

  blog.bodyEn = bodyHtml.trim();

  // Generate excerpt from first paragraph
  const firstParagraph = bodyHtml.match(/<p[^>]*>(.*?)<\/p>/i);
  if (firstParagraph) {
    blog.excerpt = extractText(firstParagraph[1]).substring(0, 200);
    if (blog.excerpt.length === 200) blog.excerpt += '...';
  }

  // If no slug was found, generate from title
  if (!blog.slug && blog.titleEn) {
    blog.slug = generateSlug(blog.titleEn);
  }

  // If no meta title, use the regular title
  if (!blog.metaTitle && blog.titleEn) {
    blog.metaTitle = blog.titleEn;
  }

  // Extract tags from focus keyword
  if (blog.focusKeyword) {
    blog.tags = blog.focusKeyword.split(',').map(t => t.trim()).filter(Boolean);
  }

  return blog;
}

async function importBlogs() {
  const blogsDir = '/var/www/luxuryegypt/Content/blogs/Travel Tips';

  try {
    const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.docx'));
    console.log(`Found ${files.length} blog files to import\n`);

    let imported = 0;
    let failed = 0;

    for (const file of files) {
      const filePath = path.join(blogsDir, file);
      console.log(`Processing: ${file}`);

      try {
        // Read and convert docx to HTML
        const result = await mammoth.convertToHtml({ path: filePath });
        const blog = parseBlogContent(result.value, file);

        if (!blog.titleEn || !blog.slug) {
          console.log(`  ⚠ Skipping - missing title or slug`);
          failed++;
          continue;
        }

        // Check if post already exists
        const existing = await pool.query(
          'SELECT id FROM posts WHERE slug = $1',
          [blog.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`  ⚠ Already exists with slug: ${blog.slug}`);
          failed++;
          continue;
        }

        // Insert into database
        await pool.query(
          `INSERT INTO posts (
            id, slug, title_en, body_en, excerpt, category, tags,
            focus_keyword, meta_title, meta_description, status, created_at, updated_at
          ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
          [
            blog.slug,
            blog.titleEn,
            blog.bodyEn,
            blog.excerpt,
            blog.category,
            blog.tags,
            blog.focusKeyword,
            blog.metaTitle,
            blog.metaDescription,
            blog.status
          ]
        );

        console.log(`  ✓ Imported: ${blog.titleEn}`);
        console.log(`    Slug: ${blog.slug}`);
        imported++;

      } catch (err) {
        console.log(`  ✗ Error: ${err.message}`);
        failed++;
      }
    }

    console.log(`\n========================================`);
    console.log(`Import complete!`);
    console.log(`  ✓ Imported: ${imported}`);
    console.log(`  ✗ Failed/Skipped: ${failed}`);
    console.log(`========================================`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

importBlogs();
