module.exports = {
    name: 'help',
    description: 'Help Command',
    async execute(message, args) {
        const embed = message.client.embed;
        embed.setColor('#6500FF');
        embed.setTitle('Help:');
        embed.setDescription('Go to http://quimmilho.net/classbot for more info about the bot!');
        message.channel.send(embed);
    },
};