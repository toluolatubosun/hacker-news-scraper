import axios from "axios";
import * as cheerio from "cheerio";

import { CONFIGS } from "@/configs";

interface HackerNewsStory {
    id: number;
    title: string;
    url: string | null;
    points: number;
    author: string;
    createdAt: Date;
}

interface ScrapedHackerNewsPage {
    stories: HackerNewsStory[];
    nextPageQueryParameter: string | null;
}

const scrapeHackerNewsPage = async (pageQueryParameter: string | null): Promise<ScrapedHackerNewsPage> => {
    try {
        // Fetch the page and load it into cheerio
        const response = await axios.get(`${CONFIGS.HACKER_NEWS.NEWEST_URL}?${pageQueryParameter}`);
        const $ = cheerio.load(response.data);
        const stories: HackerNewsStory[] = [];

        // Loop through each story and extract the data
        $(".athing").each((_index, element) => {
            const id = parseInt($(element).attr("id") as string);
            const title = $(element).find(".titleline > a").text();
            let url = $(element).find(".titleline > a").attr("href") || null;
            if (url && !url.startsWith("http")) url = null;

            const subtext = $(element).next();

            const points = parseInt(subtext.find(".score").text()) || 0;
            const author = subtext.find(".hnuser").text();
            const createdAt = new Date(subtext.find(".age").attr("title")?.split(" ")[0] || "");

            stories.push({
                id,
                url,
                title,
                points,
                author,
                createdAt
            });
        });

        // Extract the next page query parameter
        const nextPageQueryParameter = $(".morelink").attr("href")?.split("?")[1] || null;

        return { stories, nextPageQueryParameter };
    } catch (error) {
        console.error("Scraping error:", error);
        return { stories: [], nextPageQueryParameter: null };
    }
};

const scrapeHackerNews = async () => {
    const MAX_PAGES_TO_SCRAPE = 10;
    console.log(`::> Scraping ${MAX_PAGES_TO_SCRAPE} pages of Hacker News`);

    let nextPageQueryParameter = null;
    const stories: HackerNewsStory[] = [];

    // Loop through the pages and scrape the data
    for (let i = 0; i < MAX_PAGES_TO_SCRAPE; i++) {
        const result: ScrapedHackerNewsPage = await scrapeHackerNewsPage(nextPageQueryParameter);

        // Update the stories and next page query parameter
        stories.push(...result.stories);
        nextPageQueryParameter = result.nextPageQueryParameter;

        // Break if there is no next page
        if (!nextPageQueryParameter) break;

        console.log("::> On Page:", i + 1, "Fetched:", result.stories.length, "stories");
    }

    console.log("::> Total Stories Fetched:", stories.length);

    return stories;
};

export default scrapeHackerNews;
