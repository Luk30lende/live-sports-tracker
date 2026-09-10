export function normalizeGame(event) {
  const status = event.strStatus;

  const finishedStatuses = ["Match Finished", "FT", "AET", "PEN"];

  const liveStatuses = ["1H", "HT", "2H", "ET", "P"];

  const isFinished = finishedStatuses.includes(status);
  const isLive = liveStatuses.includes(status);

  const hasScores = event.intHomeScore !== null && event.intAwayScore !== null;

  return {
    id: event.idEvent,
    league: event.strLeague,
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,

    homeScore: hasScores ? Number(event.intHomeScore) : null,

    awayScore: hasScores ? Number(event.intAwayScore) : null,

    status: isFinished ? "FINISHED" : isLive ? "LIVE" : "UPCOMING",

    minute: null,

    time: event.strTimeLocal || event.strTime || null,

    homeTeamBadge: event.strHomeTeamBadge || null,

    awayTeamBadge: event.strAwayTeamBadge || null,

    date: event.dateEventLocal || event.dateEvent,

    venue: event.strVenue || null,
  };
}

export function normalizeTeam(team) {
  return {
    id: team.idTeam,
    name: team.strTeam,
    shortName: team.strTeamShort || team.strTeam,
    sport: team.strSport === "Soccer" ? "Football" : team.strSport,
    league: team.strLeague,
    country: team.strCountry,
    badge: team.strBadge || null,
    logo: team.strLogo || null,
    stadium: team.strStadium || null,
  };
}
