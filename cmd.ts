import pj from './package.json';
import { program } from 'commander';
import { askInteractionType, InteractionTypes } from '@cli/interactions';
import { createLocalTunnel, isLocalTunnelUp, serveWS } from '@sockets/host';

async function cmd () {
    const OPTION_KEYS = Object.freeze({
        CHANNEL: 'channel',
        USERNAME: 'username',
        HOST: 'host'
    });
    
    program
        .version(pj.version, '-v, --vers', 'output the current version')
        .option(`-o, --${OPTION_KEYS.HOST}`, 'host a new channel', false)
        .option(`-ch, --${OPTION_KEYS.CHANNEL}`, 'channel name to join', '')
        .option(`-u, --${OPTION_KEYS.USERNAME}`, 'overrides generated username if available', '');
    
    program.parse(process.argv);
    
    const options = program.opts();

    if (options[OPTION_KEYS.HOST]) {
        console.log('init server');
    }

    if (options[OPTION_KEYS.CHANNEL]) {
        console.log('gets channel name');
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
            const tunnel = await createLocalTunnel();
            const { url } = tunnel;
            console.log(url);
            serveWS();
            break;
        case InteractionTypes.JOIN:
            console.log('join a server')
            break;
    }
}

cmd();