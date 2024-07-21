import type { ServerWebSocket } from "bun";
import { generate } from "random-words";
import localtunnel from 'localtunnel';

export interface ServerWebSocketDataType {
    username: string
}

export async function isLocalTunnelUp (): Promise<boolean> {
    const timeoutInSeconds = 1000 * 1;
    const url = 'https://localtunnel.me';
    let res;

    try {
        res = await fetch(url, { 
            signal: AbortSignal.timeout(timeoutInSeconds),
            redirect: 'follow' 
        });
    }
    catch(err) {
        return false;
    }
    
    return res.ok && res.status > 199 && res.status < 300;
}

export async function createLocalTunnel (port:number = 3000): Promise<string> {
    const tunnel = await localtunnel({ port });
    const url = new URL(tunnel.url);

    return url.host;
}

export function serveWS (port:number = 3000): void {
    const data:ServerWebSocketDataType = {
        username: ''
    }

    const server = Bun.serve({
        port,
        fetch(req, server) {
            const randomUsername = generate({ wordsPerString: 2, minLength: 5, separator: "_", join: "" })
            data.username = req.headers.get("username") || randomUsername;
            const isOk = server.upgrade(req, { data });
            if (isOk) return;

            return new Response("Upgrade failed", { status: 500 });
        },
        websocket: {
            open(ws: ServerWebSocket<ServerWebSocketDataType>) : void {
                const msg = `${ws.data.username} has entered the chat`;
                console.log(msg);
                ws.subscribe("the-group-chat");
                ws.publish("the-group-chat", msg);
            },
            message(ws: ServerWebSocket<ServerWebSocketDataType>, message: string ): void {
                const { username } = ws.data;
                ws.publish("the-group-chat", `${username}: ${message}`);
                if (!message.includes("over and out")) return;

                ws.publish("the-group-chat", `${ws.data.username} has excited the chat`);
                ws.unsubscribe("the-group-chat");
            }
        },
    });

    
}