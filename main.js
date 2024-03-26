const {Client, GatewayIntentBits} = require('discord.js');

require('dotenv').config();

const { setupButton } = require('./setupButton');
const {openModal, modalSubmit} = require('./modalHandle');
const giveRole = require('./roleHandle');

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
    if(interaction.isButton()){
        openModal(interaction);
    }else if(interaction.isModalSubmit()){
        modalSubmit(interaction);
        giveRole(interaction);
    }
});

client.login(process.env.TOKEN);