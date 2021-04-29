module.exports = {
    name: 'prefix',
    description: 'Change the prefix Command',
    async execute(message, args) {
        const embed = message.client.embed;
        if (args.length != 1) {
            embed.setTitle("That's not how you use this command!");
            embed.setColor("#ff0000");
            embed.setDescription("Try " + message.guild.prefix + "prefix <new prefix>\nThe prefix must have only 1 character!");
            message.channel.send(embed);
            return;
        }
        if (args[0].length != 1) {
            embed.setTitle("That's not how you use this command!");
            embed.setColor("#ff0000");
            embed.setDescription("Try " + message.guild.prefix + "prefix <new prefix>\nThe prefix must have only 1 character!");
            message.channel.send(embed);
            return;
        }
        const cmd1 = "DELETE FROM `Prefixo` WHERE `guildid` LIKE " + `'${message.guild.id}'`;
        message.client.con.query(cmd1, function (err, result, fields) {
            if (err) throw err;
            const cmd2 = "INSERT INTO `Prefixo` (`guildid`, `prefix`) VALUES " + `('${message.guild.id}', '${args[0]}');`;
            message.client.con.query(cmd2, function (err2, result, fields) {
                if (err2) throw err2;
                message.guild.prefix = args[0];
                embed.setColor('#6500FF');
                embed.setTitle('The prefix was changed!');
                embed.setDescription(`The new prefix is now ${args[0]}`);
                message.channel.send(embed);
            });
        });
    },
};