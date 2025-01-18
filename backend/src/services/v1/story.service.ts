import ms from "ms";

import { prisma } from "@/db";

class StoryService {
    async getStoriesInLast5MinsCount() {
        const fiveMinutesAgo = new Date(Date.now() - ms("5m"));

        return await prisma.story.count({
            where: {
                created_at: {
                    gte: fiveMinutesAgo
                }
            }
        });
    }
}

export default new StoryService();