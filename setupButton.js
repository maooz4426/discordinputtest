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
    
    const obogButton = new ButtonBuilder()
        .setCustomId('openObogModal')
        .setLabel('卒業済みの方')
        .setStyle(ButtonStyle.Secondary);

    const deleteButton = new ButtonBuilder()
        .setCustomId('deleteConfigure')
        .setLabel('退会届')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(admissionButton,changeButton,obogButton,deleteButton);

    await channel.send({
        content: '入会、退会、卒業、登録情報を変更したい場合は下のボタンをクリックしてください。',
        components: [row]
    });
    }

    module.exports = {setupButton};