// Setup

const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
mysql = require('mysql');

const {
    prefix,
    token,
    mysql_user,
    mysql_password,
    mysql_database,
} = require('./config.json');

client.con = mysql.createConnection({
    host: "localhost",
    user: mysql_user,
    password: mysql_password,
    database: mysql_database
});

client.con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected!");
    
});

client.once('ready', () => {
    console.log('Ready!');
    setPrefix();
});

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.login(token);

// Commands

client.on('message', async message => {
    if (message.guild.prefix == null) message.guild.prefix = prefix;
    if (!(message.content.startsWith(message.guild.prefix)) || message.author.bot) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    const cmd = client.commands.get(command);
    try {
        client.embed = new Discord.MessageEmbed();
        cmd.execute(message, args);
    } catch (error) {
        console.error(error);
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Ocorreu um erro enquanto executavas esse comando!')
        .setFooter('Server info');
        message.channel.send(embed);
    }
});

// Timer

schedule.scheduleJob('0 * * * * *', async function() {
    var today = new Date();
    var h = today.getHours() - 1;
    var m = today.getMinutes() + 5;
    if (m > 59) {
        m = m - 60;
        h = h + 1;
    }
    var wd, day = today.getDay();
    if (h < 0) {
        h = h + 24;
        day = day - 1;
        if (day < 0) {
            day = day + 7;
        }
    }
    console.log(`São agora ${h}:${m}`);
    if (day === 0) {
        wd = "SU";
    } else if (day === 1) {
        wd = "MD";
    } else if (day === 2) {
        wd = "TU";
    } else if (day === 3) {
        wd = "WD";
    } else if (day === 4) {
        wd = "TH";
    } else if (day === 5) {
        wd = "FD";
    } else if (day === 6) {
        wd = "SA";
    }
    const cmd = "SELECT * FROM `Aulas` WHERE `wd` LIKE " + `'${wd}'` + " AND `hr` LIKE " + `'${h}:${m}'`;
    await client.con.query(cmd, function (err, result, fields) {
        if (err) throw err;
        var i;
        for (i = 0; i < result.length; i++) {
            const embed = new Discord.MessageEmbed()
                    .setColor("#FF8F00")
                    .setTitle(`Class ${result[i].name} in 5 minutes!`)
                    .setDescription(`Join here: ${result[i].link}`);
            if (result[i].password != null) {
                embed.addField('Password', `${result[i].password}`,true);
            }
            client.channels.cache.get(result[i].channelid).send(embed);
        }
    });
});

function setPrefix() {
    const cmd = "SELECT * FROM `Prefixo`";
    client.con.query(cmd, function(err, result, fields) {
        if (err) throw err;
        var i;
        for (i = 0; i < result.length; i++) {
            client.guilds.cache.get(result[i].guildid).prefix = result[i].prefix;
        }
    });
}

client.on('guildDelete', guild => {
    const cmd1 = "DELETE FROM `Prefixo` WHERE `guildid` LIKE " + `'${guild.id}'`;
    const cmd2 = "DELETE FROM `Aulas` WHERE `guildid` LIKE " + `'${guild.id}'`;
    client.con.query(cmd1, function (err, result, fields) {
        if (err) throw err;
    });
    client.con.query(cmd2, function (err, result, fields) {
        if (err) throw err;
    });
});

client.on('channelDelete', channel => {
    const cmd = "DELETE FROM `Aulas` WHERE `channelid` LIKE " + `'${channel.id}'`;
    client.con.query(cmd, function (err, result, fields) {
        if (err) throw err;
    });
});