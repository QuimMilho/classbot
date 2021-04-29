module.exports = {
    name: 'week',
    description: 'Show weekdays Command',
    async execute(message, args) {
        const embed = message.client.embed;
        embed.setTitle('Weekdays:');
        embed.setDescription('MD - Monday\nTU - Tuesday\nWD - Wednesday\nTH - Thursday\nFD - Friday\nSA - Saturday\nSU - Sunday');
        embed.setColor("#FFF300");
        message.channel.send(embed);
    },
};