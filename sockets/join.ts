import WebSocket from "ws"
import { generate } from "random-words";
import readline  from 'node:readline';

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
        console.log('channel opened');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.addListener('line', line => {
            ws.send(line);
            if (line.includes("over and out")) {
                ws.close();
                return;
            }
        });
    });
    ws.addEventListener('message', handleMsgReceived)
}
