const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const paginate = async (interaction, items, itemsPerPage, embedGenerator) => {
	const embeds = [];
	const pages = {};
	let pageItemCount = 0;

	while (items.length > 0) {
		const embed = embedGenerator(embeds.length);

		while (pageItemCount < itemsPerPage && items.length > 0) {
			const item = items.pop();
			embed.addFields({
				name: item.name,
				value: item.value,
				inline: false,
			});
			pageItemCount++;
		}

		pageItemCount = 0;
		embeds.push(embed);
	}

	const getRow = (id) => {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`prev-${id}`)
					.setEmoji("⏪")
					.setDisabled(pages[id] === 0)
					.setStyle(ButtonStyle.Primary)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`next-${id}`)
					.setEmoji("⏩")
					.setDisabled(pages[id] === embeds.length - 1)
					.setStyle(ButtonStyle.Primary)
			);

		return row;
	};

	const id = interaction.user.id;
	pages[id] = pages[id] || 0;
	const embed = embeds[pages[id]];

	const filter = (i) => i.user.id === interaction.user.id;

	await interaction.editReply({
		embeds: [embed],
		components: [getRow(id)],
	});

	const collector = interaction.channel.createMessageComponentCollector({
		filter,
		time: 1000 * 60 * 10,
	});

	collector.on("collect", async (btnInt) => {
		if (!btnInt) return;

		btnInt.deferUpdate();
		if (
			!btnInt.customId.startsWith("prev-") &&
			!btnInt.customId.startsWith("next-")
		)
			return;
		const direction = btnInt.customId.startsWith("prev-") ? -1 : 1;
		if (pages[id] + direction >= 0 && pages[id] + direction < embeds.length)
			pages[id] += direction;

		await interaction.editReply({
			embeds: [embeds[pages[id]]],
			components: [getRow(id)],
		});
	});
};

const isAdmin = (member) => {
	/* I dont know why but whenever a member does not have administrator an exception is thrown
	instead of giving false so i did some spaghetti */
	try {
		const isAdmin = member.permissions.has("ADMINISTRATOR");
		return isAdmin;
	} catch {
		return false;
	}
};

module.exports = { isAdmin, paginate };
