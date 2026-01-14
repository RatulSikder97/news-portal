import * as dotenv from "dotenv";
import { connect, connection } from "mongoose";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/news-portal";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = connection.db;

    // Clear existing data
    console.log("Dropping collections...");
    try { await db.collection("users").drop(); } catch (error) { /* ignore */ }
    try { await db.collection("news").drop(); } catch (error) { /* ignore */ }
    try { await db.collection("comments").drop(); } catch (error) { /* ignore */ }

    // 1. Insert Users (Let MongoDB generate _id)
    console.log("Inserting users...");
    const usersData = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "$2b$10$QIEhK4WGKrJlIinXJ.Im8uOp4JgA./pPF75H4c7Pnzb/Rh1zF6e6e",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "$2b$10$QIEhK4WGKrJlIinXJ.Im8uOp4JgA./pPF75H4c7Pnzb/Rh1zF6e6e",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: "$2b$10$QIEhK4WGKrJlIinXJ.Im8uOp4JgA./pPF75H4c7Pnzb/Rh1zF6e6e",
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        password: "$2b$10$QIEhK4WGKrJlIinXJ.Im8uOp4JgA./pPF75H4c7Pnzb/Rh1zF6e6e",
      },
    ];

    const usersResult = await db.collection("users").insertMany(usersData);
    const userIds = usersResult.insertedIds;
    console.log(`Inserted ${usersResult.insertedCount} users`);

    // 2. Insert News (Use User IDs from step 1)
    console.log("Inserting news...");
    const newsData = [
      {
        title: "Breaking: New Technology Revolutionizes Communication",
        body: "In a groundbreaking development, scientists have unveiled a new communication technology that promises to change the way we interact with each other. This innovation combines quantum computing with advanced AI algorithms to enable instantaneous and secure global communications. Experts believe this could be the biggest leap forward since the internet.",
        author_id: userIds[0],
        created_at: "2025-12-01T10:00:00Z",
      },
      {
        title: "Climate Change: World Leaders Agree on New Action Plan",
        body: "World leaders from over 150 countries have gathered at the Global Climate Summit to discuss and approve a comprehensive action plan to combat climate change. The plan includes ambitious targets for carbon emission reductions, renewable energy adoption, and funding for developing nations to transition to green energy. This historic agreement marks a significant step toward a sustainable future.",
        author_id: userIds[1],
        created_at: "2025-12-02T08:30:00Z",
      },
      {
        title: "Sports: Local Team Wins National Championship",
        body: "In an thrilling final match, our local basketball team has won the national championship after a nail-biting overtime victory. The team showed incredible resilience and teamwork throughout the season, overcoming numerous challenges to reach the pinnacle of success. This is the first championship win in the team's 20-year history, making it even more special for fans and players alike.",
        author_id: userIds[2],
        created_at: "2025-12-03T18:00:00Z",
      },
      {
        title: "Education: Universities Embrace Hybrid Learning Models",
        body: "Major universities across the country are permanently adopting hybrid learning models that combine in-person and online education. This shift, accelerated by recent global events, has proven to increase accessibility and flexibility for students while maintaining educational quality. Institutions are investing heavily in technology infrastructure and teacher training to ensure the success of these new learning environments.",
        author_id: userIds[3],
        created_at: "2025-12-04T09:00:00Z",
      },
      {
        title: "Breaking News: Sample Title",
        body: "This is the full body content of the news article. It can contain multiple paragraphs and detailed information about the news story.",
        author_id: userIds[0],
        created_at: "2025-12-07T10:00:00Z",
      },
    ];

    const newsResult = await db.collection("news").insertMany(newsData);
    const newsIds = newsResult.insertedIds;
    console.log(`Inserted ${newsResult.insertedCount} news articles`);

    // 3. Insert Comments (Use News and User IDs from previous steps)
    console.log("Inserting comments...");
    const commentsData = [
      {
        news_id: newsIds[0],
        user_id: userIds[0],
        text: "This is amazing news!",
        created_at: "2025-12-06T19:53:00.747Z",
      },
    ];

    const commentsResult = await db.collection("comments").insertMany(commentsData);
    console.log(`Inserted ${commentsResult.insertedCount} comments`);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await connection.close();
    process.exit(0);
  }
}

seed();
