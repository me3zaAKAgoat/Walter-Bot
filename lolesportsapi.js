const axios = require('axios');

axios
	.get(
		'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-GB&leagueId=98767991302996019',
		{
			headers: {
				'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
			},
		}
	)
	.then((res) =>
		res.data.data.schedule.events.forEach((element) => {
			console.log(element.match);
		})
	)
	.catch((err) => console.log(err));
