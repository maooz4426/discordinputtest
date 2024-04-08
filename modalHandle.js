const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');

const {giveRole,checkRole} = require('./roleHandle.js');

function openAdmissionModal(interaction){
    // console.log('openAdmissionModal 開始');
    const modal = new ModalBuilder()
        .setCustomId('admissionModal')
        .setTitle('入会届');
    // console.log('モーダル作成完了');

    const nameInput = nameTextInput();
    // const nameInput = new TextInputBuilder()
    //     .setCustomId('nameInput')
    //     .setLabel('あなたの氏名を入力してください')
    //     .setStyle(TextInputStyle.Short);
    
    const hiraganaInput = hiraganaTextInput();
    // const nameInput2 = new TextInputBuilder()
    //     .setCustomId('nameInput2')
    //     .setLabel('あなたのふりがなを入力してください')
    //     .setStyle(TextInputStyle.Short);

    createRow(modal,nameInput,hiraganaInput);
    // const nameInput1ActionRow = new ActionRowBuilder().addComponents(nameInput);
    // const nameInput2ActionRow = new ActionRowBuilder().addComponents(hiraganaInput);
    
    // modal.addComponents(nameInput1ActionRow, nameInput2ActionRow);

    interaction.showModal(modal);
}

async function openChangeModal(interaction){

    var uid = interaction.user.id;

    var role = checkRole(interaction);

    console.log(role);
    const data = await fetchUserInfo(role,uid);
    // await interaction.response.defer();
   
    // await interaction.deferReply({ ephemeral: true }); // 応答を保留に設定
    const userData = data.userData;
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
        
    const nameInput = nameTextInput().setValue(userData.name);
    // const nameInput = new TextInputBuilder()
    //     .setCustomId('nameInput')
    //     .setLabel('あなたの氏名を入力してください')
    //     .setStyle(TextInputStyle.Short)
    //     .setValue(userData.name);
    console.log(1);
    const hiraganaInput = hiraganaTextInput().setValue(userData.hiragana);
    // const nameInput2 = new TextInputBuilder()
    //     .setCustomId('nameInput2')
    //     .setLabel('あなたのふりがなを入力してください')
    //     .setStyle(TextInputStyle.Short)
    //     .setValue(userData.hiragana);
    console.log(2);
    createRow(modal,nameInput,hiraganaInput);
    console.log(3);
    // const nameInput1ActionRow = new ActionRowBuilder().addComponents(nameInput);
    // const nameInput2ActionRow = new ActionRowBuilder().addComponents(nameInput2);

    // modal.addComponents(nameInput1ActionRow,nameInput2ActionRow);
    
    // console.log(4);
    // await new Promise(resolve => setTimeout(resolve, 5000)); 
    interaction.showModal(modal);
    // await interaction.deferReply({ ephemeral: true });
}

async function openObogModal(interaction){
    const modal = new ModalBuilder()
        .setCustomId('obogModal')
        .setTitle('OBOG登録');
    
    const nameInput = nameTextInput();
    // const nameInput = new TextInputBuilder()
    // .setCustomId('nameInput')
    // .setLabel('あなたの氏名を入力してください')
    // .setStyle(TextInputStyle.Short);
   
    const hiraganaInput = hiraganaTextInput();
    // const nameInput2 = new TextInputBuilder()
    //     .setCustomId('nameInput2')
    //     .setLabel('あなたのふりがなを入力してください')
    //     .setStyle(TextInputStyle.Short);
       
    createRow(modal,nameInput,hiraganaInput);
    // const nameInput1ActionRow = new ActionRowBuilder().addComponents(nameInput);
    // const nameInput2ActionRow = new ActionRowBuilder().addComponents(nameInput2);

    // modal.addComponents(nameInput1ActionRow,nameInput2ActionRow);
    // try{
    //     interaction.showModal(modal);
    // }catch(error){
    //     await interaction.deferReply({ ephemeral: true });
    //     interaction.showModal(modal);
    // }

    interaction.showModal(modal);  
       
}

// async function openDeleteModal(interaction){

//     const modal = new ModalBuilder()
//         .setCustomId('deleteModal')
//         .setTitle('退会届');

//     var uid = interaction.user.id;

//     var role = checkRole(interaction);

//     var data = await fetchUserInfo(role,uid);

//     var name = data.userData.name;

    
// }

function createTextInput(customId,label,style = TextInputStyle.Short,value = ''){
    return new TextInputBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)
        .setValue(value);
}

//氏名の入力
function nameTextInput(){
    return createTextInput('nameInput','あなたの氏名を入力してください');
}

//ふりがな入力
function hiraganaTextInput(){
    return createTextInput('hiraganaInput','あなたのふりがなを入力してください');
}

//入力列の作成
function createRow(modal,nameInput,hiraganaInput){
    const nameInputActionRow = new ActionRowBuilder().addComponents(nameInput);
    const hiraganaActionRow = new ActionRowBuilder().addComponents(hiraganaInput);

    modal.addComponents(nameInputActionRow,hiraganaActionRow);
}

//モーダルの入力情報を提出
async function modalSubmit(interaction) {

    if (!interaction.isModalSubmit()) return;

        const role = checkRole(interaction);
        console.log(interaction.customId);
        const uid = interaction.user.id;
        const name = interaction.fields.getTextInputValue('nameInput');
        const hiragana = interaction.fields.getTextInputValue('hiraganaInput');
        

        const currentTime = new Date().toString();
        // const currentTime = new Date().toISOString();

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
                role: role,
                uid: uid, 
                currentTime:currentTime,
                name: name, 
                hiragana: hiragana }),
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

        if(interaction.customId === 'admissionModal'||interaction.customId === 'obogModal'){
            giveRole(interaction);
        }

        await interaction.reply(`あなたの名前は ${name} ですね。情報を送信しました。`);
    
   
};
  
//gasからユーザーの情報を取得
async function fetchUserInfo(role,uid){
    const url = process.env.URL;

    const response = await fetch(url,{
        method:'POST',
        body: JSON.stringify({
            type: 'get',
            role: role,
            uid:uid}),
        headers:{
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    console.log(data);
    return data;
}

module.exports = {openAdmissionModal,openChangeModal,openObogModal, modalSubmit};