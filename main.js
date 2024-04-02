const {Client, GatewayIntentBits} = require('discord.js');

require('dotenv').config();

const { setupButton } = require('./setupButton');
const {openAdmissionModal,openChangeModal,openObogModal, modalSubmit} = require('./modalHandle');
const deleteConfigureButton = require('./messageHandle');
// const giveRole = require('./roleHandle');

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
                deleteConfigureButton(interaction);
                break;
        }
    }else if(interaction.isModalSubmit()){
        modalSubmit(interaction);
        // giveRole(interaction);
    }
});

client.login(process.env.TOKEN);