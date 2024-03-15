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
        .setLabel('名前を入力')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await channel.send({
        content: '名前の入力フォームを開くには下のボタンをクリックしてください。',
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
            .setCustomId('nameModal')
            .setTitle('名前の入力');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('あなたの名前を入力してください')
            .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
});

// モーダル送信時のイベントハンドラ
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'nameModal') {
        const name = interaction.fields.getTextInputValue('nameInput');
        await interaction.reply(`あなたの名前は ${name} ですね。入力ありがとうございます！`);
    }
});

client.login(process.env.TOKEN);
