module.exports = {
	isAdmin: (member) => {
		/* I dont know why but whenever a member does not have administrator an exception is thrown
        instead of giving false so i did some spaghetti */
		try {
			const isAdmin = member.permissions.has("ADMINISTRATOR");
			return isAdmin;
		} catch {
			return false;
		}
	},
};
