module.exports = {
    name: 'list',
    description: 'List classes in chat Command',
    async execute(message, args) {
        const con = message.client.con;
        const embed = message.client.embed;
        const cmd = "SELECT `id`, `wd`, `hr`, `name` FROM `Aulas` WHERE `channelid` LIKE " + `'${message.channel.id}'`;
        await con.query(cmd, function (err, result, fields) {
            if (err) throw err;
            if (result.length === 0) {
                embed.setColor('#00FFFD');
                embed.setTitle('List of classes!');
                embed.setDescription("There aren't any classes in this chat!");
                message.channel.send(embed);
                return;
            }
            var i, str = '';
            for (i = 0; i < result.length - 1; i++) {
                str = str + `id: ${result[i].id}, Weekday: ${result[i].wd}, Hour: ${result[i].hr}, Name: ${result[i].name}\n`;
            }
            str = str + `id: ${result[i].id}, Weekday: ${result[i].wd}, Hour: ${result[i].hr}, Name: ${result[i].name}`;
            embed.setColor('#00FFFD');
            embed.setTitle('List of classes!');
            embed.setDescription(str);
            message.channel.send(embed);
        });
    },
};