async function giveRole(interaction) {
    if (!interaction) {
        return;
    } else {
        // ロールを初期化
        deleteRole(interaction);
        console.log('ロールを確認します。');
        if(interaction.customId === 'admissionModal'){
            var role = interaction.guild.roles.cache.find(role => role.name === 'サークル会員');
        }else if(interaction.customId === 'obogModal'){
            var role = interaction.guild.roles.cache.find(role =>role.name === 'OBOG');
        }

        if (!role) {
            await interaction.editReply('指定されたロールが見つかりませんでした。');
            return;
        }

        console.log('ロールを付与します。');

         try {

             if(!interaction.member.roles.cache.has(role)){
                await interaction.member.roles.add(role);
                console.log('ロールを付与しました。');
             }
           
         } catch (error) {
             console.error('ロールの付与中にエラーが発生しました:', error);
             await interaction.followUp('ロールの付与中にエラーが発生しました。');
         }
    }
    }

async function deleteRole(interaction){
    if(!interaction) return;
    
    if(interaction.member.roles.cache.has(process.env.CIRCLE_MEMBER_ROLE_ID)){
        await interaction.member.roles.remove(process.env.CIRCLE_MEMBER_ROLE_ID);
        console.log('サークル会員のロールを削除しました。');
    }else if(interaction.member.roles.cache.has(process.env.OBOG_ROLE_ID)){
        await interaction.member.roles.remove(process.env.OBOG_ROLE_ID);
        console.log('OBOGのロールを削除しました。');
    }
}

function checkRole(interaction){

    if(!interaction) return;

    if(interaction.member.roles.cache.has(process.env.CIRCLE_MEMBER_ROLE_ID)){
        return 'サークル会員';
    }else if(interaction.member.roles.cache.has(process.env.OBOG_ROLE_ID)){
        return 'OBOG';
    }
}

module.exports = {giveRole,checkRole,deleteRole};