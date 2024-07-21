import WebSocket from "ws"

async function initSendHandler(ws: WebSocket) {
    process.stdout.write('::');
    for await (const line of console) {
        ws.send(line);
        if (line.includes("over and out")) {
            ws.close();
            break;
        }
    }
    ws.terminate()
    return;
}

function handleMsgReceived (evt: WebSocket.MessageEvent) {
    const { data } = evt;
    console.log(data);
}

export function joinWS() {
    const url = prompt('URL:');
    const options = { 
        headers: {
            'bypass-tunnel-reminder': 1,
            'username': crypto.randomUUID() 
        } 
    };

    const ws = new WebSocket(`ws://${url}`, options)
    ws.addEventListener('open', () => {
        initSendHandler(ws);
    });
    ws.addEventListener('message', handleMsgReceived)
}
