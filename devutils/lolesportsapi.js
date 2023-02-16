const axios = require("axios");

//league
// axios
// 	.get(
// 		"https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-GB&leagueId=98767991302996019",
// 		{
// 			headers: {
// 				"x-api-key": "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z",
// 			},
// 		}
// 	)
// 	.then((res) =>
// 		res.data.data.schedule.events.forEach((element) => {
// 			if (element.state === "unstarted") console.log(element);
// 		})
// 	)
// 	.catch((err) => logger.error(err));

//valorant
axios
	.get(
		"https://esports-api.service.valorantesports.com/persisted/val/getSchedule?hl=en-GB&sport=val&leagueId=109551178413356399%2C106109559530232966%2C107019646737643925%2C107566795186957938%2C105555608835603034%2C105555678532655472%2C105555677198805024%2C106132846649518478%2C105555664141146477%2C105555666330314783%2C105555635175479654%2C107910334624279390%2C105555627532605797%2C105555705801095792%2C105555704030157191%2C105555707205380136%2C105555699868690469%2C107440791133814482%2C106470453892538426%2C107115678205203231%2C106375817979489820%2C109109622360706601%2C108752229027041361%2C109029777807406730%2C107611634639431870%2C107611638797005141%2C106976737954740691%2C109222784797127274%2C107566801001021372%2C107566814199410292",
		{ headers: { "x-api-key": " 0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z" } }
	)
	.then((res) =>
		res.data.data.schedule.events.forEach((element) => {
			if (element.state === "unstarted") console.log(element);
		})
	)
	.catch((err) => logger.error(err));
