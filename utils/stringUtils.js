module.exports = {
	capitalize: (sentence) => {
		sentence = sentence.split(" ");
		for (let i = 0; i < sentence.length; i++) {
			sentence[i] = sentence[i].charAt(0).toUpperCase() + sentence[i].slice(1);
		}
		sentence = sentence.join(" ");

		return sentence;
	},
};
