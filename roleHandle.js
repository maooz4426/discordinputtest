async function giveRole(interaction) {
    if (!interaction) {
        return;
    } else {
        if(interaction.customId === 'admissionModal'){
            var role = interaction.guild.roles.cache.find(role => role.name === 'サークル会員');
        }else if(interaction.customId === 'obogModal'){
            var role = interaction.guild.roles.cache.find(role =>role.name === 'OBOG');
        }

        if (!role) {
            await interaction.editReply('指定されたロールが見つかりませんでした。');
            return;
        }

        try {
            if(!interaction.member.roles.cache.has(role)){
                await interaction.member.roles.add(role);
                await interaction.editReply(`ロール "${role.name}" を付与しました。`);
            }else{
                return;
            }
           
        } catch (error) {
            console.error('ロールの付与中にエラーが発生しました:', error);
            await interaction.editReply('ロールの付与中にエラーが発生しました。');
        }
    }
}

function checkRole(interaction){

    if(!interaction) return;
    console.log(interaction.member.roles.cache.has(role));
    if(interaction.member.roles.cache.has('サークル会員')){

        return 'サークル会員';
    }else if(interaction.member.roles.cache.has('OBOG')){
        
        return 'OBOG';
    }
}
module.exports = {giveRole,checkRole};