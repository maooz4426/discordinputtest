const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');

function openAdmissionModal(interaction){
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

async function openChangeModal(interaction){

    const uid = interaction.user.id;

    const userData = fetchUserInfo(uid);
    // const url = process.env.url;
    // const response = await fetch(url,{
    //     method:'GET',
    //     body:JSON.stringify({uid:uid}),
    //     headers:{
    //         'Content-Type':'application/json',
    //     },
    // });

    // const userData = await response.json();

    const modal = new ModalBuilder()
        .setCustomId('changeModal')
        .setTitle('情報変更届');
        

    const nameInput = new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('あなたの氏名を入力してください')
        .setStyle(TextInputStyle.Short)
        .setValue(userData.name);

    const nameInput2 = new TextInputBuilder()
        .setCustomId('nameInput2')
        .setLabel('あなたのふりがなを入力してください')
        .setStyle(TextInputStyle.Short)
        .setValue(userData.hiragana);

    const nameInput1ActionRow = new ActionRowBuilder().addComponents(nameInput);
    const nameInput2ActionRow = new ActionRowBuilder().addComponents(nameInput2);

    modal.addComponents(nameInput1ActionRow,nameInput2ActionRow);
    
    interaction.showModal(modal);
}

async function modalSubmit(interaction) {
    if (!interaction.isModalSubmit()) return;

    if(interaction.customId === 'admissionModal' || interaction.customId === 'changeModal'){
        const uid = interaction.user.id;
        const name = interaction.fields.getTextInputValue('nameInput');
        const name2 = interaction.fields.getTextInputValue('nameInput2');

        // GASのウェブアプリケーションURL
        const url = process.env.URL;

        // POSTリクエストの送信
        fetch(url, {
            "method": 'POST',
             "mode" : "no-cors",
            headers: { 
            'Content-Type': 'application/json; charset=UTF-8'},
            
            "body": JSON.stringify({ 
                type:'submit',
                modalType: interaction.customId,
                uid: uid, 
                name: name, 
                name2: name2 }),
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
  
async function fetchUserInfo(uid){
    const url = process.env.URL;

    const response = await fetch(url,{
        method:'POST',
        body: JSON.stringify({
            type:'get',
            uid:uid}),
        headers:{
            'Content-Type': 'application/json',
        },
    });

    const userData = await response.json();
    return userData;
}

module.exports = {openAdmissionModal,openChangeModal, modalSubmit};