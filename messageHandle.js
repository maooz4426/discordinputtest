const {ActionRowBuilder,ButtonBuilder,ButtonStyle} = require('discord.js');

const {checkRole} = require('./roleHandle');

async function deleteConfigureButton(interaction){

    await interaction.deferReply({ ephemeral: true });


    var uid = interaction.user.id;

    var role = checkRole(interaction);

    console.log(role);
    var data = await fetchUserInfo(role,uid);
    console.log(data);

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

        console.log(interaction.customId);
        // if (interaction.customId === 'confirmDeleteYes') {
        //     // 退会処理を実行
        //     console.log('退会処理を実行します。');
        //     fetchDeleteUserInfo(role,uid);
        //     await interaction.update({ content: `${userName}さんの退会処理を完了しました。`, components: [] });
        // } else if (interaction.customId === 'confirmDeleteNo') {
        //     // 退会処理をキャンセル
        //     await interaction.update({ content: '退会処理をキャンセルしました。', components: [] });
        // }
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

async function fetchDeleteUserInfo(role, uid) {
    const url = process.env.URL; // 環境変数からURLを取得

    try {
        const response = await fetch(url, {
            method: 'POST', // HTTPメソッドをPOSTに設定
            headers: {
                'Content-Type': 'application/json', // コンテントタイプをJSONに設定
            },
            body: JSON.stringify({ // リクエストボディにJSON形式でデータを設定
                type: 'delete', // 操作タイプ
                role: role,     // ユーザーの役割
                uid: uid       // ユーザーID
            }),
        });

        if (!response.ok) { // レスポンスのステータスが 'ok' ではない場合、エラーとして扱う
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        // const data = await response.json(); // レスポンスボディをJSONとして解析
        //console.log(data); // 解析したデータをログに出力
        //return data; // 解析したデータを返す
        return;
    } catch (error) {
        console.error('Error fetching user info:', error); // エラーをキャッチし、ログに出力
        throw error; // エラーを再スローして、呼び出し元で処理できるようにする
    }
}

module.exports = {deleteConfigureButton,fetchDeleteUserInfo};