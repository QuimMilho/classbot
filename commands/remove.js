module.exports = {
    name: 'remove',
    description: 'Remove classes Command',
    async execute(message, args) {
        const con = message.client.con;
        const embed = message.client.embed;
        if (args.length != 1) {
            embed.setTitle("That's not how you use this command!");
            embed.setColor("#ff0000");
            embed.setDescription("Try " + message.guild.prefix + "remove <id>\nYou can see the ID at the list doing " + 
                    message.guild.prefix + "list");
            message.channel.send(embed);
            return;
        }
        var cmd, id = parseInt(args[0]);
        if (args[0] === '*') {
            cmd = "DELETE FROM `Aulas` WHERE `channelid` LIKE " + `'${message.channel.id}'`;
        } else if (Number.isInteger(id)) {
            cmd = "DELETE FROM `Aulas` WHERE `id` LIKE " + `'${parseInt(args[0])}'` + " AND `channelid` LIKE " + `'${message.channel.id}'`;
        } else {
            embed.setColor('#ff0000');
            embed.setTitle('Invalid ID');
            embed.setDescription('You must enter a valid number or * if you want to clear all classes!');
            message.channel.send(embed);
            return;
        }
        await con.query(cmd, function (err, result, fields) {
            if (err) throw err;
            if (result.affectedRows === 0) {
                embed.setColor('#FF00D0');
                embed.setTitle('Nothing happened!');
                embed.setDescription("The id you've inserted didn't exist!");
                message.channel.send(embed);
                return;
            } else {
                embed.setColor('#FF00D0');
                embed.setTitle('Success!');
                embed.setDescription(`There were removed ${result.affectedRows} classes from the list!`);
                message.channel.send(embed);
            }
        });
    },
};