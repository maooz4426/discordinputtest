async function giveRole(interaction) {
    if (!interaction) {
        return;
    } else {
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

        //  await interaction.deferReply();
        console.log('ロールを付与します。');
        // if(!interaction.member.roles.cache.has(role)){
        //     await interaction.member.roles.add(role);
        //     interaction.editReply(`ロール "${role.name}" を付与しました。`);
        // }
         try {

             if(!interaction.member.roles.cache.has(role)){
                await interaction.member.roles.add(role);
                console.log('ロールを付与しました。');
                // interaction.editReply(`ロール "${role.name}" を付与しました。`);
             }
           
         } catch (error) {
             console.error('ロールの付与中にエラーが発生しました:', error);
             await interaction.followUp('ロールの付与中にエラーが発生しました。');
         }
    }
    }

async function deleteRole(interaction){
    if(!interaction) return;

    // if (!interaction.member) {
    //     console.error('interaction.member が undefined です。');
    //     return;
    //   }

    // if(interaction.guild.roles.cache.find(role => role.name === 'サークル会員')){
    //     console.log('サークル会員');
    //     await interaction.memeber.roles.remove('サークル会員');
    // }else if(interaction.guild.roles.cache.find(role => role.name === 'OBOG')){
    //     await interaction.member.roles.remove('OBOG');
    // }
    
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
    // console.log();
    if(interaction.member.roles.cache.has(process.env.CIRCLE_MEMBER_ROLE_ID)){

        return 'サークル会員';
    }else if(interaction.member.roles.cache.has(process.env.OBOG_ROLE_ID)){
        
        return 'OBOG';
    }
}
module.exports = {giveRole,checkRole,deleteRole};