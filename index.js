const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: true,
    autoReconnect: true,
    partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION']
});


const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
    warnThreshold: 3,
    kickThreshold: 4,
    banThreshold: 4,
    maxInterval: 2000,
    warnMessage: '⚠ {@user}, Veuillez arreter de spam !',
    kickMessage: '⛔ {user_tag} a été kick pour spam ',
    banMessage: '⛔ {user_tag} a été banni pour spam',
    maxDuplicatesWarning: 6,
    maxDuplicatesKick: 7,
    maxDuplicatesBan: 7,
    exemptPermissions: ['ADMINISTRATOR'],
    ignoreBots: true,
    verbose: true,
    ignoredUsers: [],

});
const DBL = require("dblapi.js");
const ins = ["putain", "enculer", "fils de pute", "salope", "nique ta mere", "connard", "batard", "sale noir", "baise ta mere", "mange tes morts", "ta gueule", "bâtard", "nique ta mère"]

const dbl = new DBL("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1NjgyNzIzMzAzMjczMjc1MyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDUyMTM2fQ.tXvRRSRYeLx99uppI370Zf6bgnwwJI9hBQxQOuS-1IY", { webhookPort: 5000, webhookAuth: 'password' });
dbl.webhook.on('ready', hook => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
const ms = require("ms");
const createCaptcha = require('./captcha.js');
const request = require('node-superfetch');
const CmdModel = require('./database/models/cmd')
const { GiveawaysManager } = require("discord-giveaways");
const manager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
        embedColor: "#303136",
        reaction: "<:funhat:771797222299795476>"
    }
});


client.giveawaysManager = manager;
const config = require("./config.json");
const fetch = require("node-fetch");
const moment = require('moment');
const fs = require("fs").promises;
const backup = require("discord-backup");
const canvacord = require("canvacord");
const database = require('./database/database')
const ChannelModel = require('./database/models/channels')
const levelModel = require('./database/models/level')
const rrmodel = require('./database/models/rr')
const shoprpg = require('./database/models/rpg')
const Adventure = require('./database/models/adventure')
var db = require('quick.db')
const cooldowns = new Discord.Collection();
const Canvas = require("canvas");
const math = require('mathjs');
const leveling = require('discord-leveling');
const { arg, i } = require("mathjs");
const guildInvites = new Map();

client.on('message', message => {
    if (message.content === 'l.leave') {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send("<:cancel1:769230483863109632> | **Vous n'avez pas la permission `ADMINISTRATEUR`** !");
        client.emit('guildMemberRemove', message.member);
    }
});
client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("guildCreate", function(guild) {
    const owner = guild.owner.user
    let paule = new Discord.MessageEmbed()
        .setColor('#303136')
        .setTitle(`Merci de m'avoir ajouté`)

    .setDescription(`Vous pouvez voir la liste de mes commandes en tapant \`l.help\`. `)
        .addField(`Me configurer`, 'allez sur mon [Dashboard](http://lightbot.tk/) ou faites `l.config` pour la liste des commandes.')

    .addField('Une question ?', '<:discord:771797220784734238>[Serveur support](https://discord.gg/X6jZrUf)')



    owner.send(paule)
    client.user.setActivity(` l.help | ${client.guilds.cache.size} serveurs.`);
    const channelp = client.channels.cache.find(ch => ch.id === '758305204965081108');
    if (!channelp) return;
    const paul = new Discord.MessageEmbed()
        .setColor('#3FF40F')
        .setTitle(`Bot ajouté`)

    .setDescription(` 📤 Light a été ajouté sur un serveur !`)
        .addField(`Serveur`, guild.name, true)
        .setThumbnail(url = `${guild.iconURL({ format: 'jpg' })}`)

    .addField(':eight_pointed_black_star:  Créateur', guild.owner.user.tag, true)
        .addField(':flag_white: Région  :', guild.region, true)
        .addField('🔢 Nombre de membres :', guild.memberCount, true)

    .addField('Créée le :', guild.createdAt, true)

    .setTimestamp()


    channelp.send(paul);

});

client.on("channelDelete", async function(channel) {
    let logchanneldb = await ChannelModel.findOne({ serverID: channel.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = channel.guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setTitle(`Salon supprimé`)
        .setColor('#FF0000')
        .setDescription(`Le salon **${channel.name}** a été supprimé , c'était un salon ** ${channel.type}** `)

    .setTimestamp()
    log.send(paul);
});

client.on("emojiCreate", async function(emoji) {
    let logchanneldb = await ChannelModel.findOne({ serverID: emoji.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = emoji.guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setTitle(`L'emoji ${emoji.name} a été ajouté au serveur.`)
        .setColor('#0000FF')
        .setThumbnail(url = `${emoji.url}`)
        .setDescription(`ID : ${emoji.id}`)
        .setTimestamp()
    if (log) log.send(paul);
});
client.on("emojiDelete", async function(emoji) {

    let logchanneldb = await ChannelModel.findOne({ serverID: emoji.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = emoji.guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setTitle(`L'emoji ${emoji.name} a été supprimé du serveur.`)
        .setColor('#FF0000')
        .setThumbnail(url = `${emoji.url}`)
        .setDescription(`ID : ${emoji.id}`)
        .setTimestamp()
    log.send(paul);
});
client.on("emojiUpdate", async function(oldEmoji, newEmoji) {
    let logchanneldb = await ChannelModel.findOne({ serverID: newEmoji.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = newEmoji.guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setTitle(`Emoji modifié`)
        .setColor('#0000FF')

    .setDescription(`l'emoji **${oldEmoji.name}** s'appelle désormais **${newEmoji.name}**.`)
        .setTimestamp()
    log.send(paul);
});
client.on("guildBanAdd", async function(guild, user, reason) {
    if (!reason) reason = "Aucune raison";
    let logchanneldb = await ChannelModel.findOne({ serverID: guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = guild.channels.cache.get(logchanneldb.channelID);

    const paul = new Discord.MessageEmbed()
        .setTitle(`Bannisement`)
        .setColor(`#FF0000`)
        .setThumbnail(url = user.displayAvatarURL({ format: 'jpg' }))
        .setDescription(`${user} a été banni du serveur 
        raison : ${reason}`)
        .setTimestamp()
        .setFooter(`ID de : ${user.id}`)

    log.send(paul);
});
client.on("guildBanRemove", async function(guild, user) {
    let logchanneldb = await ChannelModel.findOne({ serverID: guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setTitle(`Débanissement`)
        .setColor(`#00FF00`)
        .setThumbnail(url = user.displayAvatarURL({ format: 'jpg' }))
        .setDescription(`${user} a été unban du serveur.`)
        .setTimestamp()
        .setFooter(`ID de : ${user.id}`)

    log.send(paul);
});
client.on('guildMemberUpdate', async(oldMember, newMember) => {
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
        let logchanneldb = await ChannelModel.findOne({ serverID: newMember.guild.id, reason: `logs` })
        if (!logchanneldb) return;
        const log = newMember.guild.channels.cache.get(logchanneldb.channelID);
        const paul = new Discord.MessageEmbed()
            .setTitle(`Perte de role`)
            .setColor(`#2f3136`)

        .setDescription(`\`${oldMember.displayName}\` a perdu le role \`${removedRoles.map(r => r.name)}.\``)
            .setTimestamp()


        log.send(paul);
    }
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        let logchanneldb = await ChannelModel.findOne({ serverID: newMember.guild.id, reason: `logs` })
        if (!logchanneldb) return;
        const log = newMember.guild.channels.cache.get(logchanneldb.channelID);
        const paul = new Discord.MessageEmbed()
            .setTitle(`Ajout de role`)
            .setColor(`#2f3136`)

        .setDescription(`\`${oldMember.displayName}\` vient de recevoir le role \`${addedRoles.map(r => r.name)}.\` `)
            .setTimestamp()


        if (log) log.send(paul);
    }

});

client.on("roleCreate", async function(role) {
    let logchanneldb = await ChannelModel.findOne({ serverID: role.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = role.guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setTitle(`Role crée`)
        .setColor(`${role.colorAsHex}`)
        .addField('Nom', role.name, true)
        .addField('couleur', role.hexColor, true)
        .addField('Permissions', role.permissions, true)
        .setTimestamp()
        .setFooter(`ID : ${role.id}`)

    log.send(paul);
});
client.on("roleDelete", async function(role) {
    let logchanneldb = await ChannelModel.findOne({ serverID: role.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = role.guild.channels.cache.get(logchanneldb.channelID);
    if (!log) return;
    const paul = new Discord.MessageEmbed()
        .setTitle(`Un  role a été supprimé.`)
        .setColor('#FF0000')

    .setDescription(`Ce role s'appellait ${role.name}.`)
        .setTimestamp()
        .setFooter(`ID : ${role.id}`)

    log.send(paul);
});
client.on("guildUpdate", async(oldGuild, newGuild) => {
    let logchanneldb = await ChannelModel.findOne({ serverID: newGuild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = newGuild.channels.cache.get(logchanneldb.channelID);
    if (!log) return;
    if (oldGuild.name !== newGuild.name) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`nom du serveur ==>
Avant : \`${oldGuild.name}\`
Après : \`${newGuild.name}\`
`)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)

        log.send(paul);
    }
    if (oldGuild.icon !== newGuild.icon) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`Icone ==>
        [Avant](${oldGuild.iconURL()})
        [Après](${newGuild.iconURL()})** `)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)


        log.send(paul);
    }
    if (oldGuild.description !== newGuild.description) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`Description du serveur ==> :
            Avant : \`${oldGuild.description}\`
            Après : \`${newGuild.description}\`
            `)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)


        log.send(paul);
    }
    if (oldGuild.systemChannel !== newGuild.systemChannel) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`Salon de messages systèmes ==> 
            Avant : \`${oldGuild.systemChannel}\`
            Après : \`${newGuild.systemChannel}\`
            `)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)


        log.send(paul);
    }
    if (oldGuild.region !== newGuild.region) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`Région ==> 
            Avant : \`${oldGuild.region}\`
            Après : \`${newGuild.region}\`
            `)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)


        log.send(paul);
    }
    if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`Niveau de sécuritée ==> 
            Avant : \`${oldGuild.verificationLevel}\`
            Après : \`${newGuild.verificationLevel}\`
            `)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)


        log.send(paul);
    }
    if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`🗜 Serveur modifié`)
            .setColor('#2f3136')

        .setDescription(`Niveau de notifications ==> 
            Avant : \`${oldGuild.defaultMessageNotifications}\`
            Après : \`${newGuild.defaultMessageNotifications}\`
            `)
            .setTimestamp()
            .setFooter(`ID : ${newGuild.id}`)


        log.send(paul);
    }
});
client.on("channelUpdate", async(oldChannel, newChannel) => {
    let logchanneldb = await ChannelModel.findOne({ serverID: newChannel.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = newChannel.guild.channels.cache.get(logchanneldb.channelID);
    if (!log) return;
    if (oldChannel.name !== newChannel.name) {
        console.log('OK')
        const paul = new Discord.MessageEmbed()
            .setTitle(`➕ Salon Modifié`)
            .setColor('#2f3136')

        .setDescription(`Le nom du salon ${newChannel} a été modifié :
    Avant : \`${oldChannel.name}\`
    Après : \`${newChannel.name}\`
    `)
            .setTimestamp()
            .setFooter(`ID : ${newChannel.id}`)

        log.send(paul);
    }
    if (oldChannel.topic !== newChannel.topic) {
        const paul = new Discord.MessageEmbed()
            .setTitle(`➕ Salon Modifié`)
            .setColor('#2f3136')

        .setDescription(`La description du salon ${newChannel} a été modifié :
    Avant : \`${oldChannel.topic}\`
    Après : \`${newChannel.topic}\`
    `)
            .setTimestamp()
            .setFooter(`ID : ${newChannel.id}`)

        log.send(paul);
    } else {
        return;
    }
});


client.on("channelCreate", async function(channel) {
    let logchanneldb = await ChannelModel.findOne({ serverID: channel.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = channel.guild.channels.cache.get(logchanneldb.channelID);
    if (!log) return;
    const paul = new Discord.MessageEmbed()
        .setTitle(`➕ Salon crée`)
        .setColor('#2f3136')

    .setDescription(`Un salon de type \`${channel.type}\` a été crée , son nom est \`${channel.name}\` et sa descritpion est : \`${channel.topic || 'Aucune description'}\`.`)
        .setTimestamp()
        .setFooter(`ID : ${channel.id}`)

    log.send(paul);
});
client.on("roleUpdate", async function(oldRole, newRole) {
    let logchanneldb = await ChannelModel.findOne({ serverID: newRole.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = newRole.guild.channels.cache.get(logchanneldb.channelID);
    if (oldRole.name !== newRole.name) {



        const paul = new Discord.MessageEmbed()
            .setTitle(`✏ Un  role a été modifié.`)
            .setColor(`#2f3136`)

        .setDescription(`Nom : \`${oldRole.name}\` ➡ \`${newRole.name}\``)
            .setTimestamp()
            .setFooter(`ID : ${newRole.id}`)

        log.send(paul);
    }
    if (oldRole.color !== newRole.color) {


        const paul = new Discord.MessageEmbed()
            .setTitle(`✏ Couleur de role modifiée`)
            .setColor(`#2f3136`)

        .setDescription(`la couleur du role \`${newRole.name}\` a été modifiée 
        Avant : \`${oldRole.hexColor}\`
        Après : \`${newRole.hexColor}\` `)
            .setTimestamp()
            .setFooter(`ID : ${newRole.id}`)

        log.send(paul);
    } else {
        const paul = new Discord.MessageEmbed()
            .setTitle(`✏ Permissions de role  modifiés.`)
            .setColor(`#2f3136`)

        .setDescription(`les permissions du role \`${newRole.name}\` on étés modifiées `)
            .setTimestamp()
            .setFooter(`ID : ${newRole.id}`)

        log.send(paul);
    }
});
client.on("guildDelete", function(guild) {
    const channelp = client.channels.cache.find(ch => ch.id === '758305204965081108');
    if (!channelp) return;
    const paul = new Discord.MessageEmbed()
        .setColor('#F01B0D')
        .setTitle(`Bot Supprimé`)

    .setDescription(` 📤 Light a été supprimé d'un serveur !`)
        .addField(`Serveur`, guild.name, true)
        .setThumbnail(url = `${guild.iconURL({ format: 'jpg' })}`)

    .addField(':eight_pointed_black_star:  Créateur', guild.owner.user.tag, true)
        .addField(':flag_white: Région  :', guild.region, true)
        .addField('🔢 Nombre de membres :', guild.memberCount, true)

    .addField('créée le :', guild.createdAt, true)

    .setTimestamp()


    channelp.send(paul);

});


client.on("ready", () => {
    console.log(`👼🏼 | **Light bot vient de démarrer !**`);
    client.user.setActivity(` l.help | lightbot.tk `);
    setInterval(() => {
        dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
    }, 1800000);

    database.then(() => console.log('🦠 | **CONNECTE A LA BDD**'))
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))

    });

});
client.on("messageDelete", async function(message) {
    if (message.author.bot) return;
    let logchanneldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = message.guild.channels.cache.get(logchanneldb.channelID);
    const paul = new Discord.MessageEmbed()
        .setAuthor(`Message de **${message.author.tag}**`, message.author.displayAvatarURL({ format: 'jpg' }))

    .setColor('#0000FF')
        .addFields({ name: `Supprimé dans le salon ${message.channel.name}.`, value: message })
        .setTimestamp()
        .setFooter(`ID : ${message.id}`)

    if (log) log.send(paul);
});

client.on("messageUpdate", async function(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;
    let logchanneldb = await ChannelModel.findOne({ serverID: newMessage.guild.id, reason: `logs` })
    if (!logchanneldb) return;
    const log = newMessage.guild.channels.cache.get(logchanneldb.channelID);
    if (!log) return;
    const paul = new Discord.MessageEmbed()
        .setAuthor(`Edition de message **${newMessage.author.tag}**`, newMessage.author.displayAvatarURL({ format: 'jpg' }))

    .setColor('#0000FF')

    .addField('Message initial :', oldMessage)
        .addField('Message après édition :', newMessage)
        .setTimestamp()
        .setFooter(`ID : ${oldMessage.id}`)

    log.send(paul);
});
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px Bold`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};
client.on("warn", function(info) {
    console.log(`warn: ${info}`);
});
client.on('messageReactionRemove', async(reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    let message = reaction.message;
    if (!message) return;
    if (user.bot) return;




    let rrdb = await rrmodel.findOne({ serverID: message.guild.id, reaction: reaction.emoji.name })
    if (rrdb) {
        console.log(rrdb.roleID);

        let role = message.guild.roles.cache.get(rrdb.roleID);
        let member = message.guild.members.cache.get(user.id);
        if (role) {
            if (member) {
                try {
                    if (!member.roles.cache.has(`${role.id}`)) {


                    } else {
                        member.roles.remove(role);


                    }


                } catch (err) {
                    const reportEmbed = new Discord.MessageEmbed()



                    .setDescription(`<:cancel1:769230483863109632> | Erreur dans la suppression du role , vérifiez la hiérarchie`)


                    .setFooter("© 2020 - Light Bot")
                        .setTimestamp()
                        .setColor("#2f3136");
                    const err2 = await message.channel.send(reportEmbed);
                    setTimeout(() => {
                        err2.delete();
                    }, 10000);
                    return;
                }
            }


        }


    }


});
client.on('messageReactionAdd', async(reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    let message = reaction.message;
    if (!message) return;
    if (user.bot) return;
 if (message.author.id !== client.user.id) return;

    let already = new Discord.MessageEmbed()
        .setColor("#2f3136")
        .setAuthor(`⛔ | Éh non ..`)
        .setFooter(`Light | © 2020`, client.user.displayAvatarURL())
        .setDescription(`Vous pouvez avoir qu'un seul ticket d'ouvert à la fois.`);

    let success = new Discord.MessageEmbed()
        .setColor("#2f3136")
        .setTitle(`🎫  Nouveau ticket`)
        .setFooter(`Light | © 2020`, client.user.displayAvatarURL())
        .setDescription("Veuillez expliquer la raison de votre demande. Un membre de l'équipe prendra en charge votre ticket sous peu.");

    let split = '';
    let usr = user.id.split(split);
    for (var i = 0; i < usr.length; i++) usr[i] = usr[i].trim();

    let rrdb = await rrmodel.findOne({ serverID: message.guild.id, reaction: reaction.emoji.name })
    if (rrdb) {
        console.log(rrdb.roleID);

        let role = message.guild.roles.cache.get(rrdb.roleID);
        let member = message.guild.members.cache.get(user.id);
        if (role) {

            if (member) {
                try {
                    if (member.roles.cache.has(`${role.id}`)) {
                        const reportEmbed = new Discord.MessageEmbed()



                        .setDescription(`<:cancel1:769230483863109632> | Erreur : Vous avez déja ce role`)


                        .setFooter("© 2020 - Light Bot")
                            .setTimestamp()
                            .setColor("#2f3136");
                        const err1 = await message.channel.send(reportEmbed);
                        setTimeout(() => {
                            err1.delete();
                        }, 10000);

                    } else {
                        try {
                            member.roles.add(role);
                            const reportEmbed = new Discord.MessageEmbed()

                            .setDescription(`<:checkmark:769230483820773426> | Vous avez reçu le role \`${role.name}\``)


                            .setFooter("© 2020 - Light Bot")
                                .setTimestamp()
                                .setColor("#2f3136");
                            member.send(reportEmbed);

                        } catch (err) {
                            const reportEmbed = new Discord.MessageEmbed()



                            .setDescription(`<:cancel1:769230483863109632> | Erreur dans l'ajout du role , vérifiez la hiérarchie`)


                            .setFooter("© 2020 - Light Bot")
                                .setTimestamp()
                                .setColor("#2f3136");
                            const err2 = await message.channel.send(reportEmbed);
                            setTimeout(() => {
                                err2.delete();
                            }, 10000);
                            return;
                        }
                    }


                } catch (err) {
                    const reportEmbed = new Discord.MessageEmbed()



                    .setDescription(`<:cancel1:769230483863109632> | Erreur dans l'ajout du role , vérifiez la hiérarchie`)


                    .setFooter("© 2020 - Light Bot")
                        .setTimestamp()
                        .setColor("#2f3136");
                    const err2 = await message.channel.send(reportEmbed);
                    setTimeout(() => {
                        err2.delete();
                    }, 10000);
                    return;
                }
            }


        }


    }
    if (reaction.emoji.name === "🎫") {
         if (!message.author.id == client.user.id) return;
        console.log('GOOD REACTION');
        if (!message.guild.channels.cache.find(c => c.name === `ticket-${usr[0]}${usr[1]}${usr[2]}${usr[3]}`)) {


            let categoria = message.guild.channels.cache.find(c => c.name == "tickets" && c.type == "category");
            if (!categoria) categoria = await message.guild.channels.create("tickets", { type: "category", position: 1 }).catch(e => { return functions.errorEmbed(message, message.channel, "Une erreur a été rencontrée.") });

            let permsToHave = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']

            message.guild.channels.create(`ticket-${usr[0]}${usr[1]}${usr[2]}${usr[3]}`, {
                permissionOverwrites: [{
                        deny: 'VIEW_CHANNEL',
                        id: message.guild.id
                    },
                    {
                        allow: permsToHave,
                        id: user.id
                    },

                ],
                parent: categoria.id,
                reason: `Cet utilisateur a besoin d'aide.`,
                topic: `**ID:** ${user.id} -- **Tag:** ${user.tag} | t*close`
            }).then(channel => {


                channel.send(`${user}`, { embed: success });
                db.set(`ticket.ticket-${usr[0]}${usr[1]}${usr[2]}${usr[3]}`, { user: user.id });
            })
            console.log('BEN CREE');
            reaction.users.remove(user.id);
            return;
        } else {
            console.log('ALREADY');
            reaction.users.remove(user.id);
            message.reply({ embed: already }).then(m => m.delete({ timeout: 3000 }).catch(e => {}));
        }
    } else {

    }


    // ========================= //


    if (reaction.emoji.name === "🗑️") {
        if (user.id === db.get(`ticket.${message.channel.name}.user`)) {


            message.channel.delete();

        }
    }

});
client.on('guildMemberAdd', async member => {
    let verify = await ChannelModel.findOne({ serverID: member.guild.id, reason: `captcha` })
    if (verify) {
        if (!member.bot) {
            let verifychannel = member.guild.channels.cache.get(verify.channelID);
            if (verifychannel) {
                const role = member.guild.roles.cache.find(role => role.name === "Non vérifié");
                if (role) member.roles.add(role);
                if (!role) return;
                const captcha = await createCaptcha();
                try {
                    const msg = await verifychannel.send(`**Bonjour ${member} , vous avez 60s pour résoudre le captcha !**`, {
                        files: [{
                            attachment: `${__dirname}/captchas/${captcha}.png`,
                            name: `${captcha}.png`
                        }]
                    });
                    try {
                        const filter = m => {
                            if (m.author.bot) return;
                            if (m.author.id === member.id && m.content === captcha) return true;
                            else {
                                m.channel.send('<:cancel1:769230483863109632> **| Veuillez entrer le cpatcha correctement**');
                                return false;
                            }
                        };
                        const response = await msg.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] });
                        if (response) {
                            await msg.channel.send('Vous avez été verifié avec succès !');
                            await member.roles.remove(role);
                            msg.channel.bulkDelete(5, true).catch(e => {
                                if (e) message.channel.send("**<:cancel1:769230483863109632> | Une erreur c'est produite**")
                            });

                            await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                                .catch(err => console.log(err));
                        }
                    } catch (err) {
                        console.log(err);
                        await member.send('<:cancel1:769230483863109632> **| Vous avez attendu trop longtemps pour completer le captcha et avez été kick !**');
                        await msg.channel.send('<:cancel1:769230483863109632> **| Vous avez attendu trop longtemps et avez été kick !**');
                        await member.kick();
                        await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                            .catch(err => console.log(err));
                        return false;
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
    const wel = member.guild.channels.cache.find(ch => ch.id === '763048158165991434');
    if (wel) wel.send(`EH ! ${member} vient de nous rejoindre ! Saluons le tous car nous sommes désormais ${member.guild.memberCount} membres  !`)
    let logchanneldb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `logs` })
    const paul = new Discord.MessageEmbed()
        .setDescription(`Arivée de **${member.user.tag}**`)
        .setColor(`#0000FF`)
        .setThumbnail(url = member.user.displayAvatarURL({ format: 'jpg' }))
        .addFields({ name: `Ce membre vient de rejoindre votre serveur`, value: `${member.guild.memberCount} membres dans le serveur.` })
        .setTimestamp()
        .setFooter(`ID : ${member.id}`)

    if (logchanneldb) member.guild.channels.cache.get(logchanneldb.channelID).send(paul);

    const canvas = Canvas.createCanvas(1024, 450);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://s3.envato.com/files/0e6248c9-24d6-41e5-86e3-e432cd3ae030/inline_image_preview.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#100101 ';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '35px sans-serif';
    ctx.fillStyle = '#100101 ';
    ctx.fillText('BIENVENUE', canvas.width / 2.5, canvas.height / 3.5);

    // Add an exclamation point here and below
    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#100101 ';
    ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);


    ctx.font = '35px sans-serif';
    ctx.fillStyle = '#100101 ';
    ctx.fillText(`#${member.guild.memberCount} membres!`, canvas.width / 2.5, canvas.height / 1.3);


    ctx.beginPath();

    ctx.lineWidth = 10;

    ctx.strokeStyle = "#03A9F4";

    ctx.arc(180, 225, 135, 0, Math.PI * 2, true);

    ctx.stroke();

    ctx.closePath();

    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(avatar, 45, 90, 270, 270);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    let roledb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `autorole` })
    if (roledb) {
        const roleId = roledb.channelID;
        if (roleId) member.roles.add(roleId).catch(console.error);
    }

    let channeldb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `welcome` })
    if (channeldb === null) return;
    const channelId = channeldb.channelID;
    if (channeldb === null) return;
    let msgdb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `welcomemsg` })
    let msg;
    if (msgdb === null) msg = `Salut, ${member} bienvenue dans ${member.guild.name} !`;
    else {

        msg = `${msgdb.channelID}`
            .replace(/{user}/g, member)
            .replace(/{server}/g, member.guild.name)
            .replace(/{membercount}/g, member.guild.memberCount);
        if (msg === null) msg = `Salut, ${member} bienvenue dans ${member.guild.name} !`;
    }
    member.guild.channels.cache.get(channelId).send(msg, attachment)
    if (member.guild.id === "765899951443279922") {
        const cachedInvites = guildInvites.get(member.guild.id);
        const newInvites = await member.guild.fetchInvites();
        guildInvites.set(member.guild.id, newInvites);
        try {
            const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

            const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '781160967546339340');
            member.guild.fetchInvites()
                .then

                (invites => {
                const userInvites = invites.array().filter(o => o.inviter.id === usedInvite.inviter.id);
                var userInviteCount = 0;
                for (var i = 0; i < userInvites.length; i++) {
                    var invite = userInvites[i];
                    userInviteCount += invite['uses'];
                }
                welcomeChannel.send(`
               👏🏼 ${member} nous a rejoints.
        Il a été invité par  ${usedInvite.inviter} , qui a désormais ${userInviteCount} invitattions sur ce serveur`)
            })


        } catch (err) {
            console.log(err);
        }
    }


});
client.on("guildMemberRemove", async user => {
    let member = user;
    let logchanneldb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `logs` })
    const paul = new Discord.MessageEmbed()
        .setDescription(`Départ de **${member.user.tag}**`)
        .setColor(`#FF0000`)
        .setThumbnail(url = member.user.displayAvatarURL({ format: 'jpg' }))
        .addFields({ name: `Ce membre vient de quitter votre serveur`, value: `${member.guild.memberCount} membres dans le serveur.` })
        .setTimestamp()
        .setFooter(`ID : ${member.id}`)

    if (logchanneldb) member.guild.channels.cache.get(logchanneldb.channelID).send(paul);


    const canvas = Canvas.createCanvas(730, 280);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://media.discordapp.net/attachments/763048158165991434/770724150313484288/galaxie.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#100101 ';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#100101 ';
    ctx.fillText('AU REVOIR', canvas.width / 2.5, canvas.height / 3.5);

    // Add an exclamation point here and below
    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#100101 ';
    ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);


    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#100101 ';
    ctx.fillText(`#${member.guild.memberCount} membres!`, canvas.width / 2.5, canvas.height / 1.3);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    let channeldb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `leave` })
    if (!channeldb) return;
    const channelId = channeldb.channelID;
    let msgdb = await ChannelModel.findOne({ serverID: member.guild.id, reason: `leavemsg` })
    let msg;
    if (msgdb === null) msg = `Au revoir, ${member}  dans ${member.guild.name} !`;
    msg = `${msgdb.channelID}`
        .replace(/{user}/g, member)
        .replace(/{server}/g, member.guild.name)
        .replace(/{membercount}/g, member.guild.memberCount);
    if (msg === null) msg = `Au revoir, ${member}  dans ${member.guild.name} !`;

    member.guild.channels.cache.get(channelId).send(msg, attachment);

});

client.on("message", async message => {
    if (message.author.bot) return;

    if (message.channel.type == 'dm') {
        return message.reply("<:information:769234471236665355> | **Je ne reçois pas de messages en privé**.");
    }
    let pdb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `lang` })
    if (pdb) {

    } else {
        const verynewe = new ChannelModel({
            serverID: `${message.guild.id}`,
            channelID: `fr`,
            reason: 'lang',
        }).save();

    }
    let prefixedb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `prefix` })
    if (prefixedb) {

    } else {
        const verynew = new ChannelModel({
            serverID: `${message.guild.id}`,
            channelID: `l.`,
            reason: 'prefix',
        }).save();

    }
    let langdb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `lang` })
    const lang = langdb.channelID;
    const ldb = require(`./languages/${lang}.json`);
    let insultdb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `insult` })
    if (insultdb) {
        if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
            const member = message.author;

            antiSpam.message(message)
            if (ins.some(word => message.content.includes(word))) {
                console.log('INSULTE');
                message.delete()
                let reason = "INSULTES";
                await (reason)
                let verify = await ChannelModel.findOne({ serverID: message.guild.id, channelID: member.id })
                if (verify) {
                    let actw = verify.reason;
                    let x = '1';
                    const warn = math.evaluate(`${actw} + ${x}`)
                    const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, channelID: member.id }, { $set: { reason: warn } }, { new: true });


                    const paul = new Discord.MessageEmbed()
                        .setTitle('**WARN**')
                        .setColor('#DFF00D')

                    .setDescription(`${member.tag} a désormais ${warn} warn(s)`)

                    .addField('Membre warn', member.tag, true)
                        .addField('raison', `\` ${reason}\``)
                    message.channel.send(paul);

                    if (warn > 3) {

                        let role = message.guild.roles.cache.find(role => role.name === "Muted");
                        if (!role) {
                            try {
                                role = await message.guild.roles.create({
                                    data: {
                                        name: "Muted",
                                        color: "#000000",
                                        permissions: []
                                    }
                                });

                                message.guild.channels.cache.forEach(async(channel, id) => {
                                    await channel.createOverwrite(role, {
                                        SEND_MESSAGES: false,
                                        MANAGE_MESSAGES: false,
                                        READ_MESSAGES: false,
                                        ADD_REACTIONS: false
                                    });
                                });
                            } catch (e) {
                                console.log(e.stack);
                            }
                        }
                        message.member.roles.add(role)
                        setTimeout(() => {
                            message.member.roles.remove(role);
                            const paul = new Discord.MessageEmbed()
                                .setTitle('**Fin du mute**')
                                .setColor("#2f3136")

                            .setDescription(`le mute de ${member.tag} a prit fin `)

                            message.channel.send(paul);
                        }, 1000000);
                        const paul = new Discord.MessageEmbed()
                            .setTitle('**MUTED**')
                            .setColor("#2f3136")

                        .setDescription(`${member.tag} a été mute`)
                            .addField('raison', 'Trops de warns')
                            .addField('Temps', '2H')
                        message.channel.send(paul);
                    }
                } else {
                    const verynew = new ChannelModel({
                        serverID: `${message.guild.id}`,
                        channelID: `${member.id}`,
                        reason: '1',
                    }).save();


                    const paul = new Discord.MessageEmbed()
                        .setTitle('**WARN**')
                        .setColor('#DFF00D')

                    .setDescription(`${member} , c'est ton premier warn`)

                    .addField('Membre warn', member.tag, true)
                        .addField('raison', `\`${reason}\``)
                    message.channel.send(paul);
                }

            }
        }
        if (/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)) {
            if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
                message.delete();
                let member = message.author;
                message.delete().catch(O_o => {});
                let verify = await ChannelModel.findOne({ serverID: message.guild.id, channelID: member.id })
                if (verify) {
                    let actw = verify.reason;
                    let x = '1';
                    let warn = math.evaluate(`${actw} + ${x}`)
                    const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, channelID: member.id }, { $set: { reason: warn } }, { new: true });
                    await member.send(`:warning: Vous avez été avertit sur le serveur **${message.guild.name}** pour la raison : posté une invitation`);
                    const paul = new Discord.MessageEmbed()
                        .setTitle('**WARN**')
                        .setColor('#DFF00D')
                        .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
                        .setDescription(`${member.tag} a été avertit`)
                        .addField('raison', '`posté une invitation`')
                    message.channel.send(paul);
                    if (warn => '3') {
                        member.send(`:mute:  Vous avez été muté sur le serveur **${message.guild.name}** pour la raison : **posté une invitation**`);
                        let role = message.guild.roles.cache.find(role => role.name === "Muted");
                        if (!role) {
                            try {
                                role = await message.guild.roles.create({
                                    data: {
                                        name: "Muted",
                                        color: "#000000",
                                        permissions: []
                                    }
                                });

                                message.guild.channels.cache.forEach(async(channel, id) => {
                                    await channel.createOverwrite(role, {
                                        SEND_MESSAGES: false,
                                        MANAGE_MESSAGES: false,
                                        READ_MESSAGES: false,
                                        ADD_REACTIONS: false
                                    });
                                });
                            } catch (e) {
                                console.log(e.stack);
                            }
                        }
                        member.roles.add(role)
                        const paul = new Discord.MessageEmbed()
                            .setTitle('**MUTED**')

                        .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
                            .setDescription(`${member.tag} a été mute`)
                            .addField('raison', 'trops de warns')
                        message.channel.send(paul);
                    }
                } else {
                    const verynew = new ChannelModel({
                        serverID: `${message.guild.id}`,
                        channelID: `${member.id}`,
                        reason: '1',
                    }).save();
                    const paul = new Discord.MessageEmbed()
                        .setTitle('**WARN**')
                        .setColor('#DFF00D')
                        .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
                        .setDescription(`${member.tag} a été avertit`)
                        .addField('raison', '`posté une invitation`')
                    message.channel.send(paul);
                }
            }
        }


    } else {

    }







    const mentionRegex = RegExp(`^<@!${client.user.id}>$`);
    if (message.content.match(mentionRegex)) {
        let prefixdb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `prefix` })
        if (prefixdb) {

            const prefix = prefixdb.channelID;
            const prefixn = await message.channel.send(`${ldb.mentionIN}` + ` \` ${prefix} \``);
            setTimeout(() => {
                prefixn.delete();
            }, 10000);
        } else {


            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `l.`,
                reason: 'prefix',
            }).save();
            return message.channel.send(`${ldb.mentionIN}` + ` \` ${prefix} \``);
        }

    }
    let prefixdb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `prefix` })
    const prefix = prefixdb.channelID;
    message.mentions.users.forEach(async(u) => {
        let afkdb = await ChannelModel.findOne({ serverID: u.id, reason: `afk` })
        if (afkdb) {
            message.channel.send(`<:sleep:774625966030848010> **| ${u.tag} est afk pour la raison : \`${afkdb.channelID}\`**`);

        }
    });

    let verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `captcha` })
    if (verify) {
        let verifychannel = message.guild.channels.cache.get(verify.channelID);
        if (message.channel.id === verifychannel.id) {
            await message.delete();
        }
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix)) {
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: message.author.id })
        if (userdata) {

            let xp = userdata.xp;
            let n = `5`;
            const newxp = math.evaluate(`${xp} + ${n}`);

            let r = '1';
            const msg = math.evaluate(`${userdata.messagec} + ${r}`);
            if (newxp > 100) {
                x = '1';
                const newlevel = math.evaluate(`${userdata.level} + ${x}`);

                let leveldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `level` })
                if (leveldb) {
                    let customchannel = message.guild.channels.cache.get(leveldb.channelID)
                    if (customchannel) {
                        customchannel.send(` GG ${message.author} , tu viens de passer un niveau ! Tu es désormais au niveau ${newlevel} !`)

                    } else {
                        message.channel.send(` GG ${message.author} , tu viens de passer un niveau ! Tu es désormais au niveau ${newlevel} !`)

                    }


                }
                const levelupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: message.author.id }, { $set: { xp: '0', level: newlevel, messagec: msg } }, { new: true });

            } else {

                const normalupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: message.author.id }, { $set: { xp: newxp, messagec: msg } }, { new: true });

            }

        } else {

            const verynew = new levelModel({
                serverID: `${message.guild.id}`,
                userID: `${message.author.id}`,
                xp: '5',
                level: '0',
                messagec: '1'
            }).save();
            console.log(`nouvel user ==> ${message.author.tag}`)
        }
    } else {
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `commands` })
        if (biodb) {
            let argent = biodb.channelID;
            let n = '1';

            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `commands` }, { $set: { channelID: newfric, reason: `commands` } }, { new: true });

        } else {
            const embed = new Discord.MessageEmbed()


            .setTitle(`Première commande`)
                .setColor('#303136')
                .setDescription(`${message.author} Tu as obtenu le succès : \`Ecrivez votre première commande\``)
                .setImage(url = 'https://tutosduweb.000webhostapp.com/site/image.png')
            message.channel.send(embed);
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `1`,
                reason: 'commands',
            }).save();

        }
    }
    if (!message.content.startsWith(prefix)) return;
    let cmdb = await CmdModel.findOne({ serverID: message.guild.id, name: command })
    if (cmdb) {
        const typdbe = cmdb.channel;
        let type;
        if (typdbe === "mp") {
            type = message.author;
        } else {
            type = message.channel;
        }
        type.send(cmdb.text);
    } else {

    }

    let bldb = await ChannelModel.findOne({ serverID: message.author.id, reason: `black` })
    if (bldb) {
        return message.channel.send(`** <:cancel1:769230483863109632> | Vous avez été blacklisté du bot et ne pouvez plus l'utliser !**`);
    } else {

    }
    if (command === 'captcha') {

        const user = message.mentions.users.first() || message.author;

        const m = await message.channel.send("<:information:769234471236665355> | **Génération de l'image en cours**");
        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=captcha&username=${user.username}&url=${user.displayAvatarURL({ format: "png", size: 512 })}`));
        const json = await res.json();
        const attachment = new Discord.MessageAttachment(json.message, "captcha.png");
        message.channel.send(attachment);
        m.delete();
    }
    if (command === "tweet") {
        const user = args[0];
        const text = args.slice(1).join(" ");

        if (!user) {
            return message.channel.send(`** <:cancel1:769230483863109632> | Merci de bien utliser cette commande : tweet <membre> <texte> !**`);
        }

        if (!text) {
            return message.channel.send(`** <:cancel1:769230483863109632> | Merci de bien utliser cette commande : tweet <membre> <texte> !**`);
        }


        const m = await message.channel.send("<:information:769234471236665355> | **Génération de l'image en cours**");

        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`));
        const json = await res.json();
        const attachment = new Discord.MessageAttachment(json.message, "tweet.png");
        message.channel.send(attachment);
        m.delete();

    }
    if (command === "ass") {
        if (message.channel.id !== "754014583949361262") return;
        const embed = new Discord.MessageEmbed().setColor(0x00FFFF);

        message.channel.startTyping();
        fetch(`https://nekobot.xyz/api/image?type=ass`)
            .then(res => res.json())
            .then(data => {
                embed.setImage(data.message)
                embed.setTitle('' + message.author.username + ' voici votre image Ass')

                embed.setTimestamp()
                embed.setColor("#2f3136");

                message.channel.send({ embed })
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);

    }
    if (command === "wanted") {

        const user = message.mentions.users.first() || message.author;
        const m = await message.channel.send("<:information:769234471236665355> | **Génération de l'image en cours**");
        const buffer = await this.client.AmeAPI.generate("wanted", { url: user.displayAvatarURL({ format: "png", size: 512 }) });
        const attachment = new Discord.MessageAttachment(buffer, "wanted.png");
        m.delete();
        message.channel.send(attachment);
    }
    if (command === "qrcode") {
        const text = args.join(" ");
        if (!text) {
            return message.channel.send(`** <:cancel1:769230483863109632> | Merci de bien utliser cette commande : qrcode <texte> !**`);
        }


        const m = await message.channel.send("<:information:769234471236665355> | **Génération de l'image en cours**");

        const embed = new Discord.MessageEmbed()
            .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(new RegExp(" ", "g"), "%20")}`)
            .setColor("RANDOM");

        m.edit(embed);


    }
    if (command === "clyde") {

        const text = args.join(" ");

        if (!text) {
            return message.channel.send(`** <:cancel1:769230483863109632> | Merci de bien utliser cette commande : clyde <texte> !**`);
        }

        const m = await message.channel.send("<:information:769234471236665355> | **Génération de l'image en cours**");

        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`));
        const json = await res.json();
        const attachment = new Discord.MessageAttachment(json.message, "clyde.png");
        message.channel.send(attachment);
        m.delete();



    }
    if (command === 'addxp') {
        const usage = " <membre> <xp>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet d'ajouter de l'xp à une personne'\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const togive = args[1];
        const member = message.mentions.members.last() || message.member;
        if (!togive) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        } else {
            if (isNaN(togive) || parseInt(togive) <= 0) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);

        }
        if (!member) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })
        if (userdata) {
            let newxp = math.evaluate(`${userdata.xp} + ${togive}`)
            const normalupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: member.id }, { $set: { xp: newxp, } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** |  Vous avez ajouté \`${togive}\`xp à ${member.tag} avec succès !**`);

        } else {
            const verynew = new levelModel({
                serverID: `${message.guild.id}`,
                userID: `${member.id}`,
                xp: togive,
                level: '0',
                messagec: '0'
            }).save();
            console.log(`nouvel user ==> ${message.author.tag}`)
            return message.channel.send(`<:checkmark:769230483820773426>** |  Vous avez ajouté \`${togive}\`xp à ${member.tag} avec succès !**`);

        }


    }
    if (command === 'addlevel') {
        const usage = " <membre> <niveau>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet d'ajouter des niveaux à une personne'\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const togive = args[1];
        const member = message.mentions.members.last() || message.member;
        if (!togive) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        } else {
            if (isNaN(togive) || parseInt(togive) <= 0) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);

        }
        if (!member) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })
        if (userdata) {
            let newxp = math.evaluate(`${userdata.level} + ${togive}`)
            const normalupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: member.id }, { $set: { level: newxp, } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** |  Vous avez ajouté \`${togive}\`niveaux à ${member.user.tag} avec succès !**`);

        } else {
            const verynew = new levelModel({
                serverID: `${message.guild.id}`,
                userID: `${member.id}`,
                xp: '0',
                level: togive,
                messagec: '0'
            }).save();
            console.log(`nouvel user ==> ${message.author.tag}`)
            return message.channel.send(`<:checkmark:769230483820773426>** |  Vous avez ajouté \`${togive}\`niveaux à ${member.user.tag} avec succès !**`);

        }


    }
    if (command === 'rank') {
        const member = message.mentions.members.last() || message.member;
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Rank de ${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))


        .setColor('#303136')
            .addField('Xp', `${userdata.xp}`)
            .addField('Niveau', `${userdata.level}`)
            .addField('Nombre de messages envoyés', `${userdata.messagec}`)

        .setFooter(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        return message.channel.send(embed);

    }
    if (command === 'userinfo') {
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: message.author.id })

        const member = message.mentions.members.last() || message.member;
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Informations sur l'utilisateur ${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            //.setTitle(`Informations sur l'utilisateur ${member.user.username}`)
            .setDescription(`Voici les informations pour ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#0099ff')
            .addField('Tag', `${member.user.tag}`)
            .addField('ID', `${member.user.id}`)
            .addField('Nombre de messages envoyés', `${userdata.messagec}`)
            .addField('Avatar', `[Clique ici](${member.user.displayAvatarURL({ dynamic: true })})`)
            .addField('Date de création du compte', `${moment(member.user.createdTimestamp).locale('fr').format('LT ,')} ${moment(member.user.createdTimestamp).locale('fr').format('LL, ')} ${moment(member.user.createdTimestamp).locale('fr').fromNow()}`)
            .addField('Rôle le plus haut', `${member.roles.highest.id === message.guild.id ? 'Aucun' : member.roles.highest.name}`)
            .addField("Date d'adhésion au serveur", `${moment(member.joinedAt).locale('fr').format('LL LTS')}`)
            //.addField('Membre', [
            //   `**❯ Rôle le plus haut:** ${member.roles.highest.id === message.guild.id ? 'Aucun' : member.roles.highest.name}`,
            // `**❯ Date d'adhésion au serveur:** ${moment(member.joinedAt).locale('fr').format('LL LTS')}`,
            //  `**❯ Rôles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None'}`,
            // `\u200b`
            //  ])
            .setFooter(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        return message.channel.send(embed);
    }
    if (command === 'resetprefix') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `prefix` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `prefix` }, { $set: { channelID: 'l.', reason: `prefix` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** |  Le préfixe a été réinitialisé avec succès !**`);
        } else {
            return message.channel.send(`<:cancel1:769230483863109632>** |  Le préfixe n'est pas set !**`);
        }
    }
    if (command === 'setprefix') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (!args[0]) return message.channel.send("<:information:769234471236665355> | **Merci de bien utiliser cette commande : l.setprefix <prefix>**");
        let newprefix = args[0];
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `prefix` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `prefix` }, { $set: { channelID: newprefix, reason: `prefix` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** |  Le préfixe a été mis à jour avec succès vers \`${newprefix}\` !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${newprefix}`,
                reason: 'prefix',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le préfixe a été mis à jour avec succès vers \`${newprefix}\` !**`);
        }
    }

    if (command === "invites") {
        if (message.mentions.members.last()) {
            var user = message.mentions.members.last();
            message.guild.fetchInvites()
                .then

                (invites => {
                const userInvites = invites.array().filter(o => o.inviter.id === user.id);
                var userInviteCount = 0;
                for (var i = 0; i < userInvites.length; i++) {
                    var invite = userInvites[i];
                    userInviteCount += invite['uses'];
                }
                message.channel.send(`<:checkmark:769230483820773426>** | ${user.member.tag} a ${userInviteCount} invitations sur ce serveur.**`);
            })
        } else {
            var user = message.author;
            message.guild.fetchInvites()
                .then

                (invites => {
                const userInvites = invites.array().filter(o => o.inviter.id === user.id);
                var userInviteCount = 0;
                for (var i = 0; i < userInvites.length; i++) {
                    var invite = userInvites[i];
                    userInviteCount += invite['uses'];
                }
                message.channel.send(`<:checkmark:769230483820773426>** |Vous avez ${userInviteCount} invitations sur ce serveur.**`);
            })
        }

    }
    if (command === 'trump') {
        let botmessage = args.slice(0).join(" ");
        const canvas = Canvas.createCanvas(700, 300);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://i.imgflip.com/1i7abe.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#1DA1F2';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = "20px Helvetica";
        ctx.fillStyle = '#1DA1F2';
        ctx.fillText(`${botmessage}!`, canvas.width / 6.4, canvas.height / 3.3);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        message.channel.send(attachment)

    }
    if (command === 'antiraid') {
        const usage = " on/off";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de définir le  système d'anti raid'\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }


        if (!args[0]) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        if (args[0] == "on") {
            let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `insult` })
            if (channeldb) {

                return message.channel.send(`<:checkmark:769230483820773426>** | Le système d'anti raid est déja activé, pour le désactiver , faites \`aintiraid off\` !**`);
            } else {
                const verynew = new ChannelModel({
                    serverID: `${message.guild.id}`,
                    channelID: `rien`,
                    reason: 'insult',
                }).save();
                return message.channel.send(`<:checkmark:769230483820773426>** | Le système d'anti raid est désormais activé , gare à celui qui essaye de raid !**`);
            }
        }
        if (args[0] == "off") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.channel.send("<:cancel1:769230483863109632> | **vous n'avez pas la permission `ADMINISTRATEUR`**");
            let verifyg = await ChannelModel.findOne({ serverID: message.guild.id, reason: `insult` })
            if (verifyg) {
                const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `insult` });
                return message.channel.send(`<:checkmark:769230483820773426> **| Le système d'anti raid est désormais désactivé !**`);
            } else {
                return message.channel.send('**<:cancel1:769230483863109632> | Vous devez avoir une configuration pour la supprimer!**')
            }
        } else {
            return message.channel.send("<:information:769234471236665355> | **Merci de bien utiliser cette commande : l.antiraid on/off**");
        }

    }
    if (command === 'setchannel') {
        const usage = " <channel>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de définir le salon du système de captcha\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        if (!args[0]) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);


        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `captcha` })
        if (channeldb) {

            return message.channel.send(`<:checkmark:769230483820773426>** | Le système de captcha est déja activé, pour le désactiver , faites \`${prefix}captcha off\` !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'captcha',
            }).save();


            return message.channel.send(`<:checkmark:769230483820773426>** | Le système de captcha est désormais activé !**`);
        }


    }
    if (command === 'setcaptcha') {
        const usage = " on/off <channel>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de configurer le système de captcha\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        if (!args[0]) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);

        if (args[0] == "on") {
            let channel = message.mentions.channels.first();
            if (!channel) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
            let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `captcha` })
            if (channeldb) {

                return message.channel.send(`<:checkmark:769230483820773426>** | Le système de captcha est déja activé, pour le désactiver , faites \`${prefix}captcha off\` !**`);
            } else {
                const verynew = new ChannelModel({
                    serverID: `${message.guild.id}`,
                    channelID: `${channel.id}`,
                    reason: 'captcha',
                }).save();
                let role = message.guild.roles.cache.find(role => role.name === "Non vérifié");
                if (!role) {
                    try {
                        role = await message.guild.roles.create({
                            data: {
                                name: "Non vérifié",
                                color: "#000000",
                                permissions: []
                            }
                        });

                        message.guild.channels.cache.forEach(async(channel, id) => {
                            await channel.createOverwrite(role, {
                                SEND_MESSAGES: false,
                                MANAGE_MESSAGES: false,

                                READ_MESSAGES: false,
                                WIEW_CHANNEL: false,
                                ADD_REACTIONS: false
                            });
                        });
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
                channel.createOverwrite(message.guild.id, {
                    SEND_MESSAGES: true,
                    WIEW_CHANNEL: true,
                    READ_MESSAGES: true,
                    ADD_REACTIONS: true
                })
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle('Salon de vérification')

                .setDescription(`Ce salon a été définit comme salon de vérifivation par ${message.author}`)


                .setFooter("© 2020 - Light bot")
                    .setTimestamp()
                    .setColor("#2f3136");
                channel.send(reportEmbed);


                return message.channel.send(`<:checkmark:769230483820773426>** | Le système de captcha est désormais activé !**`);
            }
        }
        if (args[0] == "off") {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send(ldb.ADM);
            }
            let verifyg = await ChannelModel.findOne({ serverID: message.guild.id, reason: `captcha` })
            if (verifyg) {
                const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `captcha` });
                return message.channel.send(`<:checkmark:769230483820773426> **| Le captcha est désormais désactivé sur ce serveur !**`);
            } else {
                return message.channel.send('**<:cancel1:769230483863109632> | Vous devez avoir une configuration pour la supprimer!**')
            }
        } else {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }

    }
    if (command === 'levelchannel') {
        const usage = " <channel>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de configurer le salon dans lequel le bot envera le message de niveau\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `level` })
        if (channeldb) {
            let channel = message.mentions.channels.first();
            if (!channel) return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `level` }, { $set: { channelID: channel.id, reason: `level` } }, { new: true });
            return message.channel.send('**<:checkmark:769230483820773426>| J\'enverrai les messages de niveau dans ce salon !**')

        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Le système de niveau n\' est pas activé dans ce serveur!**')

        }







    }
    if (command === 'setlang') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (!args[0]) return message.channel.send("<:information:769234471236665355> | **Merci de bien utiliser cette commande : setlang fr/an**");
        if (args[0] == "fr") {
            let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `lang` })
            if (channeldb) {
                let actlang = channeldb.channelID;
                if (actlang == "fr") {
                    return message.channel.send("<:cancel1:769230483863109632> **| La langue du bot est déja le français ! **");
                } else {
                    const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { channelID: "fr", reason: `lang` } }, { new: true });
                    return message.channel.send(`<:checkmark:769230483820773426>** | Le bot est désormais en français !**`);
                }

            }
        }
        if (args[0] == "an") {

            let verifyg = await ChannelModel.findOne({ serverID: message.guild.id, reason: `lang` })
            if (verifyg) {
                let actlang = verifyg.channelID;
                if (actlang == "an") {
                    return message.channel.send("<:cancel1:769230483863109632> **| the bot language is already English **");
                } else {
                    const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `lang` }, { $set: { channelID: "an", reason: `lang` } }, { new: true });
                    return message.channel.send(`<:checkmark:769230483820773426>** | the bot is now in English !**`);
                }

            }
        } else {
            return message.channel.send("<:information:769234471236665355> | **Merci de bien utiliser cette commande : setlang fr/an**");
        }

    }
    if (command === 'rr-send') {
        let usage = "<role> <emoji>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAjoute un role aux roles à réaction\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }



        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb) {


            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Roles à réaction`)
                .setDescription("Réagissez avec l'emoji correspondant au role que vous voulez")
                .addField("Roles", channeldb.map(rr => ` ${rr.reaction}   ➡   <@&${rr.roleID}> `).join(`
                `))


            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed).then(function(message) {
                channeldb.forEach(command => {
                    message.react(command.reaction);
                });
            })

        } else {

            return message.channel.send(`<:cancel1:769230483863109632> | Aucun Role à réaction pour ce serveur`);

        }




    }
    if (command === 'rr-list') {
        let usage = "<role> <emoji>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAjoute un role aux roles à réaction\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }



        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb) {


            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Liste dés roles à réaction`)


            .setDescription(channeldb.map(rr => `<@&${rr.roleID}> ===>  ${rr.reaction}`).join(`
            `))

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
        } else {

            return message.channel.send(`<:cancel1:769230483863109632> | Aucun Role à réaction pour ce serveur`);

        }




    }
    if (command === 'setmoney') {
        let usage = "<nom>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nChange la monaie du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let money = args[0];
        if (!args[0]) return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);

        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `servermoney` })
        if (channeldb) {

            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `servermoney` }, { $set: { channelID: money, reason: `servermoney` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426> | L'unitée monétaire sur ce serveur est désormais le \`${money}\` !`);



        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${money}`,
                reason: 'servermoney',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426> | L'unitée monétaire sur ce serveur est désormais le \`${money}\` !`);

        }



    }
    if (command === 'shop') {
        let moneydb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `servermoney` })
        let money;
        if (moneydb) {
            money = moneydb.channelID;
        } else {
            money = " 💰 LightDollars"
        }

        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAffiche le shop du rpg\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }


        if (args.length) {
            const nom = args[0];
            let channeldb = await shoprpg.findOne({ serverID: message.guild.id, nom: nom })
            if (channeldb) {
                let user = client.users.cache.get(channeldb.von);
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(` ℹ | Item : ${nom}`)
                    .setImage(url = "https://tutosduweb.000webhostapp.com/site/assets/image.png")
                    .addField("Informations ", `
                   Nom : ${nom}
                   Prix : ${channeldb.cout} ${money}
                   ajouté par : \`${user.tag}\`[<@${channeldb.von}>] `)


                .setDescription(`Voici des informations sur l'item ${nom}`)

                .setFooter("© 2020 - Light bot")
                    .setTimestamp()
                    .setColor("#2f3136");
                message.channel.send(reportEmbed);
            } else {
                message.channel.send(`<:cancel1:769230483863109632> | Je ne trouve aucun item avec le nom \`${nom}\` sur ce serveur `)
            }
        } else {
            let channeldb = await shoprpg.find({ serverID: message.guild.id })
            if (channeldb) {
                let errmsg;
                if (message.member.hasPermission('MANAGE_GUILD')) {
                    errmsg = `<:cancel1:769230483863109632> | Ce serveur n'a aucun items dans le shop. Comme vous avez la permission , vous pouvez en ajouter un avec la commade \`shop-add\` `;
                } else {
                    errmsg = `<:cancel1:769230483863109632> | Ce serveur n'a aucun items dans le shop`;
                }

                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`🛒 | Light Shop :`)
                    .setImage(url = "https://tutosduweb.000webhostapp.com/site/assets/image.png")
                    .addField("Shop du RPG ", `
                **Guerre**
                \`Bouclier\` : 25 ${money}
                \`Lance\` : 15 ${money}
                **Outils**
                \`Faux\` : 25 ${money}
                \`Serpe\` : 15 ${money}`)
                    .addField("Shop du serveur ", channeldb.map(rr => `\`${rr.nom}\` ===>  ${rr.cout} ${money} [<@${rr.von}>]`).join(`
                `) || errmsg)

                .setDescription(`Voici les items du shop de light ,avec leur prix en  ${money} , pour acheter un élement , faites ${prefix}buy <item>`)

                .setFooter("© 2020 - Light bot")
                    .setTimestamp()
                    .setColor("#2f3136");
                message.channel.send(reportEmbed);
            } else {


            }

        }


    }
    if (command === 'quete-start') {

        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAjoute un item au shop du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`<:quest:783381643926044702> | Nouvelle quete`)


        .addField("Buts de quetes", `
        1. Le cristal de Light (💎)
        2. la pierre Philosophale (🥌)
        3. le code de Light (🍱)`)

        .setDescription(`Bonjour étranger , tu es sur le point de démarer une nouvelle quete , mais tout d'abord , donnons un sens à cette quete. Veuillez réagir avec l'emoji correspondant`)

        .setFooter("© 2020 - Light bot")
            .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(reportEmbed).then(m => {


            m.react("💎")
            m.react("🥌")
            m.react("🍱")
            const filtro = (reaction, user) => {
                return user.id == message.author.id;
            };
            m.awaitReactions(filtro, {
                max: 1,
                time: 20000,
                errors: ["time"]
            }).catch(() => {
                m.edit("<:cancel1:769230483863109632> | Le temps est écoulé! Opération annulée !");
            }).then(coleccionado => {

                const reaccion = coleccionado.first();
                if (reaccion.emoji.name === "💎") {

                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(`<:quest:783381643926044702> | Diamant de Light`)


                    .addField("Profils", `
                1. Guerrier (⚔)
                2. Animal (🦮)
                3. Dévellopeur (🐞)`)

                    .setDescription(`Bien , bien , maintenant que nous avons un but , il nous faut savoir comment l'atteindre...`)

                    .setFooter("© 2020 - Light bot")
                        .setTimestamp()
                        .setColor("#2f3136");
                    message.channel.send(reportEmbed).then(m => {


                        m.react("⚔")
                        m.react("🦮")
                        m.react("🐞")
                        const filtro = (reaction, user) => {
                            return user.id == message.author.id;
                        };
                        m.awaitReactions(filtro, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).catch(() => {
                            m.edit("<:cancel1:769230483863109632> | Le temps est écoulé! Opération  annulée !");
                        }).then(coleccionado => {

                            const reaccion = coleccionado.first();
                            if (reaccion.emoji.name === "⚔") {
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom`,
                                    but: `code de Light`,
                                    profil: `Guerrier`,
                                    level: `0`,
                                    xp: `0`,
                                }).save();
                                return message.channel.send(`<:checkmark:769230483820773426> | Bien bien... brave Guerrier, ta quete  du code de Light va commencer`);
                            };
                            if (reaccion.emoji.name === "🦮") {
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom`,
                                    but: `code de Light`,
                                    profil: `Animal`,
                                    level: `0`,
                                    xp: `0`,
                                }).save();
                                return message.channel.send(`<:checkmark:769230483820773426> | Bien bien ...rusé animal, ta quete  du code de Light va commencer`);
                            };
                            if (reaccion.emoji.name === "🐞") {
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom`,
                                    but: `code de Light`,
                                    level: `0`,
                                    profil: `Dévellopeur`,
                                    xp: `0`,
                                }).save();
                                return message.channel.send(`<:checkmark:769230483820773426> | Bien bien...cher Développeur, ta quete  du code de Light va commencer`);
                            };
                        });
                    });

                };
                if (reaccion.emoji.name === "🥌") {
                    const verynew = new Adventure({
                        UserID: `${message.author.id}`,
                        nom: `Quete sans nom`,
                        but: `Pierre philosophale`,
                        level: `0`,
                        xp: `0`,
                    }).save();
                    return message.channel.send(`<:checkmark:769230483820773426> | Bien bien , ta quete  de  la pierre philosophale va commencer`);
                };
                if (reaccion.emoji.name === "🍱") {
                    const verynew = new Adventure({
                        UserID: `${message.author.id}`,
                        nom: `Quete sans nom`,
                        but: `code de Light`,
                        level: `0`,
                        xp: `0`,
                    }).save();
                    return message.channel.send(`<:checkmark:769230483820773426> | Bien bien , ta quete  du code de Light va commencer`);
                };
            })
        })








    }
    if (command === 'quete-list') {


        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAffiche le shop du rpg\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }



        let channeldb = await Adventure.find({ UserID: message.author.id })

        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`<:quest:783381643926044702> | Vos quetes`)


        .addField("Liste de vos quetes ", channeldb.map(rr => `\`${rr.nom}\` / Niveau ${rr.level} ,${rr.xp} XP  / ${rr.profil || 'profil non disponible pour cette quete'} `).join(`
                `) || '<:cancel1:769230483863109632> | Vous n\'avez aucunne quete en cours')

        .setDescription(`Voici toutes vos quetes , leur dates , leur but et leur avancement`)

        .setFooter("© 2020 - Light bot")
            .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(reportEmbed);





    }
    if (command === 'shop-remove') {
        let usage = "<nom>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nSupprime un item du shop du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }


        let nom = args[0];

        if (!nom) {
            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
        }


        let channeldb = await shoprpg.findOne({ serverID: message.guild.id, nom: nom })
        if (channeldb) {

            const newchannel = await shoprpg.findOneAndDelete({ serverID: message.guild.id, nom: nom });

            return message.channel.send(`<:checkmark:769230483820773426> | Item supprimé avec succès du shop`);

        } else {

            message.channel.send(`<:cancel1:769230483863109632> | Je ne trouve aucun item avec le nom \`${nom}\` sur ce serveur `)


        }




    }
    if (command === 'shop-add') {
        let usage = "<nom> <prix>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAjoute un item au shop du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(ldb.ADM);
        }

        let nom = args[0];
        let prix = args[1];
        if (!nom) {
            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
        }


        if (!prix) return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);

        let channeldb = await shoprpg.findOne({ serverID: message.guild.id, nom: nom })
        if (channeldb) {

            return message.channel.send(`<:cancel1:769230483863109632> | J'ai déja un item avec ce nom dans ma base de donées...`);

        } else {
            const verynew = new shoprpg({
                serverID: `${message.guild.id}`,
                nom: `${nom}`,
                cout: `${prix}`,
                von: `${message.author.id}`,
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426> | Item ajouté avec succès : \`${nom}\` ==> ${prix} 💰`);

        }




    }
    if (command === 'rr-add') {
        let usage = "<role> <emoji>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAjoute un role aux roles à réaction\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) {
            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
        }
        console.log(args[1])
        let emoji = args[1];
        if (!emoji) return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);

        let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
        if (channeldb) {

            return message.channel.send(`<:cancel1:769230483863109632> | J'ai déja ce role dans ma base de donées...`);

        } else {
            const verynew = new rrmodel({
                serverID: `${message.guild.id}`,
                roleID: `${role.id}`,
                reaction: `${emoji}`,
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426> | Role à réaction ajouté avec succès : \`${role.name}\` ==> ${emoji}`);

        }




    }
    if (command === 'rr-remove') {
        let usage = "<role>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nAjoute un role aux roles à réaction\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!role) {
            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
        }

        let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
        if (channeldb) {

            const newchannel = await rrmodel.findOneAndDelete({ serverID: message.guild.id, roleID: role.id });

            return message.channel.send(`<:checkmark:769230483820773426> | Role supprimé avec succès`);

        } else {

            return message.channel.send(`<:cancel1:769230483863109632> | Je n'ai pas ce role dans ma base de donées...`);

        }




    }
    if (command === 'setcount') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (!args[0]) return message.channel.send("<:information:769234471236665355> | **Merci de bien utiliser cette commande : setcount on/off**");
        if (args[0] == "on") {
            let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `count` })
            if (channeldb) {

                return message.channel.send(`<:checkmark:769230483820773426>** | Le système de comptage est déja activé, pour le désactiver , faites \`setcount off\` !**`);
            } else {
                const members = message.guild.members.cache;
                const verynew = new ChannelModel({
                    serverID: `${message.guild.id}`,
                    channelID: `enabled`,
                    reason: 'count',
                }).save();
                message.guild.channels.create(`👱🏼‍♂️Membres :${members.filter(member => !member.user.bot).size}`, { type: "voice" }).then(
                    (chan) => {

                        chan.createOverwrite(message.guild.id, {
                            CREATE_INSTANT_INVITE: false,

                            CONNECT: false,
                            SPEAK: false
                        })


                    });
                message.guild.channels.create(`🤖Bots :${members.filter(member => member.user.bot).size}`, { type: "voice" }).then(
                    (chan) => {
                        chan.createOverwrite(message.guild.id, {
                            CREATE_INSTANT_INVITE: false,

                            CONNECT: false,
                            SPEAK: false
                        })
                    });
                message.guild.channels.create(`🌎Total : ${message.guild.memberCount}`, { type: "voice" }).then(
                    (chan) => {
                        chan.createOverwrite(message.guild.id, {
                            CREATE_INSTANT_INVITE: false,

                            CONNECT: false,
                            SPEAK: false
                        })

                    });


                return message.channel.send(`<:checkmark:769230483820773426>** | Le système de comptage est désormais activé !**`);
            }
        }
        if (args[0] == "off") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.channel.send("<:cancel1:769230483863109632> | **vous n'avez pas la permission `ADMINISTRATEUR`**");
            let verifyg = await ChannelModel.findOne({ serverID: message.guild.id, reason: `count` })
            if (verifyg) {
                const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `count` });
                return message.channel.send(`<:checkmark:769230483820773426> **| Le système de comptage est désormais désactivé !**`);
            } else {
                return message.channel.send('**<:cancel1:769230483863109632> | Vous devez avoir une configuration pour la supprimer!**')
            }
        } else {
            return message.channel.send("<:information:769234471236665355> | **Merci de bien utiliser cette commande : l.setcount on/off**");
        }

    }
    if (command === 'setlevel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `level` })
        if (channeldb) {

            return message.channel.send(`<:checkmark:769230483820773426>** | Le système de niveau est déja activé, pour le désactiver , faites \`l.unsetlevel\` !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `rien`,
                reason: 'level',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le système de niveau est désormais activé !**`);
        }
    }
    if (command === 'pannel') {
        let welchanneldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `welcome` })
        let welchannel;
        if (welchanneldb) {
            welchannel = `<#` + welchanneldb.channelID + `>`;
        } else {
            welchannel = "Non configuré";
        }
        let leavechanneldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `leave` })
        let leavechannel;
        if (leavechanneldb) {
            leavechannel = `<#` + leavechanneldb.channelID + `>`;

        } else {
            leavechannel = "Non configuré";
        }
        let suggchanneldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `suggestion` })
        let suggchannel;
        if (suggchanneldb) {
            suggchannel = `<#` + suggchanneldb.channelID + `>`;

        } else {
            suggchannel = "Non configuré";
        }
        let autochanneldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `autorole` })
        let autorole;
        if (autochanneldb) {
            autorole = `<@&` + autochanneldb.channelID + `>`;

        } else {
            autorole = "Non configuré";
        }
        let logchanneldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `logs` })
        let logchannel;
        if (logchanneldb) {
            logchannel = `<#` + logchanneldb.channelID + `>`;

        } else {
            logchannel = "Non configuré";
        }
        let insultdb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `insult` })
        let sinsult;
        if (insultdb) {
            sinsult = `Activé`;

        } else {
            sinsult = "Non configuré";
        }
        let anndb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `ann` })
        let ann;
        if (anndb) {
            ann = `<#` + anndb.channelID + `>`;

        } else {
            ann = "Non configuré";
        }

        const paul = new Discord.MessageEmbed()
            .setColor('#303136')
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setTitle('<:equalizer:764791355334459392> Configuration du bot Light')
            .addFields({ name: 'Salon de bienvenue', value: welchannel })
            .addFields({ name: 'Salon de départ', value: leavechannel })
            .addFields({ name: 'Salon de suggestion', value: suggchannel })
            .addFields({ name: 'Autotole', value: autorole })
            .addFields({ name: 'Salon des logs', value: logchannel })
            .addFields({ name: 'Anti insultes', value: sinsult })
            .addFields({ name: 'Salle des annonces', value: ann })
            .addFields({ name: 'Préfixe', value: prefix })
        message.channel.send(paul);

    }
    if (command === 'setannchannel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setsannchannel <salon>  !**");
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `ann` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `ann` }, { $set: { channelID: channel.id, reason: `ann` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des annonces est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'ann',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des annonces est désormais  ${channel}!**`);
        }
    }

    if (command === 'setlogschannel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setslogschannel <salon>  !**");
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `logs` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `logs` }, { $set: { channelID: channel.id, reason: `logs` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des logs est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'logs',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des logs est désormais  ${channel}!**`);
        }
    }
    if (command === 'setsuggchannel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setsuggchannel <salon>  !**");
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `suggestion` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `suggestion` }, { $set: { channelID: channel.id, reason: `suggestion` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des suggestions est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'suggestion',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des suggestions est désormais  ${channel}!**`);
        }
    }
    if (command === 'sugg') {
        let reason = args.join(" ");
        if (!reason) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : sugg <suggestion> !**");

        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `suggestion` })
        if (!channeldb) return message.channel.send('<:cancel1:769230483863109632> |  ** le système de suggestion n\'est pas activé sur ce serveur  !**')
        else {

            message.channel.send(`<:checkmark:769230483820773426>** | Suggestion envoyée avec succès**`);
            const paul = new Discord.MessageEmbed()
                .setTitle('💡 Suggestion !')
                .setDescription(reason)
                .setFooter(`par : ${message.author.tag}`)
                .setColor("RANDOM")
            let sugg = message.guild.channels.cache.get(channeldb.channelID)
            sugg.send(paul).then(function(message) {
                message.react('✅');
                message.react('➖');
                message.react('❌');
            })
        }

    }
    if (command == "unsetsuggchannel") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `suggestion` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `suggestion` });
            return message.channel.send(`<:checkmark:769230483820773426> **| Le bot n'a plus le système de suggestions !**`);
        } else {
            message.channel.send(`<:cancel1:769230483863109632> **| Le bot n'a pas déjà un système de suggestions !**`);
        }
    }
    if (command === "cu") {
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 60) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 10;
        const n = Math.floor(Math.random() * limit + 1);
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `cu` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `cu` }, { $set: { channelID: newfric, reason: `cu` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: 'cu',
            }).save();

        }
        const embed = new Discord.MessageEmbed()
            .setTitle('<:mushrooms:767285887184666624> Tu a ramassé des champignons avec succès')
            .setDescription(`${message.member}, tu a trouve  **${n}** champignons`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("#582900");
        message.channel.send(embed);
    }
    if (command === "cp") {
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 60) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 10;
        const n = Math.floor(Math.random() * limit + 1);
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `bois` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `bois` }, { $set: { channelID: newfric, reason: `bois` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: 'bois',
            }).save();

        }
        const embed = new Discord.MessageEmbed()
            .setTitle('<:wood:767285887230541835> Tu a coupé du bois avec succès')
            .setDescription(`${message.member}, tu a coupé  **${n}** bouts de bois`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("#582900");
        message.channel.send(embed);
    }
    if (command === 'vendre') {
        //la Viande a 7 la pièce

        let viandedb = await ChannelModel.findOne({ serverID: message.author.id, reason: `viande` })
        let viande;
        if (viandedb) {
            viande = viandedb.channelID;
            unit = '5';
            gainv = math.evaluate(`${viande} * ${unit}`);
            let updatenewcv = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `viande` }, { $set: { channelID: '0', reason: `viande` } }, { new: true });
        } else {
            gainv = "0";
        }

        //Now the bois a 4 la pièce

        let boisdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `bois` })
        let bois;
        if (boisdb) {
            bois = boisdb.channelID;
            unite = '4';
            gainb = math.evaluate(`${bois} * ${unite}`);
            let updatenewcbois = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `bois` }, { $set: { channelID: '0', reason: `bois` } }, { new: true });
        } else {
            gainb = "0";
        }

        //fin
        //Now the champignon a 4 la pièce

        let chmdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `cu` })
        let chm;
        if (chmdb) {
            chm = chmdb.channelID;
            unita = '6';
            gainchm = math.evaluate(`${chm} * ${unita}`);
            let updatenewcchamp = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `cu` }, { $set: { channelID: '0', reason: `cu` } }, { new: true });
        } else {
            gainchm = "0";
        }

        //fin
        //Now the ble a 4 la pièce

        let bledb = await ChannelModel.findOne({ serverID: message.author.id, reason: `épis de blé` })
        let ble;
        if (bledb) {
            ble = bledb.channelID;
            unitat = '3';
            gainble = math.evaluate(`${ble} * ${unitat}`);
            let updatenewcchampe = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `épis de blé` }, { $set: { channelID: '0', reason: `épis de blé` } }, { new: true });
        } else {
            gainble = "0";
        }
        let carrotdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `carottes` })
        let carott;
        if (carrotdb) {
            carott = carrotdb.channelID;
            unitate = '4';
            gaincarr = math.evaluate(`${carott} * ${unitate}`);
            let updatenewcchgampe = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `carottes` }, { $set: { channelID: '0', reason: `carottes` } }, { new: true });
        } else {
            gaincarr = "0";
        }
        let fraidb = await ChannelModel.findOne({ serverID: message.author.id, reason: `fraises` })
        let frai;
        if (fraidb) {
            frai = fraidb.channelID;
            unitateh = '5';
            gainfr = math.evaluate(`${frai} * ${unitateh}`);
            let updatenewgccghgampe = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `fraises` }, { $set: { channelID: '0', reason: `fraises` } }, { new: true });
        } else {
            gainfr = "0";
        }
        let tomdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `tomate` })
        let tom;
        if (tomdb) {
            tom = tomdb.channelID;
            xu = '4';
            gaintom = math.evaluate(`${tom} * ${xu}`);
            let updategnewcchgampe = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `tomate` }, { $set: { channelID: '0', reason: `tomate` } }, { new: true });
        } else {
            gaintom = "0";
        }
        let patdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `patate` })
        let pat;
        if (patdb) {
            pat = patdb.channelID;
            xuv = '4';
            gainpat = math.evaluate(`${pat} * ${xuv}`);
            let updategnedwcchgampe = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `patate` }, { $set: { channelID: '0', reason: `patate` } }, { new: true });
        } else {
            gainpat = "0";
        }
        let bandb = await ChannelModel.findOne({ serverID: message.author.id, reason: `bananes` })
        let ban;
        if (bandb) {
            ban = bandb.channelID;
            xuvs = '4';
            gainban = math.evaluate(`${ban} * ${xuvs}`);
            let updatedgnedwcchgampe = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `bananes` }, { $set: { channelID: '0', reason: `bananes` } }, { new: true });
        } else {
            gainban = "0";
        }
        //fin
        let gaintotal = math.evaluate(`${gainv} + ${gainb} + ${gainchm} + ${gainble} + ${gaincarr} + ${gainfr} + ${gaintom} + ${gainpat} + ${gainban}`);
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `argent` })
        if (biodb) {
            let argent = biodb.channelID;

            newfric = math.evaluate(`${argent} + ${gaintotal}`);
            let updatefric = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `argent` }, { $set: { channelID: newfric, reason: `argent` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${gaintotal}`,
                reason: 'argent',
            }).save();

        }
        message.channel.send(`<:checkmark:769230483820773426>** | Tu as vendu tes ressources avec succès et tu a gagné  \`${gaintotal}\` <:coin:755774010293223565>!**`);
    }
    if (command === 'inv-valeur') {
        //la Viande a 7 la pièce

        let viandedb = await ChannelModel.findOne({ serverID: message.author.id, reason: `viande` })
        let viande;
        if (viandedb) {
            viande = viandedb.channelID;
            unit = '7';
            gainv = math.evaluate(`${viande} * ${unit}`);

        } else {
            gainv = "0";
        }

        //Now the bois a 4 la pièce

        let boisdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `bois` })
        let bois;
        if (boisdb) {
            bois = boisdb.channelID;
            unite = '4';
            gainb = math.evaluate(`${bois} * ${unite}`);

        } else {
            gainb = "0";
        }

        //fin
        //Now the champignon a 4 la pièce

        let chmdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `cu` })
        let chm;
        if (chmdb) {
            chm = chmdb.channelID;
            unita = '6';
            gainchm = math.evaluate(`${chm} * ${unita}`);

        } else {
            gainchm = "0";
        }

        //fin
        //Now the ble a 4 la pièce

        let bledb = await ChannelModel.findOne({ serverID: message.author.id, reason: `épis de blé` })
        let ble;
        if (bledb) {
            ble = bledb.channelID;
            unitat = '3';
            gainble = math.evaluate(`${ble} * ${unitat}`);

        } else {
            gainble = "0";
        }
        let carrotdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `carottes` })
        let carott;
        if (carrotdb) {
            carott = carrotdb.channelID;
            unitate = '4';
            gaincarr = math.evaluate(`${carott} * ${unitate}`);

        } else {
            gaincarr = "0";
        }
        let fraidb = await ChannelModel.findOne({ serverID: message.author.id, reason: `fraises` })
        let frai;
        if (fraidb) {
            frai = fraidb.channelID;
            unitateh = '7';
            gainfr = math.evaluate(`${frai} * ${unitateh}`);

        } else {
            gainfr = "0";
        }
        let tomdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `tomate` })
        let tom;
        if (tomdb) {
            tom = tomdb.channelID;
            xu = '4';
            gaintom = math.evaluate(`${tom} * ${xu}`);

        } else {
            gaintom = "0";
        }
        let patdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `patate` })
        let pat;
        if (patdb) {
            pat = patdb.channelID;
            xuv = '4';
            gainpat = math.evaluate(`${pat} * ${xuv}`);

        } else {
            gainpat = "0";
        }
        //fin
        let gaintotal = math.evaluate(`${gainv} + ${gainb} + ${gainchm} + ${gainble} + ${gaincarr} + ${gainfr} + ${gaintom} + ${gainpat}`);


        message.channel.send(`<:checkmark:769230483820773426>** | La valeur de ton inventaire est de \`${gaintotal}\` <:coin:755774010293223565>!**`);
    }
    if (command === 'profil') {
        const member = message.mentions.members.last() || message.member;
        let biodb = await ChannelModel.findOne({ serverID: member.id, reason: `bio` })
        let bio;
        if (biodb) {
            bio = biodb.channelID;

        } else {
            bio = "Aucune bio";
        }
        let fricdb = await ChannelModel.findOne({ serverID: member.id, reason: `argent` })
        let fric;
        if (fricdb) {
            fric = fricdb.channelID;

        } else {
            fric = "0";
        }
        let likedb = await ChannelModel.findOne({ serverID: member.id, reason: `like` })
        let like;
        if (likedb) {
            like = likedb.channelID;

        } else {
            like = "0";
        }
        let banndb = await ChannelModel.findOne({ serverID: member.id, reason: `bann` })
        let bann;
        if (banndb) {
            bann = banndb.channelID;

        } else {
            bann = "aucunne bannière";
        }
        let vipdb = await ChannelModel.findOne({ serverID: member.id, reason: `vip` })
        let vip;
        if (vipdb) {
            vip = "Oui";

        } else {
            vip = "Non";
        }
        let embed = new Discord.MessageEmbed()
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Voici les informations pour ${member.user.username}`)
            .setImage(url = 'https://tutosduweb.000webhostapp.com/@dmin/img/image.png')
            .addField('<:biography:771798016311033877> Bio', bio)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField('<:winner:759788646467108874> Like', like, true)
            .addField('<:coin:755774010293223565> MCdollars', fric, true)
            .addField('<:banners:769230483929694208> Bannières', bann, true)
            .addField('<:vip:769230483547750470> VIP', vip, true)
            .setColor('#0099ff')
        message.channel.send(embed);
    }
    if (command === "donner") {

        const member = message.mentions.members.last();
        if (!member) return message.channel.send(`<:cancel1:769230483863109632> **| Merci de bien utliser cettte commande : l.donner <membre> <nombre> **`);
        let n = args[1];
        if (!n) return message.channel.send(`<:cancel1:769230483863109632> **| Merci de bien utliser cettte commande : l.donner <membre> <nombre> **`);
        if (n < 0) return message.channel.send(`<:cancel1:769230483863109632> **| ${member} a voulu voler de l'argent à ${member.user.tag} !!**`);
        let authordb = await ChannelModel.findOne({ serverID: message.author.id, reason: `argent` })
        if (authordb) {
            let auact = authordb.channelID;
            if (n > auact) return message.channel.send(`<:cancel1:769230483863109632> **| Vous n'avez pas asser ! **`);
            newfric = math.evaluate(`${auact} - ${n}`);
            const update = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `argent` }, { $set: { channelID: newfric, reason: `argent` } }, { new: true });

            let userdb = await ChannelModel.findOne({ serverID: member.id, reason: `argent` })
            if (userdb) {
                let argact = userdb.channelID;
                newfrice = math.evaluate(`${argact} + ${n}`);
                const newcbio = await ChannelModel.findOneAndUpdate({ serverID: member.id, reason: `argent` }, { $set: { channelID: newfrice, reason: `argent` } }, { new: true });
                return message.channel.send(`<:checkmark:769230483820773426>** | Vous avez donné ${n} à ${member.user.tag} !**`);
            } else {
                const verynew = new ChannelModel({
                    serverID: `${member.id}`,
                    channelID: `${n}`,
                    reason: 'argent',
                }).save();
                return message.channel.send(`<:checkmark:769230483820773426>** | Vous avez donné ${n} à ${member.user.tag} !**`);
            }

        } else {
            return message.channel.send(`<:cancel1:769230483863109632> **| Vous n'avez pas asser ! **`);
        }
    }
    if (command === "givemoney") {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du rpg pour utliser cette commande !**");

        const member = message.mentions.members.last();
        if (!member) return message.channel.send(`<:cancel1:769230483863109632> **|Merci de bien utliser cettte commande : l.givemoney <membre> **`);
        let n = args[1];
        if (!n) return message.channel.send(`<:cancel1:769230483863109632> **|Merci de bien utliser cettte commande : l.givemoney <membre> <nombre> **`);

        let biodb = await ChannelModel.findOne({ serverID: member.id, reason: `argent` })
        if (biodb) {
            let likeact = biodb.channelID;
            newfric = math.evaluate(`${likeact} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: member.id, reason: `argent` }, { $set: { channelID: newfric, reason: `argent` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${member.id}`,
                channelID: `${n}`,
                reason: 'argent',
            }).save();

        }
        return message.channel.send(`<:checkmark:769230483820773426>** | Vous avez ajouté ${n} à ${member.user.tag} !**`);
    }
    if (command === 'resetmoney') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du rpg pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : resetmoney <membre>   !**");
        const verify = await ChannelModel.findOne({ serverID: member.id, reason: `argent` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: member.id, reason: `argent` });
            return message.channel.send(`<:checkmark:769230483820773426> **| L'argent de  ${member.user.tag} a été remis à 0 !**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Cette personne n\'a pas d\'argent!**')
        }
    }
    if (command === 'resetbanner') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du rpg pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : resetbaner <membre>   !**");
        const verify = await ChannelModel.findOne({ serverID: member.id, reason: `bann` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: member.id, reason: `bann` });
            return message.channel.send(`<:checkmark:769230483820773426> **| les bannières de  ${member.user.tag} ont toutes été supprimées !**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Cette personne n\'a aucunne bannière!**')
        }
    }
    if (command === 'deblacklist') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du bot pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : deblacklist <membre>   !**");
        const verify = await ChannelModel.findOne({ serverID: member.id, reason: `black` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: member.id, reason: `black` });
            return message.channel.send(`<:checkmark:769230483820773426> **| ${member.user.tag} n'est plus blacklisté du bot!**`);
        } else {
            return message.channel.send(`** <:cancel1:769230483863109632> | ${member.user.tag} n'est pas blacklisté du bot!**`);
        }
    }
    if (command === 'blacklist') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du bot pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:cancel1:769230483863109632> |  ** Merci de bien utiliser cette commande : blacklist <membre>   !**");

        let biodb = await ChannelModel.findOne({ serverID: member.id, reason: `black` })
        if (biodb) {

            return message.channel.send(`** <:cancel1:769230483863109632> | ${member.user.tag} est déja blacklisté du bot!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${member.id}`,
                channelID: `true`,
                reason: 'black',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | ${member.user.tag} est désormais blacklisté du bot !!**`);
        }
    }
    if (command === 'unvip') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du rpg pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : unvip <membre>   !**");
        const verify = await ChannelModel.findOne({ serverID: member.id, reason: `vip` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: member.id, reason: `vip` });
            return message.channel.send(`<:checkmark:769230483820773426> **| ${member.user.tag} n'est plus vip !**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Cette personne n\'est pas vip !**')
        }
    }
    if (command === 'vip') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du rpg pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:cancel1:769230483863109632> |  ** Merci de bien utiliser cette commande : vip <membre>   !**");

        let biodb = await ChannelModel.findOne({ serverID: member.id, reason: `vip` })
        if (biodb) {

            return message.channel.send(`** <:cancel1:769230483863109632> | ${member.user.tag} est déja vip!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${member.id}`,
                channelID: `true`,
                reason: 'vip',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | ${member.user.tag} est désormais vip !!**`);
        }
    }
    if (command === 'addbanner') {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du rpg pour utliser cette commande !**");
        const member = message.mentions.members.last();
        if (!member) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : addbaner <membre> <nom>  !**");
        let name = args.slice(1).join(" ");
        if (!name) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : addbaner <membre> <nom>  !**");
        let biodb = await ChannelModel.findOne({ serverID: member.id, reason: `bann` })
        if (biodb) {
            let actban = biodb.channelID;
            let newban = `${actban},  ${name}`;
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: member.id, reason: `bann` }, { $set: { channelID: newban, reason: `bann` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Bannière ajoutée avec succès à ${member.user.tag} !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${member.id}`,
                channelID: `${name}`,
                reason: 'bann',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Bannière ajoutée avec succès à ${member.user.tag} !**`);
        }
    }
    if (command === 'setbio') {
        let bio = args.join(" ")
        let usage = "<user>**";

        if (!bio) return message.channel.send(ldb.langusage + command + usage);
        let biodb = await ChannelModel.findOne({ serverID: message.member.id, reason: `bio` })
        if (biodb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.member.id, reason: `bio` }, { $set: { channelID: bio, reason: `bio` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Votre bio a été mise à jour avec succès !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.member.id}`,
                channelID: `${bio}`,
                reason: 'bio',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Votre bio a été enregistrée avec succès!**`);
        }
    }
    if (command === 'setbotlogs') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        let usage = "<channel>**";

        if (!channel) return message.channel.send(ldb.langusage + command + usage);
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `blogs` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `blogs` }, { $set: { channelID: channel.id, reason: `blogs` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des logs du bot est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'blogs',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des logs du bot est désormais  ${channel}!**`);
        }
    }
    if (command === 'unsetafk') {

        const verify = await ChannelModel.findOne({ serverID: message.member.id, reason: `afk` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.member.id, reason: `afk` });
            return message.channel.send(`<:checkmark:769230483820773426> **| Votre afk a été supprimé avec succès !**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Vous n\'etes pas  afk !**')
        }
    }
    if (command === 'setafk') {
        let bio = args.join(" ")
        let usage = "<raison>**";
        if (!bio) return message.channel.send(ldb.langusage + command + usage);
        if (bio.includes('@everyone')) return message.channel.send('**<:cancel1:769230483863109632> | Ta raison doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !**')
        if (bio.includes('@here')) return message.channel.send('**<:cancel1:769230483863109632> | Ta raison doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !**')
        if (bio.length < 2 || bio > 32) {
            return message.channel.send('**<:cancel1:769230483863109632> | Ta raison doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !**')
        }
        let biodb = await ChannelModel.findOne({ serverID: message.member.id, reason: `afk` })
        if (biodb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.member.id, reason: `afk` }, { $set: { channelID: bio, reason: `afk` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Votre statut d'afk a été mis à jour avec succès !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.member.id}`,
                channelID: `${bio}`,
                reason: 'afk',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Votre afk a été enregistrée avec succès!**`);
        }
    }
    if (command === 'addemoji') {
        let usage = "<nom> <url>**";
        const URL = args[0];
        if (!URL) {
            return message.channel.send(ldb.langusage + command + usage);
        }

        const name = args[1] ? args[1].replace(/[^a-z0-9]/gi, "") : null;
        if (!name) {
            return message.channel.send(ldb.langusage + command + usage);
        }
        if (name.length < 2 || name > 32) {
            return message.error("administration/addemoji:INVALID_NAME");
        }

        message.guild.emojis
            .create(URL, name)
            .then(emoji => {
                message.channel.send(ldb.Esucces);
            })
            .catch(() => {
                message.channel.send(ldb.err);
            });
    }
    if (command === 'perms') {
        const permissions = Object.keys(Discord.Permissions.FLAGS);
        const member = message.mentions.members.first() || message.member;
        let text = `hm`;
        const mPermissions = message.channel.permissionsFor(member);
        const total = {
            denied: 0,
            allowed: 0
        };
        permissions.forEach((perm) => {
            if (!mPermissions.has(perm)) {
                text += `${perm} <:toggle:774711399145799690>\n`;
                total.denied++;
            } else {
                text += `${perm} <:hm:774711399162052648> \n`;
                total.allowed++;
            }
        });
        const paul = new Discord.MessageEmbed()
            .setColor('#303136')
            .setTitle(`Permissions de ${member.user.username} sur ${message.guild.name}`)
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setDescription(text)



        message.channel.send(paul);


    }
    if (command === 'remind') {
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : remind <temps> <raison> !**");
        }
        let tmp = args[0];
        let des = args.slice(1).join(" ");
        if (!des) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : remind <temps> <raison> !**");
        message.channel.send(`<:checkmark:769230483820773426>**| je vous rapelle dans ${tmp} de ${des}** `);
        setTimeout(() => {
            message.channel.send(`<:information:769234471236665355> ** | ${message.author}  je vous rapelle de \`${des}\`** `);
        }, ms(tmp) * 6000);

    }
    if (command === "setstatus") {
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656' && message.author.id !== '721724837986566246') return message.channel.send("<:information:769234471236665355> ** | Tu dois etre admin du bot pour utliser cette commande !**");
        var argresult = args.join(' ');
        if (!argresult) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : setstatus <texte>!**");
        client.user.setActivity(argresult);
        message.channel.send("<:checkmark:769230483820773426>**| Le statut du bot a bien été mis à jour **");

    }
    if (command === "essai") {
        let member = message.member;
        const captcha = await createCaptcha();
        try {
            const msg = await member.send('You have 60 seconds to solve the captcha', {
                files: [{
                    attachment: `${__dirname}/captchas/${captcha}.png`,
                    name: `${captcha}.png`
                }]
            });
            try {
                const filter = m => {
                    if (m.author.bot) return;
                    if (m.author.id === member.id && m.content === captcha) return true;
                    else {
                        m.channel.send('You entered the captcha incorrectly.');
                        return false;
                    }
                };
                const response = await msg.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] });
                if (response) {
                    await msg.channel.send('You have verified yourself!');
                    await member.roles.add('759464867089875024');
                    await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                        .catch(err => console.log(err));
                }
            } catch (err) {
                console.log(err);
                await msg.channel.send('You did not solve the captcha correctly on time.');
                await member.kick();
                await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                    .catch(err => console.log(err));
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (command === "test") {
        const member = message.mentions.members.last() || message.member;
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })
        const img = message.author.displayAvatarURL({ format: 'png' });
        const n = 0;
        const finalxp = math.evaluate(`${userdata.xp} + ${n}`)
        const finall = math.evaluate(`${userdata.level} + ${n}`)
        const finalm = math.evaluate(`${userdata.messagec} + ${n}`)

        const rank = new canvacord.Rank()
            .setAvatar(img)
            .setCurrentXP(finalxp)
            .setRequiredXP(200)
            .setRank(finalm, "Messages :")
            .setLevel(finall, "Niveau ")
            .setStatus("dnd")
            .renderEmojis(true)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator);
        rank.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                message.channel.send(attachment);
            });
    }
    if (command === "mn") {
        let piodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `pio` })
        if (piodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `${ress}` }, { $set: { channelID: newfric, reason: `${ress}` } }, { new: true });

        } else {
            return message.channel.send(`<:cancel1:769230483863109632> **| Tu compte miner avec tes mains ?? Il te faut une pioche**`);


        }
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 60) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 10;
        const n = Math.floor(Math.random() * limit + 1);
        var replys = [
            "patate",
            "carottes",
            "tomate",
            "fraises",
            "bananes",
        ];
        let ress = (replys[Math.floor(Math.random() * replys.length)])
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `${ress}` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `${ress}` }, { $set: { channelID: newfric, reason: `${ress}` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: `${ress}`,
            }).save();

        }

        const embed = new Discord.MessageEmbed()
            .setTitle('<:gloves:767326076174467072> Ramasser')
            .setDescription(`${message.member}, tu a ramassé  **${n}** ${ress}`)
            .setFooter(message.member.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
    if (command === "ra") {
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 60) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 10;
        const n = Math.floor(Math.random() * limit + 1);
        var replys = [
            "patate",
            "carottes",
            "tomate",
            "fraises",
            "bananes",
        ];
        let ress = (replys[Math.floor(Math.random() * replys.length)])
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `${ress}` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `${ress}` }, { $set: { channelID: newfric, reason: `${ress}` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: `${ress}`,
            }).save();

        }

        const embed = new Discord.MessageEmbed()
            .setTitle('<:gloves:767326076174467072> Ramasser')
            .setDescription(`${message.member}, tu a ramassé  **${n}** ${ress}`)
            .setFooter(message.member.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
    if (command === "recolter") {
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 60) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 10;
        const n = Math.floor(Math.random() * limit + 1);
        var replys = [
            "salade",
            "épis de blé",
        ];
        let ress = (replys[Math.floor(Math.random() * replys.length)])
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `${ress}` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `${ress}` }, { $set: { channelID: newfric, reason: `${ress}` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: `${ress}`,
            }).save();

        }

        const embed = new Discord.MessageEmbed()
            .setTitle('<:gloves:767326076174467072> Récolte !')
            .setDescription(`${message.member}, tu a récolté  **${n}** ${ress}`)
            .setFooter(message.member.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }

    if (command === "ch") {
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 60) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 10;
        const n = Math.floor(Math.random() * limit + 1);
        var replys = [
            "Lièvres ! ",
            "Perdrix ! ",
            "Poules ! ",
            "Vaches ! ",

        ];
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `viande` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `viande` }, { $set: { channelID: newfric, reason: `viande` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: 'viande',
            }).save();

        }
        let reponse = (replys[Math.floor(Math.random() * replys.length)])
        const embed = new Discord.MessageEmbed()
            .setTitle('🏹 Chasse')
            .setDescription(`${message.member}, tu a chassé avec succès et tu a attrapé **${n}** ${reponse}`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
    if (command === 'inv') {
        const member = message.mentions.members.last() || message.member;
        let fricdb = await ChannelModel.findOne({ serverID: member.id, reason: `viande` })
        let fric;
        if (fricdb) {
            fric = fricdb.channelID;

        } else {
            fric = "0";
        }
        let boisdb = await ChannelModel.findOne({ serverID: member.id, reason: `bois` })
        let bois;
        if (boisdb) {
            bois = boisdb.channelID;

        } else {
            bois = "0";
        }
        let cudb = await ChannelModel.findOne({ serverID: member.id, reason: `cu` })
        let chm;
        if (cudb) {
            chm = cudb.channelID;

        } else {
            chm = "0";
        }
        let bledb = await ChannelModel.findOne({ serverID: member.id, reason: `épis de blé` })
        let ble;
        if (bledb) {
            ble = bledb.channelID;

        } else {
            ble = "0";
        }
        let carrdb = await ChannelModel.findOne({ serverID: member.id, reason: `carottes` })
        let carr;
        if (carrdb) {
            carr = carrdb.channelID;

        } else {
            carr = "0";
        }
        let patdb = await ChannelModel.findOne({ serverID: member.id, reason: `patate` })
        let pat;
        if (patdb) {
            pat = patdb.channelID;

        } else {
            pat = "0";
        }
        let tomdb = await ChannelModel.findOne({ serverID: member.id, reason: `tomate` })
        let tom;
        if (tomdb) {
            tom = tomdb.channelID;

        } else {
            tom = "0";
        }
        let saldb = await ChannelModel.findOne({ serverID: member.id, reason: `salade` })
        let sal;
        if (saldb) {
            sal = saldb.channelID;

        } else {
            sal = "0";
        }
        let fradb = await ChannelModel.findOne({ serverID: member.id, reason: `fraises` })
        let frai;
        if (fradb) {
            frai = fradb.channelID;

        } else {
            frai = "0";
        }
        let bandb = await ChannelModel.findOne({ serverID: member.id, reason: `bananes` })
        let ban;
        if (bandb) {
            ban = bandb.channelID;

        } else {
            ban = "0";
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Voici l'inventaire de' ${member.user.username}`)


        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))

        .addField('<:meat:767285887888785408> Viande', fric, true)
            .addField('<:wood:767285887230541835> bois', bois, true)
            .addField('<:mushrooms:767285887184666624> champignons', chm, true)
            .addField('<:hum:767285082229833728> Ble', ble, true)
            .addField('<:lettuce:762010573558513665> Salade', sal, true)
            .addField('<:potato:762010573558382613> Patates', pat, true)
            .addField('<:carrot:762010573692600340> Carottes', carr, true)
            .addField('<:tomato:762010573579485234> Tomates', tom, true)
            .addField('<:strawberry:762010573638336522> fraises', frai, true)
            .addField('<:bananas:762010573390872618> bananes', ban, true)

        .setColor('#0099ff')
        message.channel.send(embed);
    }
    if (command === "work") {
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 100) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        limit = 100;
        const n = Math.floor(Math.random() * limit + 1);
        let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `argent` })
        if (biodb) {
            let argent = biodb.channelID;
            let newfric1 = argent + n;
            newfric = math.evaluate(`${argent} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `argent` }, { $set: { channelID: newfric, reason: `argent` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${message.author.id}`,
                channelID: `${n}`,
                reason: 'argent',
            }).save();

        }
        const embed = new Discord.MessageEmbed()
            .setTitle('<:hammer:767069556748976138> Work')
            .setDescription(`${message.member}, tu a travailé avec succès et tu a gagné  **${n}** <:coin:755774010293223565> Mcdollars!`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);


    }
    if (command === "vdaily") {
        let vipdb = await ChannelModel.findOne({ serverID: message.author.id, reason: `vip` })
        if (vipdb) {
            if (!cooldowns.has(command)) {
                cooldowns.set(command, new Discord.Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command);
            const cooldownAmount = (command.cooldown || 10000) * 1000;
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(2)} s avant de pouvoir réutiliser cette commande.**`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            limit = 200;
            const n = Math.floor(Math.random() * limit + 1);
            let biodb = await ChannelModel.findOne({ serverID: message.author.id, reason: `argent` })
            if (biodb) {
                let argent = biodb.channelID;
                let newfric1 = argent + n;
                newfric = math.evaluate(`${argent} + ${n}`);
                const newcbio = await ChannelModel.findOneAndUpdate({ serverID: message.author.id, reason: `argent` }, { $set: { channelID: newfric, reason: `argent` } }, { new: true });

            } else {
                const verynew = new ChannelModel({
                    serverID: `${message.author.id}`,
                    channelID: `${n}`,
                    reason: 'argent',
                }).save();

            }
            const embed = new Discord.MessageEmbed()
                .setTitle('<:vip:769230483547750470> Récompense VIP quotidienne')
                .setDescription(`${message.member}, tu a récupéré ta récompense et tu as gagné : **${n}** <:coin:755774010293223565> Mcdollars!`)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor("#EE7F44");
            message.channel.send(embed);
        } else {
            return message.channel.send(`<:cancel1:769230483863109632> **| Bien essayé mais tu doit etre vip pour faire cette commande**`);

        }



    }

    if (command === "like") {
        const member = message.mentions.members.last();
        if (!member) {
            return message.channel.send(`<:information:769234471236665355> ** | Merci de bien utiliser cette commande : like <user>  !**`);
        }
        if (member.id === message.author.id) return message.channel.send(`<:information:769234471236665355> ** | Tu ne peux liker ton propre profil  !**`);
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command);
        const cooldownAmount = (command.cooldown || 10000) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<:cancel1:769230483863109632> **| Merci d'attendre encore ${timeLeft.toFixed(1)} s avant de pouvoir réutiliser cette commande.**`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        const n = '1';
        let biodb = await ChannelModel.findOne({ serverID: member.id, reason: `like` })
        if (biodb) {
            let likeact = biodb.channelID;
            newfric = math.evaluate(`${likeact} + ${n}`);
            const newcbio = await ChannelModel.findOneAndUpdate({ serverID: member.id, reason: `like` }, { $set: { channelID: newfric, reason: `like` } }, { new: true });

        } else {
            const verynew = new ChannelModel({
                serverID: `${member.id}`,
                channelID: `1`,
                reason: 'like',
            }).save();

        }
        return message.channel.send(`<:checkmark:769230483820773426>** | Tu viens de liker le profil de ${member.user.tag} !**`);
    } else {


    }
    if (command === 'setsuggchannel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setsuggchannel <salon>  !**");
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `suggestion` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `suggestion` }, { $set: { channelID: channel.id, reason: `suggestion` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des suggestions est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'suggestion',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des suggestions est désormais  ${channel}!**`);
        }
    }
    if (command === 'setbio') {

        let bio = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setsuggchannel <salon>  !**");
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `suggestion` })
        if (channeldb) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `suggestion` }, { $set: { channelID: channel.id, reason: `suggestion` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des suggestions est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'suggestion',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon des suggestions est désormais  ${channel}!**`);
        }
    }
    if (command === 'img') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('<:cancel1:769230483863109632> **| Vous devez avoir les permissions d\'administrateur pour exécuter cette commande!')
        let botmessage = args.join(" ");
        message.delete().catch();
        let embed = new Discord.MessageEmbed()
            .setTitle("❯ Image:")
            .setColor("#D50A0A")
            .setURL(args.join(" "))
            .setImage(args.join(" "))
            .setFooter(`Image envoyée par ${message.author.username}.`)
            .setTimestamp()
        message.channel.send({ embed: embed });

        console.log(`Commande ${message.author.lastMessage} executée sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}.`)
        console.log(`Image envoyée par ${message.author.username}: ${args.join(" ")}.`)

    }
    if (command === 'channelinfo') {
        let channel = message.channel || message.mentions.channels.last();
        let typechannel;
        let okay = channel.type;
        if (okay === 'text') {
            typechannel = "Salon Textuel"
        } else {
            if (okay === 'dm') {
                typechannel = 'Salon MP'
            }
            if (okay === 'news') {
                typechannel = 'Salon des annonces'
            }
        }
        let embed = new Discord.MessageEmbed()
            .setColor(0x00AE86)
            .addField('❯ Nom', channel.type === 'dm' ? `@${channel.recipient.username}` : channel.name, true)
            .addField('❯ ID', channel.id, true)
            .addField('❯ NSFW', channel.nsfw ? 'Oui :eyes:' : 'Non', true)
            .addField('❯ Categorie', channel.parent ? channel.parent.name : 'Non', true)
            .addField('❯ Type', typechannel, true)
            .addField('❯ Date de création', channel.createdAt, true)
            .addField('❯ Topic', channel.topic || 'Aucun', true)
            .setTimestamp()
        message.channel.send(embed);

    }
    if (command === 'setwelcomemsg') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = args.slice(0).join(` `);
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setwelcomemsg <message>  !**");
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `welcomemsg` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `welcomemsg` }, { $set: { channelID: channel, reason: `welcomemsg` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le message d'accueil a été mis à jour avec succès !**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel}`,
                reason: 'welcomemsg',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le message d'accueil a enregistré avec succès !**`);
        }

    }
    if (command === 'unsetwelcomemsg') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `welcomemsg` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `welcomemsg` });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le message d'accueil a supprimé avec succès !**`);
        } else {
            return message.channel.send(`<:cancel1:769230483863109632>** | Vous devez avoir une configuration pour la supprimer!**`);


        }

    }
    if (command === 'setwelcomechannel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setwelcomechannel <salon>  !**");
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `welcome` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { channelID: channel.id, reason: `welcome` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon d'accueil est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'welcome',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon d'accueil est désormais  ${channel}!**`);
        }

    }
    if (command == "unsetwelcomechannel") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `welcome` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `welcome` });
            return message.channel.send(`<:checkmark:769230483820773426> **| Le bot n'envoiera plus de message d'accueil!**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Vous devez avoir une configuration pour la supprimer!**')
        }
    }
    if (command == "unsetlevel") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `level` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `level` });
            return message.channel.send(`<:checkmark:769230483820773426> **| LLes niveaux sont désormais désactivés !!**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Vous devez avoir une configuration pour la supprimer!**')
        }
    }
    if (command === 'setleavechannel') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("<:information:769234471236665355> |  ** Merci de bien utiliser cette commande : setleavechannel <salon>  !**");
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `leave` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `leave` }, { $set: { channelID: channel.id, reason: `leave` } }, { new: true });
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon de départ est désormais  ${channel}!**`);
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'leave',
            }).save();
            return message.channel.send(`<:checkmark:769230483820773426>** | Le salon de départ est désormais  ${channel}!**`);
        }

    }
    if (command == "unsetleavechannel") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `leave` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `leave` });
            return message.channel.send(`<:checkmark:769230483820773426> **| Le bot n'envoiera plus de message de départ!**`);
        } else {
            return message.channel.send('**<:cancel1:769230483863109632> | Vous devez avoir une configuration pour la supprimer!**')
        }
    }


    if (command === 'staff') {
        if (args[0] == "help") {
            message.reply("**Usage: `l.staff <raison> `**");
            return;
        }
        let reason = args.slice(0).join(' ');
        let target = message.author;
        let approvedEmbed = new Discord.MessageEmbed()
            .setTitle("Demande de rejoindre le staff")
            .setThumbnail(target.displayAvatarURL)
            .addField("<a:fleche:758391101148889109> Message", `${target}#${target.discriminator} souhaite être un membre du staff !`)
            .addField("<a:fleche:758391101148889109> Raison :", reason)

        .setFooter(`Demandé par ${message.author.username}.`)
            .setTimestamp()
        const approvedchannel = message.guild.channels.cache.find(ch => ch.id === '757277737588228126');
        if (!approvedchannel) return message.channel.send("Impossible de trouver le salon staff.");
        message.channel.send(`${target} Ta demande a bien été prise en compte, merci de patienter qu'un membre du STAFF vous approuve !`)
        approvedchannel.send(approvedEmbed);
        console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)
        console.log(`Le membre ${message.author.username} souhaite être Approuvé.`)
    }
    if (command === 'mute') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.mute <user> <raison> `**");
            return;
        }
        if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send('<:cancel1:769230483863109632> **| Vous n\'avez pas la permission `MANAGE_ROLES`**')
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `leave` })
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("<:cancel1:769230483863109632> | **Merci de mentioner un utlisateur **");
        if (member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("<:cancel1:769230483863109632> | **Mute une personne qui a la permission \`ADMINISTRATEUR\` n'aura aucun effet ! **");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Aucunne raison donnée";
        member.send(`:mute:  Vous avez été muté sur le serveur **${message.guild.name}** pour la raison : **${reason}**`);
        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!role) {
            try {
                role = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "#000000",
                        permissions: []
                    }
                });

                message.guild.channels.cache.forEach(async(channel, id) => {
                    await channel.createOverwrite(role, {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        READ_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        member.roles.add(role)
        const paul = new Discord.MessageEmbed()
            .setTitle('Muted !')
            .setDescription('Il y a des moments où il faut mieux se taire ;-)')
            .setThumbnail(url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQGgi2B4_K4KYQ4B_sCaH_GWP1tiTxoXA0hAw&usqp=CAU')
            .addFields({ name: 'Modérateur', value: `${message.author.tag}` }, { name: 'menbre muté', value: `${member.user.tag}` }, { name: 'raison', value: `${reason}` });
        message.channel.send(paul);
    }
    if (command === 'unmute') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.unmute <user>  `**");
            return;
        }
        if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send('<:cancel1:769230483863109632> **| Vous devez avoir les permissions MANAGE_ROLES pour exécuter cette commande!')
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : unmute <user>  !** ");
        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!role) {
            message.channel.send("<:information:769234471236665355> ** | Cette personne n'est pas mute ** ");
        }
        if (!member.roles.cache.has(`${role.id}`)) {
            message.channel.send("<:information:769234471236665355> ** | Cette personne n'est pas mute **");
        } else {

            member.roles.remove(role)
            message.channel.send(" <:checkmark:769230483820773426> | **L'utilisateur a bien été unmute ! **")

        }
    }
    if (command === "ticket-close") {

        if (!message.channel.name.startsWith(`ticket-`)) return;

        if (message.author.id === db.get(`ticket.${message.channel.name}.user`)) {


            let embed2 = new Discord.MessageEmbed()
                .setColor('#90EE90')
                .setTitle(`🎟️ | Ticket Terminé`)

            .setDescription(`Réagissez avec \\🗑️ pour fermer le ticket ou ne réagissez pas si vous avez d'autres demandes.`);

            message.channel.send(embed2).then(m => m.react(`🗑️`));
        } else {

            if (args[0] === "force") {

                let embed1 = new Discord.MessageEmbed()
                    .setAuthor(`📥 | Ticket Fermé`)
                    .setColor('#90EE90')

                .setDescription(`\`${message.author.tag}\` a forcé la fermeture de votre ticket.`);
                db.delete(`ticket.${message.channel.name}`);

                if (client.users.cache.get(db.get(`ticket.${message.channel.name}.user`))) client.users.cache.get(db.get(`ticket.${message.channel.name}.user`)).send(embed1).catch(e => { console.log(e) })
                message.channel.delete();


            } else {

                let embed2 = new Discord.MessageEmbed()
                    .setColor('#90EE90')
                    .setTitle(`🎟️ | Ticket Terminé`)

                .setDescription(`Réagissez avec \\🗑️ pour fermer le ticket ou ne réagissez pas si vous avez d'autres demandes.`);

                message.channel.send(embed2).then(m => m.react(`🗑️`));
            }

        }
    }
    if (command === 'ticket-new') {
        const name = `ticket de ${message.author.tag} `;
        message.guild.channels.create(name, { type: "text" }).then(
            (chan) => {
                const paul = new Discord.MessageEmbed()
                    .setTitle('Ticket crée avec succès !')
                    .setDescription(`Bonjour ${message.author.tag} , te voici sur ton ticket ! tu peux poser une question au staff. Réagis avec 🔒 pour fermer le ticket !`)
                    .setColor('#90EE90')
                    .setFooter(`par : ${message.author.tag}`)
                chan.send(paul).then(() => message.react('✖'));
                const filter = (message, reaction, user) => {
                    return ['✅', '✖'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {
                            message.reply('Arrêt en cours...');
                            client.destroy(config.token);
                        } else {
                            message.reply('Opération annulée.');
                        }
                    })
                    .catch(collected => {
                        message.reply('Aucune réponse après 30s , anulation');
                    });


                chan.createOverwrite(message.guild.id, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false
                })
                chan.createOverwrite(message.author.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                })


            });

        message.channel.send(`** <:checkmark:769230483820773426> | ${message.author.tag} , Ton ticket a été crée avec succès !**`)
    }
    if (command === 'ticket-send') {

        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nEnvoye un embed qui permet de créer un ticket\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.adm);
        }

        if (message && message.deletable) message.delete().catch(e => {});

        let embed = new Discord.MessageEmbed()
            .setTitle(`🎫 | Système de Tickets`)
            .setColor("#2f3136")

        .setDescription(`Bonjour , pour créer un ticket il suffit de réagir avec 🎫 !`);
        message.channel.send(embed).then(m => {
            m.react('🎫');
        });

    }
    if (command === 'bug') {
        const usage = " <channel>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de report un bug à notre équipe\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }


        let report = args.slice().join(" ");
        if (!report) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : bug  <description> !**");
        const bug = client.channels.cache.find(ch => ch.id === '757278387038322778');
        const embed = new Discord.MessageEmbed()
            .setTitle('Rapport de bug')
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(`
          Rapport de bogue envoyé avec succès!
          Veuillez rejoindre le serveur [Light support](https://discord.gg/X6jZrUf) pour discuter davantage de votre problème.
         
        `)
            .addField('Membre', message.author, true)
            .addField('Message', report)
            .setColor('#303136')
            .setFooter("© 2020 - Light bot")
            .setTimestamp()

        message.channel.send(embed);
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle('Rapport de bugs')
            .setThumbnail(bug.guild.iconURL({ dynamic: true }))
            .setDescription(report)
            .addField('Membre', message.member, true)
            .addField('Serveur', message.guild.name, true)
            .setFooter("© 2020 - Light bot")
            .setTimestamp()
            .setColor("#2f3136");
        bug.send(reportEmbed);


        //  member.removeRole(role).catch(console.error);


    }

    if (command === 'maj') {
        const usage = " <nom> <description>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de publier une mise à jour\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nBOT OWNER\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656') return message.channel.send("<:information:769234471236665355> ** | Seulement 𝖕𝖆𝖚𝖑𝖉𝖇09#9846 , Universe tech et {MC}Matheroli🌌#0001 peuvent utliser cette commande !**");
        if (message.guild.id !== '765899951443279922') return message.channel.send("<:information:769234471236665355> ** | Vous devez etre sur le support pour faire cette commande !**");
        let nom = args[0];
        let des = args.slice(1).join(" ");
        if (!des) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : maj <nom> <objet> !**");
        if (!nom) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : maj <nom> <objet> !**");
        message.channel.send(`<:checkmark:769230483820773426> | **mise à jour envoyée avec succès**`);
        const channelp = client.channels.cache.find(ch => ch.id === '757261561403539596');
        const paul = new Discord.MessageEmbed()

        .setTitle('💡 Mise à jour !')
            .setDescription("Une nouvelle modification a été apportée au bot !!")
            .setColor('#90EE90')
            .addFields({ name: 'Nom ', value: nom })
            .addFields({ name: 'Description', value: des })
            .setFooter(`par : ${message.author.tag}`)
        channelp.send(paul).then(i => i.react("🆗"))


        //  member.removeRole(role).catch(console.error);


    }
    if (command === 'newcmd') {
        const usage = " <nom> <description>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de publier une commande\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nBOT OWNER\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (message.author.id !== '688402229245509844' && message.author.id !== '535826562403270656') return message.channel.send("<:information:769234471236665355> ** | Seulement 𝖕𝖆𝖚𝖑𝖉𝖇09#9846 , Universe tech et {MC}Matheroli🌌#0001 peuvent utliser cette commande !**");
        if (message.guild.id !== '765899951443279922') return message.channel.send("<:information:769234471236665355> ** | Vous devez etre sur le support pour faire cette commande !**");
        let nom = args[0];
        let des = args.slice(1).join(" ");
        if (!des) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : newcmd <nom> <objet> !**");
        if (!nom) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : newcmd <nom> <objet> !**");
        message.channel.send(`<:checkmark:769230483820773426> | **commande envoyée avec succès**`);
        const channelp = client.channels.cache.find(ch => ch.id === '757261561403539596');
        const paul = new Discord.MessageEmbed()

        .setTitle('💡 Nouvelle commande !')
            .setDescription("une nouvelle commande a été crée !!")
            .setColor('#90EE90')
            .addFields({ name: 'Nom ', value: nom })
            .addFields({ name: 'Description', value: des })
            .setFooter(`par : ${message.author.tag}`)
        channelp.send(paul).then(i => i.react("🆗"))


        //  member.removeRole(role).catch(console.error);


    }

    if (command === 'vote') {

        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nDonne un lien pour voter pour le bot\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        const paul = new Discord.MessageEmbed()

        .setTitle('Vote pour  moi !')
            .setDescription(`Pour voter le bot clique [ici](https://top.gg/bot/756827233032732753/vote), merci beaucoup , cela nous fait très plaisir  !`)

        .setThumbnail(url = client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter("© 2020 - Light bot")
            .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(paul).then(i => i.react("🆗"))





    }
    if (command === 'invite') {

        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nDonne un lien pour inviter le bot\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        const paul = new Discord.MessageEmbed()

        .setTitle('Invite moi !')
            .setDescription(`Pour inviter le bot clique [ici](https://discord.com/oauth2/authorize?client_id=756827233032732753&scope=bot&permissions=8), il va révolutionner ton serveur et il est simple à configurer !`)

        .setThumbnail(url = client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter("© 2020 - Light bot")
            .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(paul).then(i => i.react("🆗"))





    }
    if (command === 'botstatus') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.botstatus `**");
            return;
        }
        const botstatus = ['Online', 'Idle', 'Do Not Disturb', 'Invisable'];
        const embed = new Discord.MessageEmbed()
            .addField("Statut du bot: ", `✔ en ligne`);
        message.channel.send(embed)
    }

    if (command === 'choisit') {
        const usage = " <choix1> <choix2>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de faire choisir le bot entre deux choix\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        const choice1 = args[0]
        const choice2 = args.slice(1).join(" ")
        if (choice2 < 1) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : choisit <choix1> <choit2> !**")
        var choices = [`${choice1}`, `${choice2}`]
        message.channel.send(`**Je choisit............ ${choices[Math.floor(Math.random() * choices.length)]} !**`);
    }
    if (command === 'pourcent') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.pourcent <pourcent> <nombre> `**");
            return;
        }
        const amount = args[0]
        const maximum = args[1]
        if (!amount) return message.channel.send('<:information:769234471236665355> ** | Merci de bien utiliser cette commande : pourcent <pourcent> <nombre> !**')
        if (!maximum) return message.channel.send('<:information:769234471236665355> ** | Merci de bien utiliser cette commande : pourcent <pourcent> <nombre> !**')
        const percentage = (amount / maximum) * 100;
        const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .setDescription(`**${amount}** est  **${percentage}%** de **${maximum}**.`);
        message.channel.send({ embed })

    }
    if (command === 'config') {

        const paul = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor('#303136')
            .setTitle('<:equalizer:764791355334459392> Configurer le bot Light')
            .addFields({ name: '⚙ Configurer', value: '`setwelcomechannel` , `setautorole` , `setleavechannel` , `setlogschannel` ,`setsuggchannel`,`setlevel`,`antiraid`,`setprefix`,`setannchannel`,`setwelcomemsg`' })
            .addFields({ name: '🔥 Déconfigurer', value: '`unsetwelcomechannel` , `unsetautorole` , `unsetleavechannel` ,`unsetlogschannel`, `unsetsuggchannel`,`unsetlevel`,`resetprefix`,`unsetannchannel`,`unsetwelcomemsg`' })
        message.channel.send(paul);
    }
    if (command === 'servericon') {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Icone de ${message.guild.name}`)
            .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
    if (command === 'compliments') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.compliments <user> `**");
            return;
        }
        message.delete().catch(O_o => {});
        let user = message.mentions.users.first();
        if (message.mentions.users === message.author.username) return message.reply('<:info:752235698186092665> ** | Raté ! tu ne peux pas te complimenter toi meme');
        if (message.mentions.users.size < 1) return message.reply('<:info:752235698186092665> ** | Merci de bien utiliser cette commande : compliments <user> !**')
        var roast = [
            "Votre sourire est contagieux.",
            "Tu es superbe aujourd'hui.",
            "Vous êtes un cookie intelligent.",
            "Je parie que vous faites sourire les bébés.",
            "Vous avez des manières impeccables.",
            "J'aime ton style.",
            "Vous avez le meilleur rire.",
            "Je t'apprécie.",
            "Vous êtes le plus parfait qui soit.",
            "Tu es assez.",
            "Vous êtes fort.",
            "Votre point de vue est rafraîchissant.",
            "Vous êtes un ami formidable.",
            "Vous illuminez la pièce.",
            "Tu brilles plus qu'une étoile filante.",
            "Vous méritez un câlin maintenant.",
            "Tu devrais être fier de toi.",
            "Vous êtes plus utile que vous ne le pensez.",
            "Vous avez un excellent sens de l'humour.",
            "Vous avez tous les bons coups!",
            "Votre gentillesse est un baume pour tous ceux qui la rencontrent.",
            "Vous êtes tout cela et un sac de chips de très grande taille.",
            "Sur une échelle de 1 à 10, vous êtes à 11.",
            "Tu es courageux."
        ]
        const roasts = roast[Math.floor(Math.random() * roast.length)];
        const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .setDescription(user.username + ", " + roasts);
        message.channel.send({ embed })
    }
    if (command === 'credits') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.credits `**");
            return;
        }
        const embed = new Discord.MessageEmbed()
            .setColor('#303136')
            .addField("Developeurs", "<@688402229245509844>, <@721724837986566246>, <@535826562403270656>")
            .addField("Merci à :", `<@717744252687482880> ,<@698143932697018470> , <@757309249440186460>`)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.channel.send({ embed })
    }
    if (command === 'embed') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.embed <texte> `**");
            return;
        }
        const word = args.join(" ")
        if (word < 1) return message.channel.send("Merci de mettre le texte à mettre")
        message.delete().catch(O_o => {});
        const embed = new Discord.MessageEmbed()
            .setDescription(word)
            .setColor(0x00A2E8);
        message.channel.send({ embed });
    }
    if (command == "setautorole") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let role = message.mentions.roles.last() || message.guild.roles.cache.get(args[0]);
        let usage = "<role>";
        if (!role) {
            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
        }

        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `autorole` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, reason: `autorole` }, { $set: { channelID: role.id, reason: `autorole` } }, { new: true });
            return message.channel.send(`**<:checkmark:769230483820773426> |Le rôle ${role.name} sera attribué aux nouveaux membres!**`)
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${role.id}`,
                reason: 'autorole',
            }).save();
            return message.channel.send(`**<:checkmark:769230483820773426> |Le rôle ${role.name} sera attribué aux nouveaux membres!**`)
        }


    };
    if (command == "unsetautorole") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const verify = await ChannelModel.findOne({ serverID: message.guild.id, reason: `autorole` })
        if (verify) {
            const newchannel = await ChannelModel.findOneAndDelete({ serverID: message.guild.id, reason: `autorole` });
            return message.channel.send(`** <:checkmark:769230483820773426> | Le système d'autorole est supprimé**`)
        } else {
            return message.channel.send(`** <:cancel1:769230483863109632> | Veuillez ajouter une configuration afin de la supprimer**`)
        }


    };
    if (command === 'eval') {
        if (message.guild.id !== '765899951443279922') {
            return message.channel.send("<:cancel1:769230483863109632> **| Pourquoi tu fait ça... Je suis sécurisé** ");
        }
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.eval <fonction> `**");
            return;
        }
        try {
            var code = args.join(" ");
            if (code === "client.token") return message.channel.send("Nope , t'aura pas le token")
            if (code === "config.token") return message.channel.send("Nope , t'aura pas le token")
            var evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            const embed = new Discord.MessageEmbed()
                .setColor(0x00A2E8)
                .addField(":inbox_tray: Entrée: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: Sortie: ", `\`\`\`js\n${clean(evaled)}\n\`\`\``)
            message.channel.send({ embed })
        } catch (err) {
            const embed = new Discord.MessageEmbed()
                .setColor(0x00A2E8)
                .addField(":inbox_tray: Entée: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: Sortie: ", `\`\`\`${clean(err)}\`\`\``)
            message.channel.send({ embed })
        }

        function clean(text) {
            if (typeof(text) === 'string')
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            else
                return text;
        }
    }
    if (command === 'uptime') {
        let days = 0;
        let week = 0;
        let uptime = ``;
        let totalSeconds = (client.uptime / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        if (hours > 23) {
            days = days + 1;
            hours = 0;
        }

        if (days == 7) {
            days = 0;
            week = week + 1;
        }

        if (week > 0) {
            uptime += `${week} semaines, `;
        }

        if (minutes > 60) {
            minutes = 0;
        }

        uptime += `${days} jours, ${hours} heures, ${minutes} minutes et ${seconds} secondes`;

        let serverembed = new Discord.MessageEmbed()
            .setColor("#228B22")
            .addField('Le bot est en ligne depuis :', uptime);

        message.channel.send(serverembed);
    }
    if (command === 'rr') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.rr `**");
            return;
        }
        var roulette = [':gun: Pow! Vous etes mort , Souhaitez-vous tester à nouveau votre chance ?', ':gun: Heureusement pour vous, vous avez survécu! Souhaitez-vous tester à nouveau votre chance ?', ':gun:  il n\'a pas tiré! Ou est-ce une bonne chose? (Réessayer)'];
        message.channel.send(roulette[Math.floor(Math.random() * roulette.length)]);
    }
    if (command === 'support') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.support `**");
            return;
        }
        const paul = new Discord.MessageEmbed()

        .setTitle('Rejoins le support !')
            .setDescription(`rejoindre le support avec un role temporaire [ici](https://discord.gg/X6jZrUf)
                             rejoindre le support normalement [ici](https://discord.gg/X6jZrUf)
                             
                            `)
            .setColor('#90EE90')
            .setThumbnail(url = 'https://cdn.discordapp.com/avatars/756827233032732753/775e585d0cc6242263c533526b74838d.png')
            .setFooter(`par : ${message.author.tag}`)
        message.channel.send(paul).then(i => i.react("🆗"))


        //  member.removeRole(role).catch(console.error);


    }
    if (command === 'v') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.v `**");
            return;
        }
        const paul = new Discord.MessageEmbed()

        .setTitle('🤖 | version 1.3')
            .setDescription('le bot est actuellement en version `1.3`')
            .setColor('#90EE90')
            .setThumbnail(url = 'https://cdn.discordapp.com/avatars/756827233032732753/775e585d0cc6242263c533526b74838d.png')
            .setFooter(`par : ${message.author.tag}`)
        message.channel.send(paul).then(i => i.react("🆗"))


        //  member.removeRole(role).catch(console.error);


    }
    if (command === 'spotify') {
        const user = message.mentions.users.first() || message.author;
        if (user.presence.game !== null && user.presence.game.type === 2 && user.presence.game.name === "Spotify") {
            const trackIMG = user.presence.game.assets.largeImageURL;
            const trackURL = `https://open.spotify.com/track/${user.presence.game.syncID}`;
            const trackName = user.presence.game.details;
            const trackAuthor = user.presence.game.state;
            const trackAlbum = user.presence.game.assets.largeText;
            let embed = Discord.MessageEmbed()
                .setAuthor("Spotify Musique Infos", "https://i.imgur.com/2klysCl.png")
                .setColor("#1ED760")
                .setThumbnail(trackIMG)
                .addField("Musique", trackName)
                .addField("Album", trackAlbum, true)
                .addField("Artiste(s)", trackAuthor)
                .addField("Ecouter cette musique:", `[\`${trackURL}\`](trackURL)`)
                .setFooter(`Demandé par ${message.author.username}`)
                .setTimestamp()
            message.channel.send({ embed: embed });

        } else {
            message.channel.send("Vous n'écoutez rien actuellement sur Spotify!");
        }

        console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)


    }
    if (command === 'avatar') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.avatar <user>`**");
            return;
        }
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()

            .setTitle(`Votre avatar`)

            .setColor('#90EE90')
                .setImage(url = message.author.displayAvatarURL({ dynamic: true }))
                .setFooter(`par : ${message.author.tag}`)
            message.channel.send(embed)


        }
        const avatarList = message.mentions.users.map(user => {
            const embed = new Discord.MessageEmbed()

            .setTitle(`Avatar de ${user.tag}`)

            .setColor('#90EE90')
                .setImage(url = user.displayAvatarURL({ dynamic: true }))
                .setFooter(`par : ${message.author.tag}`)
            message.channel.send(embed)

        });


    }
    if (command === 'ann') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let reason = args.join(" ");
        if (!reason) return message.channel.send("<:information:769234471236665355> ** | Merci de bien utiliser cette commande : sugg <suggestion> !**");

        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `ann` })
        if (!channeldb) return message.channel.send('<:cancel1:769230483863109632> |  ** le système d\'annonces n\'est pas activé sur ce serveur  !**')
        else {
            message.channel.send(`<:checkmark:769230483820773426> **Annonce envoyée avec succès**`);

            const paul = new Discord.MessageEmbed()
                .setTitle('📢 Annonce !')
                .setDescription(`@everyone , 
            ${reason}`)
                .setColor("RANDOM")
                .setFooter(`par : ${message.author.tag}`)
            let sugg = message.guild.channels.cache.get(channeldb.channelID)
            sugg.send(paul).then(function(message) {
                message.react('✅');
                message.react('❌');
            })
        }
    }
    if (command === 'cat') {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('🐱 Voici un chat')
            .setImage(file)
        message.channel.send(doneEmbed);
    }
    if (command === 'panda') {
        const { link } = await fetch('https://some-random-api.ml/img/panda').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('🐼 Voici un panda')
            .setImage(link)
        message.channel.send(doneEmbed);
    }
    if (command === 'nasa') {
        const { hdurl } = await fetch('https://api.nasa.gov/planetary/apod?api_key=WHsJtJDvvS8GOaYdXMhKVkqN9Tr1xPkFLGnF4uo5').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('Voici la photo du jour de la nasa')
            .setImage(hdurl)
        message.channel.send(doneEmbed);
    }
    if (command === 'oiseau') {
        const { link } = await fetch('https://some-random-api.ml/img/birb').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('🐦 Voici un oiseau')
            .setImage(link)
        message.channel.send(doneEmbed);
    }
    if (command === 'rpanda ') {
        const { link } = await fetch('https://some-random-api.ml/img/red_panda').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('🐼  Voici un panda rouge')
            .setImage(link)
        message.channel.send(doneEmbed);
    }
    if (command === 'koala') {
        const { link } = await fetch('https://some-random-api.ml/img/koala').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('🐨 Voici un koala')
            .setImage(link)
        message.channel.send(doneEmbed);
    }
    if (command === 'renard') {
        const { link } = await fetch('https://some-random-api.ml/img/fox').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle('🦊 Voici un renard')
            .setImage(link)
        message.channel.send(doneEmbed);
    }
    if (command === "dog") {
        const { url } = await fetch('https://random.dog/woof.json').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('#e3dcd3')
            .setTitle(':dog: Voici un chien')
            .setImage(url)
        message.channel.send(doneEmbed);
    }
    if (command === "roleinfo") {
        const role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.find((role) => role.id === args[0]);

        if (!role) return message.channel.send(`<:cancel1:769230483863109632> **| impossible de trouver ce rôle...**`);
        const rolePermissions = role.permissions.toArray();
        const finalPermissions = [];
        for (const permission in permissions) {
            if (rolePermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
            else finalPermissions.push(`- ${permissions[permission]}`);
        }

        const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

        const name = role.name;
        const id = role.id;
        const color = role.color;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Nom du role **${name}**`)
            .setColor(color)

        .addField("**Id du role**", id)

        .addField('Position', position, true)
            .addField('Mentionnable', `\`${role.mentionable}\``, true)
            .addField('Rôle du bot', `\`${role.managed}\``, true)
            .addField('Color', `\`${role.hexColor.toUpperCase()}\``, true)
            .addField('Membres', `\`${role.members.size}\``, true)
            .addField('Hoisted', `\`${role.hoist}\``, true)
            .addField('Créé le', `\`${moment(role.createdAt).format('DD/MM/YYYY')}\``, true)
            .addField('Permissions', `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
            .setTimestamp()
            .setFooter(message.author.username);

        message.channel.send(embed);

    }


    if (command === "giverole") {

        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send(ldb.ADM);
        } else {

            let rMember = message.mentions.members.first();
            if (!rMember) message.channel.send('**<:cancel1:769230483863109632> | Mentionnez un utilisateur puis mentionnez le rôle souhaité !**')
            let { cache } = message.guild.roles;
            let role = message.mentions.roles.last();
            if (!role) return message.channel.send('**<:cancel1:769230483863109632> | Mentionnez le rôle que vous vouliez ajouter à l\'utilisateur concerné!**')
            if (role) {
                if (rMember.roles.cache.has(role.id)) {
                    message.channel.send(`**<:cancel1:769230483863109632> | ${rMember.user.tag} a déjà le rôle ${role.name}**`)
                } else {
                    const confirm = await message.channel.send(`**<:checkmark:769230483820773426> | Le membre ${rMember.user.tag} a recu le rôle ${role.name}!**`)
                    rMember.roles.add(role).catch((e) => {
                        confirm.delete();
                        return message.channel.send(`<:cancel1:769230483863109632> **| Je n'ai pas les permissions pour effectuer cette action**`)
                    })
                }
            } else {
                message.channel.send('**<:cancel1:769230483863109632> | Ce rôle est invalide**')
            }
        }




    }
    if (command === "removerole") {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send(ldb.ADM);
        } else {
            try {
                let rMember = message.mentions.members.first();
                if (!rMember) message.channel.send('**<:cancel1:769230483863109632> | Mentionnez un utilisateur puis mentionnez le rôle souhaité !**')
                let { cache } = message.guild.roles;
                let role = message.mentions.roles.last();
                if (!role) return message.channel.send('**<:cancel1:769230483863109632> | Mentionnez le rôle que vous vouliez supprimer des rôles de l\'utilisateur concerné!**')
                if (role) {
                    if (rMember.roles.cache.has(role.id)) {
                        rMember.roles.remove(role)
                            .then(member => message.channel.send(`**<:checkmark:769230483820773426> | Le membre ${rMember.user.tag} n'a plus le rôle ${role.name}!**`))
                    } else {
                        message.channel.send(`**<:cancel1:769230483863109632> |  ${rMember.user.tag} n\'a pas le rôle ${role.name}**`)
                    }
                } else {
                    message.channel.send('**<:cancel1:769230483863109632> | Ce rôle est invalide**')
                }
            } catch (e) {

                message.channel.send('**<:cancel1:769230483863109632> | Vous devez mentionner un utilisateur puis le rôle, et non pas le contraire!**')
            }
        }
    }
    if (command === "roll") {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.roll <nb de faces du dé> `**");
            return;
        }
        let limit = args[0];
        if (!limit) limit = 6;
        const n = Math.floor(Math.random() * limit + 1);
        if (!n || limit <= 0)
            return this.sendErrorMessage(message, 0, '<:info:752235698186092665> ** | Merci de bien utiliser cette commande : roll <nb de faces du dé> !**');
        const embed = new Discord.MessageEmbed()
            .setTitle('🎲 Les dés sonts jetés  🎲')
            .setDescription(`${message.member}, le dé tombe sur.... **${n}**!`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
    if (command === "serveremoji") {

        let roleList = message.guild.emojis.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(",");
        if (roleList.length > 1024) roleList = "<:cancel1:769230483863109632> | **Trop d'emojis' à afficher**";
        if (!roleList) return message.channel.send('<:cancel1:769230483863109632> **| Ce serveur n\'a pas d\'émojis ');
        const embed = new Discord.MessageEmbed()
            .setTitle(`Liste des Emojis`)
            .setColor('#303136')
            .addField("Liste des emojis", roleList)
        message.channel.send(embed)

    }
    if (command === "metamorphe") {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.metamorphe <user> `**");
            return;
        }
        var replys = [
            "En Chien ! :dog:",
            "En Chat ! :cat:",
            "En Poulet ! :chicken:",
            "En Vache ! :cow:",
            "En Lapin ! :rabbit:",
            "En Cochon ! :pig:",
            "En Licorne ! :unicorn:",
            "En Poisson ! :fish:",
            "En Araignée ! :spider:",
            "En Tortue ! :turtle:",
            "En Escargot ! :snail:",
            "En Eléphant ! :elephant:",
            "En Cerf ! :deer:",
            "En Crocodile ! :crocodile:",
            "En Dindon ! :turkey:",
            "En Gorille ! :gorilla:",
        ];

        let reponse = (replys[Math.floor(Math.random() * replys.length)])
        let target = message.mentions.users.first() || message.author;
        let embed = new Discord.MessageEmbed()
            .setTitle("Métamorphe")
            .setColor("#F7BA2A")
            .addField("Le membre", `${target}#${target.discriminator}`)
            .addField("A été métamorphosé...", reponse)
            .setFooter(`Demandé par ${message.author.username}`)
            .setTimestamp()
        message.channel.send({ embed: embed });
        message.delete().catch();

        console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)


    }
    if (command === "serverole") {
        let roleList = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(",");
        if (roleList.length > 1024) roleList = "<:cancel1:769230483863109632> | **Trop de rôles à afficher**";
        if (!roleList) return message.channel.send('<:cancel1:769230483863109632> **| Il n\'y a aucun role sur ce serveur ');
        const embed = new Discord.MessageEmbed()
            .setTitle(`Liste des roles`)
            .setColor('#303136')
            .addField("Liste des roles", roleList)
        message.channel.send(embed)
    }

    if (command === "pfc") {
        const rps = ['ciseaux', 'pierre', 'feuille'];
        const res = ['Ciseaux :v:', 'Pierre :fist:', 'Feuille :raised_hand:'];
        let userChoice;
        let usage = "ciseaux, pierre, feuille";
        if (args.length) userChoice = args[0].toLowerCase();
        if (!rps.includes(userChoice))


            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);

        userChoice = rps.indexOf(userChoice);
        const botChoice = Math.floor(Math.random() * 3);
        let result;
        if (userChoice === botChoice) result = 'C\'est un match nul!';
        else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = '**Light** gagne !';
        else result = `**${message.member.displayName}** gagne !`;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.member.displayName} vs. Light`)
            .addField('Votre choix:', res[userChoice], true)
            .addField('Le choix de Light', res[botChoice], true)
            .addField('Résultat', result, true)
            .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(embed);
    }
    if (command === "coinflip") {
        const n = Math.floor(Math.random() * 2);
        let result;
        if (n === 1) result = 'Face';
        else result = 'Pile';
        const embed = new Discord.MessageEmbed()
            .setTitle('½  Lance une pièce  ½')
            .setDescription(`J'ai lancé une pièce pour toi, ${message.member}. C'était **${result}**!`)

        .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(embed);
    }
    if (command === 'lockchannel') {
        if (!client.lockit) client.lockit = [];
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return msg.reply("<:cancel1:769230483863109632> | Vous n'avez pas la permission `MANAGE_CHANNELS`");
        message.channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: false
        }).then(g => {
            g.edit({
                name: ' 🔒' + g.name
            })
            g.send(`🔒 | Le salon a été bloqué par ${message.author}`)
        })
    }
    if (command === "envers") {
        const text = args.join(' ')
        if (!text) return message.channel.send('<:information:769234471236665355> | **Merci de bien utiliser cette commande : envers <text> !**').catch(console.error);
        const converted = text.split('').reverse().join('');
        message.channel.send(`\u180E${converted}`);
    }
    if (command === 'rename') {
        let newname = args.slice(1).join(' ');
        let user;
        let mention = message.mentions.users.first();
        if (!mention) {
            user = message.guilds.members.get(args[0])
            if (!user) return message.reply('<:information:769234471236665355> ** | Merci de bien utiliser cette commande : rename <user> <pseudo> !**').catch(console.error);
        } else {
            user = message.guild.member(mention)
        }
        if (user.id === "242263403001937920" && message.author.id !== "242263403001937920") return message.reply("You can't rename my Developer:wink:");
        user.setNickname(newname).catch(e => {
            if (e) return message.channel.send(`Erreur: \`\`\`${e}\`\`\``)
        });
        message.channel.send("<:checkmark:769230483820773426>** | Action effectuée avec succès**");
    }
    if (command === 'membercount') {
        const guild = client.guilds.cache.get(args[0]) || message.guild;
        const members = guild.members.cache;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${guild.name} Compteur de membres`)
            .setColor('#303136')
            .setFooter(`Demandé par ${message.author.tag} `)
            .setTimestamp()
            .addFields({ name: 'Humains', value: `\`\`\`${members.filter(member => !member.user.bot).size}\`\`\``, inline: true }, { name: 'Bots', value: `\`\`\`${members.filter(member => member.user.bot).size}\`\`\``, inline: true }, { name: 'Membres au total', value: `\`\`\`${guild.memberCount}\`\`\`` }, { name: '\u200b', value: '**Présence**' }, { name: 'En ligne', value: `\`\`\`${members.filter(member => member.presence.status === 'online').size}\`\`\``, inline: true }, { name: 'Inactif', value: `\`\`\`${members.filter(member => member.presence.status === 'idle').size}\`\`\``, inline: true }, { name: 'Ne pas déranger', value: `\`\`\`${members.filter(member => member.presence.status === 'dnd').size}\`\`\``, inline: true }, { name: 'Hors ligne', value: `\`\`\`${members.filter(member => member.presence.status === 'offline').size}\`\`\``, inline: true }, );
        message.channel.send(embed);
    }
    if (command === 'unlockchannel') {
        if (!client.lockit) client.lockit = [];
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return msg.reply("<:cancel1:769230483863109632> | Vous n'avez pas la permission `MANAGE_CHANNELS`");

        message.channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: null
        }).then(g => {
            g.edit({
                name: g.name.replace(/\s*🔒/, '')
            })
            g.send(`🔓 | Salon déverrouillé avec succès`)

        })
    }

    if (command === 'calc') {

        if (!args[0]) {
            return message.channel.send("<:cancel1:769230483863109632>  | ** Merci de mettre une expression à calculer !**");
        }

        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send("<:cancel1:769230483863109632>  | ** Merci de mettre une expression valide à calculer !**");
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#303136')
            .setAuthor("Calcul", client.user.displayAvatarURL())
            .addField("Opération", `\`\`\`js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
            .addField("Réponse", `\`\`\`js\n${result}\`\`\``)

        message.channel.send(embed);


    }
    if (command === "play") {
        const query = args.join(' ');
        console.log(query);
        const { channel } = message.member.voice;
        if (channel) {
            let i = 0;
            const searchResults = await client.music.search(query, message.author);
            const tracks = searchResults.tracks.slice(0, 10);
            const tracksInfo = tracks.map(r => `${++i}) ${r.title} - ${r.uri}`).join('\n');

            const embed = new Discord.MessageEmbed()
                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                .setDescription(tracksInfo)
                .setFooter('Résultats');

            message.channel.send(embed);

            const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);

            try {
                const response = await message.channel
                    .awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] });

                if (response) {
                    const entry = response.first().content;
                    const player = client.music.players.get(message.guild.id);
                    const track = tracks[entry - 1];
                    player.queue.add(track);
                    message.channel.send(`**🎵 | j'ai ajouté à la liste : ${track.title}**`);
                    if (!player.playing) player.play();
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    if (command === 'join') {
        const { channel } = message.member.voice;
        if (channel) {
            const player = client.music.players.spawn({
                guild: message.guild,
                voiceChannel: channel,
                textChannel: message.channel,
            });
        } else {
            message.channel.send('Veullez rejoindre un salon vocal');
        }
    }
    if (command === 'help') {
        const translate = require(`./languages/${lang}/${command}.json`)
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\n${translate.description}\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}$\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }


        const hum = await CmdModel.find({ serverID: message.guild.id })

        const a = hum.forEach(command => {

            `\`${command.name}\`,`
        });
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#303136')
            .setTitle(`<:help:771797221473124403>  - ${translate.title}`)
            .setImage(url = "https://tutosduweb.000webhostapp.com/www/imagee.png")
            .setDescription(translate.embedDescritpion)

        .addFields({ name: '<:admin:771797221489377280> | every : ', value: '`backup-create`,`backup-load`,`backup-info`,`setafk`,`setbotlogs`,`unsetafk`,`addemoji`,`newcmd`,`maj` ,`calc`,`shorturl`,`hastebin`,`membercount`,`join`,`leave`,`setstatus`,`regles`,`pannel`,`serverinvite`,`invite`,`blacklist`,`deblacklist`,`setwelcomemsg`,`unsetwelcomemsg`' })
            .addFields({ name: '<:funhat:771797222299795476> | Giveaway : ', value: '`start`,`reroll`,`end`,`edit`,`list`' })
            .addFields({ name: '<:musicwave:782228420360011788> | Levels : ', value: '`setlevel`,`rank`,`addxp`,`addlevel`,`levelchannel`,``levelmessage``' })
            .addFields({ name: '<:hmm:782286638947500042> | Verification : ', value: '`setcaptcha`,`setmessage`,`setrole`,`setchannel`' })
            .addFields({ name: '<:role:782286960667918346> | Roles à réaction : ', value: '`rr-add`,`rr-remove`,`rr-list`,`rr-send`' })

        .addFields({ name: '<:staff:771797221506547794> | Modération : ', value: '`sondage`,`kick` , `ban` , `warn` , `checkwarn`,`removewarn`, `mute` , `unmute` , `clear ` , `ann`,`lockchannel` , `unlockchannel` , `lockserver` , `giverole` , `removerole`' })
            .addFields({ name: '<:star:752168549329534977> | Images : ', value: '`cat` , `love`, `dog` , `nasa`,`clyde`,`captcha`,`tweet`, `panda` ,`oiseau` , `renard` , `koala` , `rpanda `' })
            .addFields({ name: '<:funhat:771797222299795476> | Fun :', value: '`remind`,`pfc`,`coinflip`,`weeb`,`shibe`,`calc`,`perms`,`qqn` , `compliments`,`envers`  , `metamorphe`, `question`, `roll` , `rr`, `choisit`  , `pourcent`, `say`, `bvn` , `tweet` , `clyde` ,  `trump`' })
            .addFields({ name: '<:rpg:767280679792672809> | RPG :', value: '`shop`,`shop-add`,`shop-remove`,`buy`,`work`, `profil`, `like`,`ch`, `cp`,`setbio`,`cu`,`inv`,`vendre`,`ra`,`mn`, `inv-valeur` ,  `recolter`,`donner`,`addbanner`,`resetbanner`,`givemoney`,`resetmoney`,`vdaily` ' })
            .addFields({ name: '<:crafts:771797220554702889> | Utilitaires :', value: '`vote`,`sugg` , `help`,`serverinfo` ,`serverole`, `userinfo` , `botinfo`,`classement`, `rename`,`bot` , `img`, `uptime` , `servericon`, `bug`, `staff`, `serveremoji` , `userinfo`, `roleinfo` , `credits`, `v`  , `embed`,`setwelcomechannel` , `setautorole` , `setleavechannel` , `setlogschannel` ,`setsuggchannel`,`setlevel`, `unsetwelcomechannel` , `unsetautorole` , `unsetleavechannel` ,`unsetlogschannel`, `unsetsuggchannel`,`unsetlevel` ' })


        .addFields({ name: translate.links, value: `
            [Dashboard](http://lightbot.tk/) - [${translate.invite}](https://discord.com/oauth2/authorize?client_id=756827233032732753&scope=bot&permissions=8) - [Support](https://discord.gg/RXSgshr97V) - [Vote](https://top.gg/bot/756827233032732753/vote)` })
            .setTimestamp()
            .setFooter(`page demandée par ${message.author.tag}`, `https://png.pngtree.com/png-clipart/20190924/original/pngtree-vector-user-young-boy-avatar-icon-png-image_4827810.jpg`);

        message.channel.send(exampleEmbed);
    }
    if (command === 'love') {
        if (!message.mentions.users.size === 0) return message.channel.send("<:information:769234471236665355> ** |Tu dois mentionner deux personnes ! **")
        let user1 = args[0];
        let user2 = args[1];
        if (!args[0] || args[0 == "null"]) return message.reply("<:information:769234471236665355> ** | Tu dois mentionner deux personnes ! **");
        if (!args[1] || args[1 == "null"]) return message.reply("<:information:769234471236665355> ** |Tu dois mentionner deux personnes ! **");
        let number = Math.floor(Math.random() * 99) + 1;
        let loveplusembed = new Discord.MessageEmbed()
            .setTitle("Love")
            .setDescription(`Test de love`)
            .addField("Membres", `${user1} + ${user2}`)
            .addField("Resultat", `${number}% :two_hearts:`)
            .setColor("#D50A0A")
            .setImage("https://i.imgur.com/RAwPNKH.png")
        if (number > 90) return message.channel.send(loveplusembed), message.delete().catch();

        let loveembed = new Discord.MessageEmbed()
            .setTitle("Love")
            .setDescription(`Test de love`)
            .addField("Membres", `${user1} + ${user2}`)
            .addField("Resultat", `${number}% :heart:`)
            .setImage("https://media.tenor.com/images/4294deb5ec97086243174b085d609695/tenor.gif")
            .setColor("#D50A0A")
        if (number < 90) return message.channel.send(loveembed), message.delete().catch();

        console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)

    }
    if (command === 'serverinvite') {
        if (args[0] == "help") {
            message.channel.send("**Usage de la commande : `l.serverinvite <id du salon> `**");
            return;
        }
        const setChannelID = message.content.split(' ');

        try {
            message.guild.channels.cache.get(setChannelID[1]).createInvite().then(invite =>
                message.channel.send("<:checkmark:769230483820773426>** |Invitation crée avec succès **: \n" + invite.url)
            );
        } catch (error) {
            console.error(`I could not create the invite for the channel: ${error}`);
            message.channel.send(`<:information:769234471236665355> ** | Merci de mettre l'id du salon! **`);
        }
    }
    if (command === 'serverinfo') {
        const paul = new Discord.MessageEmbed()
            .setColor('#0099ff')

        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setDescription(`${message.guild.name}`)
            .addField(`description`, message.guild.description, true)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))

        .addField('Nb de personnes :', message.guild.memberCount, true)
            .addField('nb de salons  :', message.guild.channels.cache.size, true)
            .addField('nb de roles :', message.guild.roles.cache.size, true)
            .addField('nb d \'emojis :', message.guild.emojis.cache.size, true)
            .addField('embed channel :', message.guild.embedChannel, true)
            .addField('niveau de notifications:', message.guild.systemChannel, true)
            .addField('salon de messages système:', message.guild.systemChannel, true)
            .addField('salon afk:', message.guild.afkChannel, true)
            .addField('salon avec un widget:', message.guild.widgetChannel, true)
            .addField('salon d\'invitation du widget :', message.guild.embedChannel, true)
            .addField('salon des règles:', message.guild.rulesChannel, true)
            .addField('salon des annonces:', message.guild.publicUpdatesChannel, true)
            .addField('niveau de sécurité', message.guild.verificationLevel, true)
            .addField('Région', message.guild.region, true)
            .addField('propriétaire', message.guild.owner.user, true)
            .addField('crée le :', message.guild.createdAt, true)

        .setTimestamp()
            .setFooter('Light', client.user.displayAvatarURL({ dynamic: true, size: 512 }));

        message.channel.send(paul);
    }
    if (command === 'botinfo') {
        const paul = new Discord.MessageEmbed()
            .setColor('#303136')
            .setTitle('Info du Bot')
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setThumbnail('https://botsdiscord.000webhostapp.com/img/icone.png')
            .addField('Stats', `Nb de serveur :\`${client.guilds.cache.size}\`
            Nb d'utilisateurs du bot : \`${client.users.cache.size} \`
            Nb de salons : \`${client.channels.cache.size} \``)
            .addField('Technologies', `Hebergeur : \`Heroku\`
            Node JS : \`1.3.4\`
            DiscordJS : \`${Discord.version}\`
            MongoDB : \`1.8.4\`
             `)
            .addField(
                '**📚 Liens**',
                '**[Ajouter Light](https://discordapp.com/oauth2/authorize?client_id=756827233032732753&scope=bot&permissions=2146958847) | ' +
                '[Light support](https://discord.gg/BryKHhHnMD) | ' +
                '[Dashboard](http://lightbot.tk/)**'
            )
            .setImage(url = 'https://tutosduweb.000webhostapp.com/assets/image.png')
            .setFooter("© 2020 | Light bot")
            .setTimestamp()
            .setColor("#2f3136");


        message.channel.send(paul);
    }
    if (command === "ping") {

        const m = await message.channel.send("Ping?");
        m.edit(`Pong! réponse en ${m.createdTimestamp - message.createdTimestamp}ms. perte de ${Math.round(client.ws.ping)}ms`);

    }

    if (command === "say") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const sayMessage = args.join(" ")
        if (!sayMessage) return message.channel.send('<:cancel1:769230483863109632> | **Merci de mettre un message**')
        message.delete().catch(O_o => {});
        message.channel.send(sayMessage);
    }
    if (command === "question") {
        let reason = args.join(' ');
        if (reason.length < 1) return message.channel.send('<:information:769234471236665355> ** | Merci de bien utiliser cette commande : question <question> !**');
        var ball = ['C\'est certain.', 'Aucun doute à ce sujet.', 'Aucune chance.', 'Peut-être que le temps le dira.', 'Pas question.', 'Concentrez-vous et essayez à nouveau.', 'Comme je le vois, oui ', ' Bonne perspective ', ' Très probablement ', ' Mieux vaut ne pas vous le dire maintenant ', ' Mes sources disent non ', ' Les signes indiquent oui ', ' Oui certainement ', ' C\'est décidément ainsi ', ' Comme je le vois, oui ', ' Mes sources disent que non ', ' Les perspectives ne sont pas si bonnes ', ' Très douteux '];
        const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .addField("Votre question", reason)
            .addField("Light répond", ball[Math.floor(Math.random() * ball.length)])
            .setThumbnail("http://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
        message.channel.send({ embed })
    }
    if (command === "kick") {

        if (!message.member.hasPermission("KICK_MEMBERS"))
            return message.channel.send("<:cancel1:769230483863109632> | **vous n'avez pas la permission `EXPULSER_MEMBRES`**");
        if (!args[0])
            return message.channel.send("<:cancel1:769230483863109632> | **Merci de mettre une personne**");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.channel.send("<:cancel1:769230483863109632> | **cette personne n'existe pas**");
        if (!member.kickable)
            return message.channel.send("<:cancel1:769230483863109632> |** je ne peux pas expulser un administrateur**");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Aucune raison";
        member.send(`:lock:  Vous avez été exclu du serveur **${message.guild.name}** pour la raison : **${reason}**..........`);
        await member.kick(reason)

        const paul = new Discord.MessageEmbed()
            .setTitle('**KICK**')
            .setColor('#F0590D')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .setDescription(`${member.user.tag} a été kick du serveur `)
            .addField('Modérateur', message.author.tag, true)
            .addField('Membre kick', member.user.tag, true)
            .addField('raison', reason)
        message.channel.send(paul);


    }
    if (command === "warn") {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (!args[0])
            return message.channel.send("<:cancel1:769230483863109632> | **Merci de mettre une personne**");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!member)
            return message.reply("<:cancel1:769230483863109632> | **cette personne n'existe pas**");
        //if (!member.kickable)
        //  return message.reply("❌ je ne peux pas avertir un administrateur");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Aucune raison";

        await (reason)
        let verify = await ChannelModel.findOne({ serverID: message.guild.id, channelID: member.id })
        if (verify) {
            let actw = verify.reason;
            let x = '1';
            let warn = math.evaluate(`${actw} + ${x}`)
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, channelID: member.id }, { $set: { reason: warn } }, { new: true });
            await member.send(`:warning: Vous avez été avertit sur le serveur **${message.guild.name}** pour la raison : **${reason}** .Vous avez ${warn} warn(s)`);


            const paul = new Discord.MessageEmbed()
                .setTitle('**WARN**')
                .setColor('#DFF00D')
                .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
                .setDescription(`${member.user.tag} a désormais ${warn}warn(s)`)
                .addField('Modérateur', message.author.tag, true)
                .addField('Membre warn', member.user.tag, true)
                .addField('raison', reason)
            message.channel.send(paul);
            if (warn => '3') {
                member.send(`:mute:  Vous avez été muté sur le serveur **${message.guild.name}** pour la raison : **trop de warns**`);
                let role = message.guild.roles.cache.find(role => role.name === "Muted");
                if (!role) {
                    try {
                        role = await message.guild.roles.create({
                            data: {
                                name: "Muted",
                                color: "#000000",
                                permissions: []
                            }
                        });

                        message.guild.channels.cache.forEach(async(channel, id) => {
                            await channel.createOverwrite(role, {
                                SEND_MESSAGES: false,
                                MANAGE_MESSAGES: false,
                                READ_MESSAGES: false,
                                ADD_REACTIONS: false
                            });
                        });
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
                member.roles.add(role)
                const paul = new Discord.MessageEmbed()
                    .setTitle('**MUTED**')

                .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
                    .setDescription(`${member.tag} a été mute`)
                    .addField('raison', 'trops de warns')
                message.channel.send(paul);
            }
        } else {
            const verynew = new ChannelModel({
                serverID: `${message.guild.id}`,
                channelID: `${member.id}`,
                reason: '1',
            }).save();
            let warn = '1';
            await member.send(`:warning: Vous avez été avertit sur le serveur **${message.guild.name}** pour la raison : **${reason}** .C'est ton premier warn`);


            const paul = new Discord.MessageEmbed()
                .setTitle('**WARN**')
                .setColor('#DFF00D')
                .setThumbnail(url = "https://skybot.fr/uploads/1603182392.png")
                .setDescription(`${member.user.tag} a été averit pour la première fois`)
                .addField('Modérateur', message.author.tag, true)
                .addField('Membre warn', member.user.tag, true)
                .addField('raison', reason)
            message.channel.send(paul);
        }


    }
    if (command === "checkwarn") {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (!args[0])
            return message.channel.send("<:cancel1:769230483863109632> | **Merci de mettre une personne**");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!member)
            return message.reply("<:cancel1:769230483863109632> | **cette personne n'existe pas**");
        //if (!member.kickable)
        //  return message.reply("❌ je ne peux pas avertir un administrateur");


        let verify = await ChannelModel.findOne({ serverID: message.guild.id, channelID: member.id })
        if (verify) {
            let actw = verify.reason;


            message.channel.send(`<:information:769234471236665355>** | ${member.user.tag} a actuellement \`${actw}\` warns sur ce serveur**`);

        } else {


            message.channel.send(`<:information:769234471236665355> **| ${member.user.tag} n'a aucun warn ! **`);
        }


    }
    if (command === "removewarn") {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        if (!args[0])
            return message.channel.send("<:cancel1:769230483863109632> | **Merci de mettre une personne**");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!member)
            return message.channel.send("<:cancel1:769230483863109632> | **cette personne n'existe pas**");
        //if (!member.kickable)
        //  return message.reply("❌ je ne peux pas avertir un administrateur");

        let verify = await ChannelModel.findOne({ serverID: message.guild.id, channelID: member.id })
        if (verify) {
            let actw = verify.reason;
            let nb = args[1];

            let warn = math.evaluate(`${actw} - ${nb}`)
            const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, channelID: member.id }, { $set: { reason: warn } }, { new: true });
            message.channel.send(`<:information:769234471236665355>** |  ${member.user.tag} s'est fait retiré ${nb} warns . Il a désormais \`${warn}\` warns sur ce serveur**`);

        } else {


            message.channel.send(`<:information:769234471236665355> ** |${member.user.tag} n'a aucun warn ! **`);
        }


    }
    if (command === "ban") {

        if (!message.member.hasPermission("BAN_MEMBERS"))
            return message.channel.send(ldb.Adm);
        if (!args[0])
            return message.channel.send("<:cancel1:769230483863109632> | **Merci de mettre une personne**");
        let member = message.mentions.members.first();
        if (!member)
            return message.channel.send("<:cancel1:769230483863109632> |** Cette personne n'existe pas sur ce serveur !**");
        if (!member.bannable)
            return message.channel.send("<:cancel1:769230483863109632> | **Je ne peux pas bannir ce membre . Problème de hiérarchie**");

        let reason = args.slice('1').join(' ') || "Aucune raison donnée";
        member.send(`:lock:  Vous avez été banni du serveur **${message.guild.name}** pour la raison : **${reason}**..........`);
        const paul = new Discord.MessageEmbed()
            .setTitle('Banissement !')
            .setColor('#CA00E3')
            .setThumbnail(url = 'https://cdn.discordapp.com/emojis/756887182450622495.png?v=1')
            .addFields({ name: 'Modérateur', value: `${message.author.tag}` }, { name: 'Membre banni', value: `${member.user.tag}` }, { name: 'Raison', value: `${reason}` });




        const lol = await message.channel.send(paul);
        await member.ban({ reason: `${reason}` })
            .catch(error => {
                lol.delete();
                message.channel.send(`<:cancel1:769230483863109632> | désolé ${message.author} Je ne peux pas le faire car : ${error}`)
            });
    }

    if (command === "bvn") {
        if (!message.mentions.users.size) {
            return message.reply('<:cancel1:769230483863109632> | **Merci d\'indiquer à qui vous voulez souhaiter la bienvenue!**');
        }

        const taggedUser = message.mentions.users.first();
        const paul = new Discord.MessageEmbed()
            .setTitle(`Bienvenue`)

        .setDescription(`${message.author.tag} souhaite la bienvenue à  ${taggedUser.username}`)

        .setImage('https://www.cos38.com/data/contenu/dropzone/f9adaeb3324a2feaf944a3b4cfaf3458.jpg')



        message.channel.send(paul);

    }
    if (command === "saluer") {
        if (!message.mentions.users.size) {
            let usage = "<membre>**";
            return message.channel.send(ldb.langusage + command + usage);
        }

        const taggedUser = message.mentions.users.first();
        const paul = new Discord.MessageEmbed()
            .setTitle(`Salut`)

        .setDescription(`${message.author.tag} salue ${taggedUser.username}`)

        .setImage('https://www.rts.ch/2014/06/25/11/39/5959337.image?w=960&h=384')



        message.channel.send(paul);

    }


    if (command === "backup-create") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }


        backup.create(message.guild, {
            jsonBeautify: true
        }).then((backupData) => {
            backupData.id
            message.author.send(`<:information:769234471236665355> | **Votre sauvegarde a été crée avec succès ! pour la charger , faites : \`${prefix}backup-load ${backupData.id}\`**`);
            message.channel.send(ldb.Bcp);
        });
    }
    if (command === "backup-load") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let backupID = args[0];
        if (!backupID) {
            let usage = "<ID>**";
            return message.channel.send(ldb.langusage + command + usage);
        }

        backup.fetch(backupID).then(async() => {

            message.channel.send(ldb.Bimp);
            await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "-confirm"), {
                max: 1,
                time: 20000,
                errors: ["time"]
            }).catch((err) => {
                return message.channel.send(ldb.Bcan);
            });
            message.author.send(ldb.Bdeb);
            backup.load(backupID, message.guild).then(() => {

                backup.remove(backupID);
            }).catch((err) => {
                return message.author.send(ldb.err);
            });
        }).catch((err) => {
            console.log(err);

            return message.channel.send(ldb.fnd + backupID);
        });
    }

    if (command === "backup-info") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let backupID = args[0];
        if (!backupID) {
            let usage = "<ID>**";
            return message.channel.send(ldb.langusage + command + usage);
        }

        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(),
                mm = (date.getMonth() + 1).toString(),
                dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new Discord.MessageEmbed()
                .setAuthor("Informations sur la backup")

            .addField(" ID", backupInfos.id, false)

            .addField("Server ID", backupInfos.data.guildID, false)

            .addField("Taille", `${backupInfos.size} mb`, false)

            .addField("Crée le", formatedDate, false)
                .setColor("#303136");
            message.channel.send(embed);
        }).catch((err) => {

            return message.channel.send(ldb.fnd + backupID);
        });
    }

    if (command === "stopbot") {
        if (message.guild.id !== '765899951443279922') return;
        else {
            const paul = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Eteindre le bot')
                .setDescription(`${message.author.tag} le bot va etre éteint , merci de confimer avec ✅ou annulez avec ✖`)
                .setFooter(client.user.username, 'https://cdn.discordapp.com/avatars/751860365167427704/c8b78936e6818ea0ef64b69b8a25781b.png');


            message.channel.send(paul).then(function(msg) {
                msg.react('✅');

                msg.react('✖');
            })

            const filter = (reaction, user) => {
                return ['✅', '✖'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '✅') {
                        message.reply('Arrêt en cours...');
                        client.destroy(config.token);
                    } else {
                        message.reply('Opération annulée.');
                    }
                })
                .catch(collected => {
                    message.reply('Aucune réponse après 30s , anulation');
                });
        }

    }
    if (command === "qqn") {
        const member = message.guild.members.cache.random(1)[0];

        const embed = new Discord.MessageEmbed()
            .addField("username", member.user.username, true)
            .addField("Discriminato", member.user.discriminator, true)
            .addField("ID", member.user.id, true)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#303136')
        message.channel.send(embed);
    }
    if (command === "edit") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        let usage = " <giveaway ID>";
        if (!args[0]) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }
        let messageID = args[0];
        client.giveawaysManager.edit(messageID, {
            newWinnerCount: 3,
            newPrize: "New Prize!",
            addTime: 5000
        }).then(() => {
            message.channel.send("Success! Giveaway will updated in less than " + (manager.updateCountdownEvery / 1000) + " seconds.");
        }).catch((err) => {
            message.channel.send("No giveaway found for " + messageID + ", please check and try again");
        });
    }
    if (command === "list") {
        const usage = "";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de faire choisir le bot entre deux choix\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}$\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        let onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);


        let notEnded = client.giveawaysManager.giveaways.filter((g) => !g.ended);

        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`Liste des giveaways`)


        .addField("Total", onServer)
            .addField("En cours", notEnded)

        .setFooter("© 2020 - Light bot")
            .setTimestamp()
            .setColor("#2f3136");
        message.channel.send(reportEmbed);


    }
    if (command === "reroll") {

        const usage = " <giveaway ID>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nReroll un giveaway\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}$\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nADMINISTRATEUR\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }

        if (!args[0]) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }
        let messageID = args[0];
        client.giveawaysManager.reroll(messageID).then(() => {
            message.channel.send("<:checkmark:769230483820773426> | ** Giveaway reroll avec succès!**");
        }).catch((err) => {
            message.channel.send(ldb.fnd + backupID);
        });

    }
    if (command === "start") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        let usage = " <temps> <gagnants> <prix>";
        if (!args[0]) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }
        if (!args[1]) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }
        if (!args.slice(2).join(" ")) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }
        client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(" "),
            winnerCount: parseInt(args[1]),
            messages: {
                giveaway: "\n\n<:funhat:771797222299795476><:funhat:771797222299795476> **GIVEAWAY**<:funhat:771797222299795476><:funhat:771797222299795476>",
                giveawayEnded: "\n\n<:funhat:771797222299795476><:funhat:771797222299795476> **GIVEAWAY ENDED** <:funhat:771797222299795476><:funhat:771797222299795476>",
                timeRemaining: "Temps restant: **{duration}**!",
                inviteToParticipate: "Reagissez avec <:funhat:771797222299795476> pour participer!",
                winMessage: "Féliciattions, {winners}! Vous gagnez **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: "<:cancel1:769230483863109632> |**Giveaway annulé, aucunne participation valide.**",
                hostedBy: "Crée par: {user}",
                winners: "gagnant(s)",
                endedAt: "Fin le",
                units: {
                    seconds: "secondes",
                    minutes: "minutes",
                    hours: "heures",
                    days: "jours",
                    pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                }
            }
        });

    }
    if (command === 'sondage') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(ldb.ADM);
        }
        const msg = args.join(' ');
        if (!msg) {
            let usage = "<text>**";
            return message.channel.send(ldb.langusage + command + usage);
        }


        let pollEmbed = new Discord.MessageEmbed()
            .setTitle("<:polling:777175663244738570> Nouveau sondage:")
            .setDescription(msg)
            .setColor('#303136')
            .setFooter("© 2020 - Light bot")
            .setTimestamp()


        try {
            message.channel.send({ embed: pollEmbed }).then(sentEmbed => {
                message.delete();
                sentEmbed.react('<:checkmark:769230483820773426>');
                sentEmbed.react('<:cancel1:769230483863109632>');
            });
        } catch {
            return message.channel.send(ldb.err);

        }



    }
    if (command === "dashboard") {

        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nDonne un lien pour le dashboard du bot\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }






        const embed = new Discord.MessageEmbed()

        .setTitle('📑 Dashboard')
            .setDescription(`👋🏼 Hey ${message.author} , pour aller sur mon dashboard rend toi: [ICI](http://lightbot.tk/)`)
            .setTimestamp()
            .setFooter(`Light | © 2020`)
            .setColor("#2f3136");
        message.channel.send(embed);

    }
    if (command === "classement") {
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nDonne un lien pour le classement du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }




        const embed = new Discord.MessageEmbed()

        .setTitle('📖 Classement du serveur')
            .setDescription(`👋🏼 Hey ${message.author} , va voir le classement du serveur [ICI](http://lightbot.tk/leaderboard/${message.guild.id})`)

        .setTimestamp()
            .setFooter(`Light | © 2020`)
            .setColor("#2f3136");
        message.channel.send(embed);

    }
    if (command === "lb") {
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nDonne un lien pour le classement du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }



        const embed = new Discord.MessageEmbed()

        .setTitle('📖 Classement du serveur')
            .setDescription(`👋🏼 Hey ${message.author} , va voir le classement du serveur [ICI](http://lightbot.tk/leaderboard/${message.guild.id})`)

        .setTimestamp()
            .setFooter(`Light | © 2020`)
            .setColor("#2f3136");
        message.channel.send(embed);


    }
    if (command === "leaderboard") {


        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nDonne un lien pour le classement du serveur\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }




        const embed = new Discord.MessageEmbed()

        .setTitle('📖 Classement du serveur')
            .setDescription(`👋🏼 Hey ${message.author} , va voir le classement du serveur [ICI](http://lightbot.tk/leaderboard/${message.guild.id})`)
            .setTimestamp()
            .setFooter(`Light | © 2020`)
            .setColor("#2f3136");
        message.channel.send(embed);
    }
    if (command === "shorturl") {
        let usage = " <url corecte>**";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nPermet de raccourcir une URL\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        const url = args[0];


        if (!url) {
            return message.channel.send(`${ldb.langusage}  ${command} ${usage} **`);
        }

        const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURI(url)}`);
        const body = await res.text();

        if (body === "Error: Please enter a valid URL to shorten") {
            return message.channel.send(ldb.langusage + command + usage);
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#303136')
            .setAuthor("Short URL")

        .setDescription(body);
        message.channel.send(embed);

    }
    if (command === "hastebin") {

        let usage = "<code>";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nMet le code voulu dans un hastebin\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}${usage}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        const content = args.join(" ");
        if (!content) {
            return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
        }

        try {
            const res = await fetch("https://hasteb.in/documents", {
                method: "POST",
                body: content,
                headers: { "Content-Type": "text/plain" }
            });

            const json = await res.json();
            if (!json.key) {
                return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
            }
            const url = "https://hasteb.in/" + json.key + ".js";

            const embed = new Discord.MessageEmbed()
                .setAuthor("Hastebin")
                .setDescription(url)
                .setColor('#303136')
                .setFooter("© 2020 - Light bot")
            message.channel.send(embed);
        } catch (e) {
            return message.channel.send(ldb.err);
        }


    }
    if (command === "shibe") {
        let usage = " <url corecte>**";
        if (args[0] == "help") {

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Informations sur la commande : \`${command}\``)


            .addField("Description", `\`\`\`js\nEnvoye une image de shibe\`\`\``)
                .addField("Usage", `\`\`\`diff\n-${prefix}${command}\`\`\``)
                .addField("Permisions requises", `\`\`\`js\nAUCUNE\`\`\``)

            .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(reportEmbed);
            return;


        }
        try {
            const res = await fetch('http://shibe.online/api/shibes');
            const img = (await res.json())[0];
            const embed = new Discord.MessageEmbed()
                .setTitle("" + message.author.username + " regarde un shibe apparaît 🐶")
                .setImage(img)
                .setFooter("© 2020 - Light bot")
                .setTimestamp()
                .setColor("#303136");
            message.channel.send(embed);
        } catch (err) {
            return message.channel.send(ldb.err);
        }

    }
    if (command === "weeb") {
        try {
            if (args.length !== 0) {
                const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${args[0]}`);
                return message.channel.send({ files: [{ attachment: body, name: 'screenshot.png' }] });
            } else {
                let usage = "<url>";
                if (!content) {
                    return message.channel.send(`${ldb.langusage}  ${command}  ${usage} **`);
                }
            }
        } catch (err) {
            return message.channel.send(ldb.err);
        }

    }
    if (command === "clear") {
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("<:cancel1:769230483863109632> | **vous n'avez pas la permission `GERER_MESSAGES`**");

        const messageArray = message.content.split(" ");
        const args = messageArray.slice(1);
        let deleteamount;
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.channel.send("**<:cancel1:769230483863109632> | Merci de mettre un chiffre ente 1 et 100**");
        }

        if (parseInt(args[0]) > 100) {
            return message.channel.send('**<:cancel1:769230483863109632> | Il faut que le nombre de messages à supprimer soit moins ou égale à 100 messages!**')
        } else {
            deleteamount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteamount + 1, true).catch(e => {
            if (e) return message.channel.send("**<:cancel1:769230483863109632> | Une erreur c'est produite**")
        });

    }



});

client.login(config.token);
