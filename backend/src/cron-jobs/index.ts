import cron from "node-cron";

import { prisma } from "@/db";
import { io as SocketIOInstance } from "@/index";
import {scrapeHackerNews, scrapeHackerNewsPage} from "@/lib/hacker-news-scraper";

const scrapeTop3LatestStoriesJob = cron.schedule(
    "*/10 * * * * *", // run every 10 seconds
    async () => {
        const { stories } = await scrapeHackerNewsPage(null);
        console.log("::> Scraped Hacker News newest page");

        const top3LatestStories = stories.slice(0, 3);

        SocketIOInstance.emit("top_3_latest_stories", top3LatestStories);
    },
    { scheduled: false, runOnInit: true }
);

const scrapeHackerNewsJob = cron.schedule(
    "*/5 * * * *", // run every 5 minutes
    async () => {
        const results = await scrapeHackerNews();
        console.log("::> Scraped Hacker News Stories", results.length);

        for (const story of results) {
            await prisma.story.upsert({
                where: { id: story.id },
                update: {}, // Don't update if exists
                create: {
                    id: story.id,
                    url: story.url,
                    title: story.title,
                    points: story.points,
                    author: story.author,
                    created_at: story.createdAt
                }
            });
        }
    },
    { scheduled: false, runOnInit: true }
);

export const startCronJobs = async () => {
    console.log("::> Starting Cron Jobs");

    scrapeHackerNewsJob.start();
    scrapeTop3LatestStoriesJob.start();
};
