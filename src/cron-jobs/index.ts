import cron from "node-cron";

import scrapeHackerNews from "@/lib/hacker-news-scraper";

const scrapeHackerNewJob = cron.schedule(
    "0 * * * *", // run every 1 hour
    async () => {
        const results = await scrapeHackerNews();
        console.log("::> Scraped Hacker News Stories", results.length);

        // TODO
    },
    { scheduled: false, runOnInit: true }
);

export const startCronJobs = async () => {
    scrapeHackerNewJob.start();

    console.log("::> Cron Jobs Started");
};
