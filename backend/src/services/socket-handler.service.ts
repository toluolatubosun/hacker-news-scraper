import { CONFIGS } from "@/configs";
import StoryService from "@/services/v1/story.service";

import type { Socket } from "socket.io";

class SocketHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    async start() {
        const storiesInLast5MinsCount = await StoryService.getStoriesInLast5MinsCount();

        this.socket.emit("connected", {
            message: `Welcome to ${CONFIGS.APP_NAME} socket server, ${this.socket.data.$currentUser.name}`,
            stories_in_last_5_mins_count: storiesInLast5MinsCount
        });
    }
}

export default SocketHandler;
