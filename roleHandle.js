async function giveRole(interaction) {
    if (!interaction) {
        return;
    } else {
        const role = interaction.guild.roles.cache.find(role => role.name === 'testメンバー');
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


module.exports = giveRole;