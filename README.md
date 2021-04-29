# classbot
This is the code for a discord bot that sends a embed message 5 minutes before it starts! Uses Mysql database and Discord.js v12

It will be updated soon with the ability to remember tests and exams

Commands
?add [weekdayId] [hour] [link] [name]
With this command you can add classes to your chat!
To see the weekdays you must do ?week
All hours must be in UTC+0!

?setpassword [id] [password]
With this command you can add a password to your class!
You can get the ids using ?list

?list
List every class in this chat!
Shows the classes id

?week
Shows the weekdays ids.

?remove [id|*]
Remove a class that no longer exists!
You can get the ids using ?list
Use * to delete all classes in this chat!

?prefix [character]
With this command you can change the prefix of this bot!
The prefix must be 1 character long!
