const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');

function openModal(interaction){
    const modal = new ModalBuilder()
        .setCustomId('admissionModal')
        .setTitle('入会届');

    const nameInput = new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('あなたの氏名を入力してください')
        .setStyle(TextInputStyle.Short);
        
    const nameInput2 = new TextInputBuilder()
        .setCustomId('nameInput2')
        .setLabel('あなたのふりがなを入力してください')
        .setStyle(TextInputStyle.Short);

    const nameInput1ActionRow = new ActionRowBuilder().addComponents(nameInput);
    const nameInput2ActionRow = new ActionRowBuilder().addComponents(nameInput2);
    
    modal.addComponents(nameInput1ActionRow, nameInput2ActionRow);

    interaction.showModal(modal);
}

async function modalSubmit(interaction) {
    if (!interaction.isModalSubmit()) return;

    if(interaction.customId === 'admissionModal'){
        const uid = interaction.user.id;
        const name = interaction.fields.getTextInputValue('nameInput');
        const name2 = interaction.fields.getTextInputValue('nameInput2');

        // GASのウェブアプリケーションURL
        const url = 'https://script.google.com/macros/s/AKfycbyGxPxBesn4jLprEiGfCm3uG0MY6p8JFT2mfIrbQ6ctTPmCf-pFfNb4D4cbySDnSi9t8A/exec';

        // POSTリクエストの送信
        fetch(url, {
            "method": 'POST',
             "mode"       : "no-cors",
            headers: { 
            'Content-Type': 'application/json; charset=UTF-8'},
            
            "body": JSON.stringify({ uid: uid, name: name, name2: name2 }),
        })
        .then(response => response.text())
        .then(text => {
            try {
            const data = JSON.parse(text); 
            console.log('JSON形式のデータ:', data);
           
            } catch (error) {
            console.error('テキストはJSON形式ではありません:', text);
            }

        
        }  );
        await interaction.reply(`あなたの名前は ${name} ですね。情報を送信しました。`);
    }
   
};
  
module.exports = {openModal, modalSubmit};