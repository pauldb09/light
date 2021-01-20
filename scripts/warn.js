let member = message.author;
message.delete().catch(O_o => {});
let verify = await ChannelModel.findOne({ serverID: message.guild.id, channelID: member.id })
if (verify) {
    let actw = verify.reason;
    let x = '1';
    let warn = math.evaluate(`${actw} + ${x}`)
    const newchannel = await ChannelModel.findOneAndUpdate({ serverID: message.guild.id, channelID: member.id }, { $set: { reason: warn } }, { new: true });
    await member.send(`:warning: Vous avez été avertit sur le serveur **${message.guild.name}** pour la raison : insultes`);
    const paul = new Discord.MessageEmbed()
        .setTitle('**WARN**')
        .setColor('#DFF00D')
        .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
        .setDescription(`${member.tag} a été avertit`)
        .addField('raison', '`insultes`')
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
    const paul = new Discord.MessageEmbed()
        .setTitle('**WARN**')
        .setColor('#DFF00D')
        .setThumbnail("https://tutosduweb.000webhostapp.com/assets/img/warning%20(1).png")
        .setDescription(`${member.tag} a été avertit`)
        .addField('raison', '`insultes`')
    message.channel.send(paul);
}