const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

async function setupButton(channel){
    const button = new ButtonBuilder()
        .setCustomId('openModal')
        .setLabel('入会届')
        .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await channel.send({
            content: '入会届のフォームを開くには下のボタンをクリックしてください。',
            components: [row]
        });
    }

    module.exports = {setupButton};