import { CONFIGS } from "@/configs";
import type { Socket } from "socket.io";

class SocketHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    async start() {
        this.socket.emit("connected", {
            message: `Welcome to ${CONFIGS.APP_NAME} socket server, ${this.socket.data.$currentUser.name}`
        });
    }
}

export default SocketHandler;
