const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');

const {giveRole, checkRole} = require('./roleHandle.js');

function openAdmissionModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('admissionModal')
        .setTitle('入会届');

    const nameInput = nameTextInput();
    const hiraganaInput = hiraganaTextInput();
    createRow(modal, nameInput, hiraganaInput);
    interaction.showModal(modal);
}

async function openChangeModal(interaction) {
    var uid = interaction.user.id;
    var role = checkRole(interaction);
    // console.log(role);
    const data = await fetchUserInfo(role, uid);
    const userData = data.userData;
    console.log(userData)
    const modal = new ModalBuilder()
        .setCustomId('changeModal')
        .setTitle('情報変更届');   
    console.log(1);
    const nameInput = nameTextInput().setValue(userData.name );
    const hiraganaInput = hiraganaTextInput().setValue(userData.hiragana);

    console.log(2);
    createRow(modal, nameInput, hiraganaInput);
    console.log(3);
    interaction.showModal(modal);
}

async function openObogModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('obogModal')
        .setTitle('OBOG登録');
    const nameInput = nameTextInput();
    const hiraganaInput = hiraganaTextInput();
    createRow(modal, nameInput, hiraganaInput);
    interaction.showModal(modal);
}

function createTextInput(customId, label, style = TextInputStyle.Short, value = '') {
    return new TextInputBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)
        .setValue(value);
}

function nameTextInput() {
    return createTextInput('nameInput', 'あなたの氏名を入力してください');
}

function hiraganaTextInput() {
    return createTextInput('hiraganaInput', 'あなたのふりがなを入力してください');
}

function createRow(modal, nameInput, hiraganaInput) {
    const nameInputActionRow = new ActionRowBuilder().addComponents(nameInput);
    const hiraganaActionRow = new ActionRowBuilder().addComponents(hiraganaInput);
    modal.addComponents(nameInputActionRow, hiraganaActionRow);
}

async function modalSubmit(interaction) {
    if (!interaction.isModalSubmit()) return;
    const role = checkRole(interaction);
    console.log(interaction.customId);
    const uid = interaction.user.id;
   
    const name = interaction.fields.getTextInputValue('nameInput');
    const hiragana = interaction.fields.getTextInputValue('hiraganaInput');
    const currentTime = new Date().toString();
    const url = process.env.URL;
    fetch(url, {
        "method": 'POST',
        "mode": "no-cors",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        "body": JSON.stringify({
            type: 'submit',
            modalType: interaction.customId,
            role: role,
            uid: uid,
            currentTime: currentTime,
            name: name,
            hiragana: hiragana
        }),
    })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                console.log('JSON形式のデータ:', data);
            } catch (error) {
                console.error('テキストはJSON形式ではありません:', text);
            }
        });

    if (interaction.customId === 'admissionModal' || interaction.customId === 'obogModal') {
        giveRole(interaction);
    }

    await interaction.reply(`あなたの名前は ${name} ですね。情報を送信しました。`);
}

async function fetchUserInfo(role, uid) {
    const url = process.env.URL;
    console.log(uid);
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

module.exports = {openAdmissionModal, openChangeModal, openObogModal, modalSubmit};
