module.exports = {
    name: 'setpassword',
    description: 'Sets a password to classes Command',
    async execute(message, args) {
        const con = message.client.con;
        const embed = message.client.embed;

        //Processing stuff

        if (args.length < 2) {
            embed.setTitle("That's not how you use this command!");
            embed.setColor("#ff0000");
            embed.setDescription("Try " + message.guild.prefix + "setpassword <id> <password>\nYou can see the ID at the list doing" + 
                    message.guild.prefix + "list");
            message.channel.send(embed);
            return;
        }

        var id = parseInt(args[0]);
        if (!Number.isInteger(id)) {
            embed.setTitle("Invalid ID!");
            embed.setColor("#ff0000");
            embed.setDescription("You can see the ID at the list doing" + 
                    message.guild.prefix + "list");
            message.channel.send(embed);
            return;
        }

        var password = '', i;

        for (i = 1; i < args.length - 1; i++) {
            password = password + `${args[i]} `;
        }
        password = password + `${args[i]}`;

        if (password.length > 32) {
            embed.setColor('#ff0000');
            embed.setTitle('Invalid password!');
            embed.setDescription('The password must have a maximum of 32 characters!');
            message.channel.send(embed);
            return;
        }

        //Mysql Stuff

        const cmd = "UPDATE `Aulas` SET `password` = " + `'${password}'` + " WHERE `id` LIKE " + `'${id}'` +
                " AND `channelid` LIKE " + `'${message.channel.id}'`;
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
                embed.setDescription(`You added a password to ${result.affectedRows} class!`);
                message.channel.send(embed);
            }
        });
    },
};