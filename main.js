const {Client, GatewayIntentBits} = require('discord.js');

require('dotenv').config();

const { setupButton} = require('./setupButton');
const {openAdmissionModal,openChangeModal,openObogModal, modalSubmit} = require('./modalHandle');
const {deleteConfigureButton,fetchDeleteUserInfo} = require('./messageHandle');
const { checkRole,deleteRole } = require('./roleHandle');
//  onst {checkRole} = require('./roleHandle');

const client = new Client({
    intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready',( ) => {
    console.log('起動完了');
});

client.on('messageCreate', async message => {
    if(message.content === '!setup') {
        setupButton(message.channel);
    }
})

client.on('interactionCreate', async interaction => {
    console.log(interaction.customId);
    if(interaction.isButton()){
        // console.log('ボタンが押されました。');
        switch(interaction.customId){
            case 'openAdmissionModal':
                openAdmissionModal(interaction);
                break;
            case 'openChangeModal':
                openChangeModal(interaction);
                break;
            case 'openObogModal':
                openObogModal(interaction);
                break;
            case'deleteConfigure':
                console.log('deleteConfigureButton');
                deleteConfigureButton(interaction);
                break;
            case 'confirmDeleteYes': 
            try {
                
                const role = checkRole(interaction); // ロールをチェック
                const uid = interaction.user.id; // ユーザーIDを取得
                await fetchDeleteUserInfo(role, uid); // 退会情報のフェッチ
                await deleteRole(interaction);
                console.log('退会処理が完了しました。');
                await interaction.deferReply({ ephemeral: true }); // 応答を保留に設定
                await interaction.followUp({ content: '退会処理が完了しました。', ephemeral: true }); // 確認メッセージを送信
              } catch (error) {
                console.error('処理中にエラーが発生しました:', error);
                await interaction.deferReply({ ephemeral: true });
                await interaction.followUp({ content: 'エラーが発生しました。', ephemeral: true });
              }
            break;
            // case'confirmDeleteYes':
            //     console.log('confirmDeleteYes');
            //     fetchDeleteUserInfo(interaction);
            //     break;
        }
    }else if(interaction.isModalSubmit()){
        modalSubmit(interaction);
        // giveRole(interaction);
    }
});

client.login(process.env.TOKEN);