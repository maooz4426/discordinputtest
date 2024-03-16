const {Client,ButtonBuilder, ButtonStyle, GatewayIntentBits,ModalBuilder,TextInputBuilder,TextInputStyle,ActionRowBuilder,InteractionType} = require("discord.js");
// const { Client, GatewayIntentBits, Partials } = require('discord.js'); //discord.js から読み込む
require("dotenv").config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		// GatewayIntentBits.GuildMembers,
		// GatewayIntentBits.GuildBans,
		// GatewayIntentBits.GuildEmojisAndStickers,
		// GatewayIntentBits.GuildIntegrations,
		// GatewayIntentBits.GuildWebhooks,
		// GatewayIntentBits.GuildInvites,
		// GatewayIntentBits.GuildVoiceStates,
		// GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		// GatewayIntentBits.GuildMessageReactions,
		// GatewayIntentBits.GuildMessageTyping,
		// GatewayIntentBits.DirectMessages,
		// GatewayIntentBits.DirectMessageReactions,
		// GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		// GatewayIntentBits.GuildScheduledEvents,
	],
	// partials: [
	// 	Partials.User,
	// 	Partials.Channel,
	// 	Partials.GuildMember,
	// 	Partials.Message,
	// 	Partials.Reaction,
	// 	Partials.GuildScheduledEvent,
	// 	Partials.ThreadMember,
	// ],
}); //clientインスタンスを作成する

client.once('ready', () => { //ここにボットが起動した際のコードを書く(一度のみ実行)
	console.log('起動完了'); //黒い画面(コンソール)に「起動完了」と表示させる
});

// ボタンのセットアップ関数
async function setupButton(channel) {
    const button = new ButtonBuilder()
        .setCustomId('openModal')
        .setLabel('入会届')
        .setStyle(ButtonStyle.Primary);//ボタンを青に

    const row = new ActionRowBuilder().addComponents(button);

    await channel.send({
        content: '入会届のフォームを開くには下のボタンをクリックしてください。',
        components: [row]
    });
}

// 特定のコマンドでボタンをセットアップ
client.on('messageCreate', async message => {
    if (message.content === '!setup') {
        setupButton(message.channel);
    }
});
// ボタンクリック時のイベントハンドラ
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'openModal') {
        const modal = new ModalBuilder()
            .setCustomId('admissionModal')
            .setTitle('入会届');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('あなたの氏名を入力してください')
            .setStyle(TextInputStyle.Short);

        const nameInput2 = new TextInputBuilder()
            .setCustomId('nameInput2')
            .setLabel('ふりがなを入力してください')
            .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(nameInput2);
        modal.addComponents(firstActionRow,secondActionRow);

        await interaction.showModal(modal);
    }
});



client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'nameModal') {
        const name = interaction.fields.getTextInputValue('nameInput');
        const message = 'サンプルメッセージ';

        // GASのウェブアプリケーションURL
        const url = 'https://script.google.com/macros/s/AKfycbyGxPxBesn4jLprEiGfCm3uG0MY6p8JFT2mfIrbQ6ctTPmCf-pFfNb4D4cbySDnSi9t8A/exec';

        // POSTリクエストの送信
        fetch(url, {
            "method": 'POST',
             "mode"       : "no-cors",
            headers: { // headers オブジェクト内に "Content-Type" を設定
            'Content-Type': 'application/json; charset=UTF-8'},
            
            "body": JSON.stringify({ name: name, message: message }),
        })
        .then(response => response.text())
  .then(text => {
    try {
      const data = JSON.parse(text); // テキストをJSONとして解析
      console.log('JSON形式のデータ:', data);
      // dataを使用した処理...
    } catch (error) {
      console.error('テキストはJSON形式ではありません:', text);
      // JSONでない場合の処理...
    }
  });
    //     .then(response => response.text()) // レスポンスをテキストとして解析
    //   .then(data => {
	// 	console.log(data);
	// })


        await interaction.reply(`あなたの名前は ${name} ですね。情報を送信しました。`);
    }
});



client.login(process.env.TOKEN);
