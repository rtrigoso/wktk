import WebSocket from "ws"

(async () => {
    const url = prompt('URL:');

    const ws = new WebSocket(`ws://${url}`, { headers: { 'bypass-tunnel-reminder': 1, 'username': crypto.randomUUID() } })
    ws.addEventListener('open', async () => {
        const prompt = 'test message:';
        process.stdout.write(prompt);
        for await (const line of console) {
            ws.send(line);
            if (line.includes("over and out")) {
                ws.close();
                break;
            }
        }
        ws.terminate()
        return;
    });
    ws.addEventListener('message', ({ data }) => {
        console.log(data);
    })
})();
