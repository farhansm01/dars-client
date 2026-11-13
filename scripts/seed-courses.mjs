import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp 2026",
    description: "Master modern web development from HTML, CSS, JavaScript to React, Node.js, Express, and MongoDB.",
    price: 4500,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    lectures: [
      {
        title: "Introduction to Modern Web Architecture",
        description: "Understanding client-server model, HTTP protocols, and full-stack structure.",
        videoUrl: "https://www.youtube.com/watch?v=zJSY8tbf_ys",
      },
      {
        title: "JavaScript ES6+ Deep Dive",
        description: "Arrow functions, destructuring, promises, async/await, and modules.",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      },
      {
        title: "React Fundamentals & Hooks",
        description: "Components, props, useState, useEffect, and component lifecycle.",
        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
      },
    ],
  },
  {
    title: "Next.js 15 & React 19 Full-Stack Masterclass",
    description: "Build production-grade web applications using the Next.js App Router, Server Components, and Server Actions.",
    price: 5500,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    lectures: [
      {
        title: "App Router & Server Components Explained",
        description: "How React Server Components and App Router file conventions work.",
        videoUrl: "https://www.youtube.com/watch?v=ZVnjOPwW444",
      },
      {
        title: "Data Fetching & Server Actions",
        description: "Mutation patterns, revalidation, and caching strategies in Next.js.",
        videoUrl: "https://www.youtube.com/watch?v=d5x0JCb2eLQ",
      },
    ],
  },
  {
    title: "Backend API Engineering with Node & Express",
    description: "Design clean REST APIs, implement JWT authentication, MongoDB schemas, error handling, and MVC architecture.",
    price: 3800,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    lectures: [
      {
        title: "Node.js Event Loop & Express Middleware",
        description: "Core internals of Node.js runtime and designing robust middleware chains.",
        videoUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
      },
      {
        title: "MongoDB Schema Design & Native Driver",
        description: "Aggregation pipelines, indexes, connection pools, and query optimization.",
        videoUrl: "https://www.youtube.com/watch?v=ofme2o29ngU",
      },
    ],
  },
];

async function seed() {
  await client.connect();
  const db = client.db("dars");
  const coursesCol = db.collection("courses");
  const lecturesCol = db.collection("lectures");

  // Clear existing courses and lectures
  await coursesCol.deleteMany({});
  await lecturesCol.deleteMany({});
  console.log("Cleared existing courses and lectures.");

  for (const item of sampleCourses) {
    const { lectures, ...courseData } = item;
    const courseInsert = await coursesCol.insertOne({
      ...courseData,
      createdAt: new Date(),
    });

    const courseId = courseInsert.insertedId.toString();
    console.log(`Created course: "${courseData.title}" (ID: ${courseId})`);

    for (const lec of lectures) {
      await lecturesCol.insertOne({
        course: courseId,
        title: lec.title,
        description: lec.description,
        videoUrl: lec.videoUrl,
        createdAt: new Date(),
      });
    }
    console.log(`  Added ${lectures.length} lectures.`);
  }

  console.log("✅ Seed completed successfully!");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => client.close());
