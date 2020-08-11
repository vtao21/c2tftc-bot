require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const math = require("mathjs")

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

async function fetchAsync(url) {
    let response = await fetch(url)
    let data = await response.text()
    return data
}

async function getDays(data) {
    let days = data.match(/<meta itemprop='description' content='(.*?)' \/>/g);
    days = days.map(str => str.substring(38, str.indexOf("' />")))
    return days
}

const formatWords = (str) => {
    let words = str.split(" ")
    words = words.map(word => word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase());
    return words.join(" ")
}

const formatDays = (days) => {
    let message = "Happy "
    for (let i = 0; i < days.length; i ++){
        if (i == days.length-1) {
            message += "and " + formatWords(days[i]) + "!"
        } else {
            message += formatWords(days[i]) + ", "
        }
    }
    return message
}

client.on('message', msg => {
    if (msg.content.toLowerCase().indexOf("say ") >= 0 && !msg.author.bot) {
        const newMessage = msg.content.substring(msg.content.indexOf("say ") + 4, msg.content.length);
        msg.channel.send(newMessage);
    }

    if (msg.content.toLowerCase().indexOf("game") >= 0 && !msg.author.bot){
        msg.reply("you lost the game")
    }
    
    if (msg.author.username === "funky-bot"){
        msg.reply("shut up no one likes you")
    }

    if (msg.content.toLowerCase().indexOf("what day is it today") >= 0){
        fetchAsync("https://nationaldaycalendar.com/what-is-national-today/")
            .then(data => getDays(data))
            .then(days => formatDays(days))
            .then(message => msg.channel.send(message))
            .catch(err => msg.channel.send("oops bot screwed up"))
    }

    if (msg.content === "hi bot") {
        msg.reply("hello insect")
    }

    if (msg.content.toLowerCase().indexOf("fantastic") >= 0){
        msg.channel.send("shut up isaac")
    }

    if (msg.content.toLowerCase().indexOf("solve") >= 0){
        try {
            msg.channel.send(math.evaluate(msg.content.substring(msg.content.indexOf("solve ") + 6, msg.content.length)))
        } catch (err) {
            msg.channel.send("I can't do that, stupid")
        }
    }

    if (msg.author.username === "sleepy") {
        msg.channel.send("alex no")
    }
});

client.login(process.env.BOT_TOKEN)