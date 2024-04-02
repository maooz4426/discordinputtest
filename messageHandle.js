const {ActionRowBuilder,ButtonBuilder,ButtonStyle} = require('discord.js');

const checkRole = require('./roleHandle');

async function deleteConfigureButton(interaction){

    var uid = interaction.user.id;

    var role = checkRole(interaction);

    var data = await fetchUserInfo(role,uid);

    var name = data.userData.name;

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('confirmDeleteYes')
                .setLabel('はい')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('confirmDeleteNo')
                .setLabel('いいえ')
                .setStyle(ButtonStyle.Success),
        );
    
        await interaction.editReply({
            content: `${name}さんの情報を削除しますか？`,
            components: [row],
            ephemeral:true, // メッセージを実行したユーザーにのみ表示
        });

        if (interaction.customId === 'confirmDeleteYes') {
            // 退会処理を実行
            await interaction.update({ content: `${userName}さんの退会処理を完了しました。`, components: [] });
        } else if (interaction.customId === 'confirmDeleteNo') {
            // 退会処理をキャンセル
            await interaction.update({ content: '退会処理をキャンセルしました。', components: [] });
        }
}

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