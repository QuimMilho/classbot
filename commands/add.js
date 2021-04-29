module.exports = {
    name: 'add',
    description: 'Add classes Command',
    async execute(message, args) {
        const con = message.client.con;
        const embed = message.client.embed;
        var id;

        //Check limits

            //CMD

        if (args.length < 4) {
            embed.setTitle("That's not how you use this command!");
            embed.setColor("#ff0000");
            embed.setDescription("Try " + message.guild.prefix + "add <weekday> <hour UTC+0> <link> <name>\nFor the list of weekdays please use " + message.guild.prefix + "week");
            message.channel.send(embed);
            return;
        }

        //STEPS (Starts in 1 and goes on, keeps everything syncronyzed)

        step1(message, args, con, embed);

    },
};

async function step1(message, args, con, embed) {
    var id = 0, i;
    const cmd1 = "SELECT `id` FROM `Aulas` WHERE `channelid` LIKE " + `'${message.channel.id}'`;
    await con.query(cmd1, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 32) {
            embed.setTitle("You've reached the limit of classes you can have in this chat!");
            embed.setColor("#ff0000");
            embed.setDescription("You can only have 32 classes per chat!");
            message.channel.send(embed);
            return;
        }
        for (i = 0; i < result.length; i++) {
            if (parseInt(result[i].id) === id) {
                id = id + 1;
                i = -1;
            }
        }
        //STEP 2
        step2(message, args, con, embed, id);
    });
}

async function step2(message, args, con, embed, id) {
    const cmd2 = "SELECT `id` FROM `Aulas` WHERE `guildid` LIKE " + `'${message.guild.id}'`;
    await con.query(cmd2, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 128) {
            embed.setTitle("You've reached the limit of classes you can have in this server!");
            embed.setColor("#ff0000");
            embed.setDescription("You can only have 128 classes per guild!");
            message.channel.send(embed);
            return;
        }
        //STEP 3
        step3(message, args, con, embed, id);
    });
}

async function step3(message, args, con, embed, id) {
//Processing

        //CHANNEL ID
    
    var channelid = message.channel.id;

        //GUILD ID

    var guildid = message.guild.id;

        //WEEKDAY
    
    var wd = args[0];
    if (wd != 'MD' && wd != 'WD' && wd != 'TU' && wd != 'TH' && wd != 'FD' && wd != 'SA' && wd != 'SU') {
        embed.setColor('#ff0000');
        embed.setTitle('Invalid weekday!');
        embed.setDescription('Do ' + message.guild.prefix + 'week to se the valid weekday codes!');
        message.channel.send(embed);
        return;
    }

        //HOURS

    var h, m;
    try {
        var time = args[1].split(':');
        h = parseInt(time[0]);
        m = parseInt(time[1]);
        if (h > 23 || h < 0) {
            embed.setColor('#ff0000');
            embed.setTitle('Invalid hour format!');
            embed.setDescription('Use "hour:minute" in UTC+0');
            message.channel.send(embed);
            return;
        }
        if (m > 59 || m < 0) {
            embed.setColor('#ff0000');
            embed.setTitle('Invalid hour format!');
            embed.setDescription('Use "hour:minute" in UTC+0');
            message.channel.send(embed);
            return;
        }
    } catch (err) {
        embed.setColor('#ff0000');
        embed.setTitle('Invalid hour format!');
        embed.setDescription('Use "hour:minute" in UTC+0');
        message.channel.send(embed);
        return;
    }
    if (!Number.isInteger(h) || !Number.isInteger(m)) {
        embed.setColor('#ff0000');
        embed.setTitle('Invalid hour format!');
        embed.setDescription('Use "hour:minute" in UTC+0');
        message.channel.send(embed);
        return;
    }

        //LINK

    const link = args[2];
    if (link.length > 100) {
        embed.setColor('#ff0000');
        embed.setTitle('Invalid link!');
        embed.setDescription('The link must have a maximum of 100 characters!\nYou can short it using some websites like https://bitly.com!');
        message.channel.send(embed);
        return;
    }

        //NAME

    var i, name = '';
    for (i = 3; i < args.length - 1; i++) {
        name = name + args[i] + ' ';
    }
    name = name + args[i];

    if (name.length > 32) {
        embed.setColor('#ff0000');
        embed.setTitle('Invalid name!');
        embed.setDescription('The name must have a maximum of 32 characters!');
        message.channel.send(embed);
        return;
    }

    //Add

    const cmd4 = "INSERT INTO `Aulas` (`id`, `channelid`, `wd`, `hr`, `link`, `name`, `guildid`) VALUES" + 
            `('${id}', '${channelid}', '${wd}', '${h}:${m}', '${link}', '${name}', '${guildid}')`;
    await con.query(cmd4, function (err, result, fields) {
        if (err) throw err;
        embed.setColor('#00ff00');
        embed.setTitle('Class added!');
        message.channel.send(embed);
    });
}