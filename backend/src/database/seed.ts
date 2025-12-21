import * as dotenv from "dotenv";
import { connect, connection } from "mongoose";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/news-portal";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
  },
];

const news = [
  {
    id: 1,
    title: "Breaking: New Technology Revolutionizes Communication",
    body: "In a groundbreaking development, scientists have unveiled a new communication technology that promises to change the way we interact with each other. This innovation combines quantum computing with advanced AI algorithms to enable instantaneous and secure global communications. Experts believe this could be the biggest leap forward since the internet.",
    author_id: 1,
    created_at: "2025-12-01T10:00:00Z",
    comments: [
      {
        id: 1,
        news_id: 1,
        user_id: 1,
        text: "This is amazing news!",
        created_at: "2025-12-06T19:53:00.747Z",
      },
    ],
  },
  {
    id: 2,
    title: "Climate Change: World Leaders Agree on New Action Plan",
    body: "World leaders from over 150 countries have gathered at the Global Climate Summit to discuss and approve a comprehensive action plan to combat climate change. The plan includes ambitious targets for carbon emission reductions, renewable energy adoption, and funding for developing nations to transition to green energy. This historic agreement marks a significant step toward a sustainable future.",
    author_id: 2,
    created_at: "2025-12-02T08:30:00Z",
    comments: [],
  },
  {
    id: 3,
    title: "Sports: Local Team Wins National Championship",
    body: "In an thrilling final match, our local basketball team has won the national championship after a nail-biting overtime victory. The team showed incredible resilience and teamwork throughout the season, overcoming numerous challenges to reach the pinnacle of success. This is the first championship win in the team's 20-year history, making it even more special for fans and players alike.",
    author_id: 3,
    created_at: "2025-12-03T18:00:00Z",
    comments: [],
  },
  {
    id: 4,
    title: "Education: Universities Embrace Hybrid Learning Models",
    body: "Major universities across the country are permanently adopting hybrid learning models that combine in-person and online education. This shift, accelerated by recent global events, has proven to increase accessibility and flexibility for students while maintaining educational quality. Institutions are investing heavily in technology infrastructure and teacher training to ensure the success of these new learning environments.",
    author_id: 4,
    created_at: "2025-12-04T09:00:00Z",
    comments: [],
  },
  {
    id: 5,
    title: "Breaking News: Sample Title",
    body: "This is the full body content of the news article. It can contain multiple paragraphs and detailed information about the news story.",
    author_id: 1,
    created_at: "2025-12-07T10:00:00Z",
    comments: [],
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = connection.db;

    // Clear existing data
    console.log("Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("news").deleteMany({});

    // Insert seed data
    console.log("Inserting users...");
    await db.collection("users").insertMany(users);
    console.log(`Inserted ${users.length} users`);

    console.log("Inserting news...");
    await db.collection("news").insertMany(news);
    console.log(`Inserted ${news.length} news articles`);

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
