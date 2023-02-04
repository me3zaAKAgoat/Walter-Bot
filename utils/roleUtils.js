module.exports = {
	createRole: async (guild, name, color, reason) => {
		try {
			const createdRole = guild.roles.create({
				name,
				color,
				reason,
			});
			return createdRole;
		} catch (err) {
			console.error(err);
		}
	},
	assignRole: async (member, role, name, color) => {
		if (!role) {
			const createdRole = await createRole(
				member.guild,
				name,
				color,
				`needed base ${name} role`
			);
			await member.roles.add(createdRole);
			return createdRole;
		}
		await member.roles.add(role);
		return role;
	},
};
