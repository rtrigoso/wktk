import type { ServerWebSocket } from "bun";
import localtunnel from 'localtunnel';

(async () => {
    interface ServerWebSocketDataType {
        username: string
    }

    const tunnel = await localtunnel({ port: 3000 });
    tunnel.url;
    console.log(tunnel.url);

    const res = await fetch("https://loca.lt/mytunnelpassword");
    const pass = await res.text();
    console.log(pass)

    Bun.serve({
        port: 3000,
        fetch(req, server) {
            if (server.upgrade(req, {
                data: {
                    username: req.headers.get("username")
                }
            })) return;

            return new Response("Upgrade failed", { status: 500 });
        },
        websocket: {
            open(ws: ServerWebSocket<ServerWebSocketDataType>) {
                const msg = `${ws.data?.username} has entered the chat`;
                console.log(msg);
                ws.subscribe("the-group-chat");
                ws.publish("the-group-chat", msg);
            },
            message(ws: ServerWebSocket<ServerWebSocketDataType>, message: string | Buffer): void | Promise<void> {
                ws.publish("the-group-chat", `${ws.data.username}: ${message}`);
                if (message.includes("over and out")) {
                    ws.publish("the-group-chat", `${ws.data.username} has excited the chat`);
                    ws.unsubscribe("the-group-chat");
                }
            }
        },
    });

    tunnel.on('close', () => {
        // tunnels are closed
    });
})();