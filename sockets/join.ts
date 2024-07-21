import WebSocket from "ws"
import { generate } from "random-words";

function handleMsgReceived (evt: WebSocket.MessageEvent) {
    const { data } = evt;
    console.log(data);
}

function createRandomUsername () {
    const s = [generate(2)].flat()
    const username = s.join('-');
    return username
}

export function joinWS(passedURL = "") {
    let url = passedURL;
    if (passedURL === "") {
        url = prompt('URL:') || '';
    }

    const username = createRandomUsername();
    const ws = new WebSocket(`ws://${url}`, { headers: { 'bypass-tunnel-reminder': 1, username } })
    ws.addEventListener('open', async () => {
        for await (const line of console) {
            ws.send(line);
            if (line.includes("over and out")) {
                ws.close();
                break;
            }
        }
        ws.terminate()
    });
    ws.addEventListener('message', handleMsgReceived)
}
