module.exports = {
	capitalize: (sentence) => {
		const splitSentence = sentence.split(" ");
		for (let i = 0; i < splitSentence.length; i++) {
			splitSentence[i] =
				splitSentence[i].charAt(0).toUpperCase() + splitSentence[i].slice(1);
		}
		const jointSentence = splitSentence.join(" ");

		return jointSentence;
	},
};
