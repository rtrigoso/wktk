import pj from './package.json';
import { program } from 'commander';
import { askInteractionType, InteractionTypes } from '@cli/interactions';
import { createLocalTunnel, isLocalTunnelUp } from '@sockets/host';
import { joinWS } from '@sockets/join';

async function cmd () {
    const OPTION_KEYS = Object.freeze({
        CHANNEL: 'channel',
        USERNAME: 'username',
        HOST: 'host',
        JOIN: 'join'
    });
    
    program
        .version(pj.version, '-v, --vers', 'output the current version')
        .option(`-j, --${OPTION_KEYS.HOST}`, 'host a new channel', false)
        .option(`-ch, --${OPTION_KEYS.CHANNEL} <type>`, 'channel name to join', '')
        .option(`-u, --${OPTION_KEYS.USERNAME} <type>`, 'overrides generated username if available', '');
    
    program.parse(process.argv);
    
    const options = program.opts();
    let url = ""

    if (options[OPTION_KEYS.HOST]) {
        console.log('host new channel');
    }

    if (options[OPTION_KEYS.CHANNEL]) {
        url = options[OPTION_KEYS.CHANNEL]
        console.log(`joining ${url}`)
        joinWS(url);
        return;
    }
    
    if (options[OPTION_KEYS.USERNAME]) {
        console.log(`attempting to join as ${options[OPTION_KEYS.CHANNEL]}`);
    }

    const isOk = await isLocalTunnelUp();
    if (!isOk) {
        console.log('localtunnel is an open-source tunneling solution used in this project. Tunnels are currently down, please try again later.');
        return;
    }
    
    const interactionType = await askInteractionType();
    switch(interactionType) {
        case InteractionTypes.HOST:
            const ltURL = await createLocalTunnel();
            console.log(ltURL);
            const childProcess = Bun.spawn(["/usr/local/bin/bun", "run", "serve.ts"]);
            console.log(childProcess.pid);
            joinWS(ltURL);
            break;
        case InteractionTypes.JOIN:
            joinWS(url);
            break;
    }
}

cmd();