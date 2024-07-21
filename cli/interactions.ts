import { select } from '@inquirer/prompts';

export const InteractionTypes = Object.freeze({
    HOST: 'host',
    JOIN: 'join'
});

export async function askInteractionType() {
    const answer = await select({
        message: 'Select mode:',
        choices: [
            {
                name: 'Host',
                value: InteractionTypes.HOST,
                description: 'serve a new channel for others to join',
            },
            {
                name: 'Join',
                value: InteractionTypes.JOIN,
                description: 'join an active channel',
            },
        ]
    });

    return answer;
}