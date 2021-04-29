module.exports = {
    name: 'ping',
    description: 'Ping Command',
    async execute(message, args) {
        message.channel.send('Pong!');
    },
};