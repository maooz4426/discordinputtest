const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

async function setupButton(channel){
    const admissionButton = new ButtonBuilder()
        .setCustomId('openAdmissionModal')
        .setLabel('入会届')
        .setStyle(ButtonStyle.Primary);

    
    const changeButton = new ButtonBuilder()
        .setCustomId('openChangeModal')
        .setLabel('情報変更届')
        .setStyle(ButtonStyle.Success);
    
    const row = new ActionRowBuilder().addComponents(admissionButton,changeButton);

    await channel.send({
        content: '入会届のフォームを開くには下のボタンをクリックしてください。',
        components: [row]
    });
    }

    module.exports = {setupButton};