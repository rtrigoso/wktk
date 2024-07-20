import { program } from 'commander';

function cmd () {
    const OPTION_KEYS = Object.freeze({
        CHANNEL: 'channel',
        USERNAME: 'username',
        HOST: 'host'
    });
    
    program
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
    
    console.log('nothing has been setup')
}

cmd();