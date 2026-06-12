
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, inquiries, pages, sections, posts, media, hotels } from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
const pooledUrl = connectionString.replace('.us-east-2', '-pooler.us-east-2');
const sql = neon(pooledUrl);
const db = drizzle(sql);

async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    
    // Try to create a simple test query first
    const result = await sql`SELECT 1 as test`;
    console.log("Database connection successful:", result);
    
    // Check if users table exists and has data
    try {
      const userCount = await sql`SELECT COUNT(*) FROM users`;
      console.log("Users table exists, count:", userCount);
    } catch (error) {
      console.log("Users table might not exist, error:", error.message);
    }
    
    console.log("Database initialization check completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

if (require.main === module) {
  initializeDatabase();
}
