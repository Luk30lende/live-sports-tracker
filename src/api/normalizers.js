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
    homeTeamId: event.idHomeTeam,
    awayTeam: event.strAwayTeam,
    awayTeamId: event.idAwayTeam,

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

export function normalizeStanding(team) {
  return {
    id: team.idTeam,
    position: Number(team.intRank),
    team: team.strTeam,
    played: Number(team.intPlayed),
    won: Number(team.intWin),
    drawn: Number(team.intDraw),
    lost: Number(team.intLoss),
    points: Number(team.intPoints),
    form: team.strForm ? team.strForm.split("") : [],
    badge: team.strBadge || null,
  };
}

export function normalizePlayer(player) {
  return {
    id: player.idPlayer,
    teamId: player.idTeam,
    name: player.strPlayer,
    shortName: player.strPlayer
      ? player.strPlayer
          .split(" ")
          .map((name) => name.charAt(0))
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "??",

    team: player.strTeam || "Unknown",
    league: player.strLeague || "Unknown",

    sport: player.strSport === "Soccer" ? "Football" : player.strSport,

    position: player.strPosition || "Unknown",
    number: player.strNumber || "-",

    nationality: player.strNationality || "Unknown",

    image: player.strThumb || player.strCutout || null,
  };
}

export function normalizePlayerStats(stat) {
  return {
    id: stat.id,
    playerId: stat.idPlayer,
    teamId: stat.idTeam,
    leagueId: stat.idLeague,

    sport: stat.strSport === "Soccer" ? "Football" : stat.strSport,

    player: stat.strPlayer,
    team: stat.strTeam,
    league: stat.strLeague,

    statistic: stat.strStatistic,
    value: stat.strValue,

    season: stat.strSeason,

    teamBadge: stat.strTeamBadge || null,
    leagueBadge: stat.strLeagueBadge || null,
  };
}

export function normalizeTimelineEvent(event) {
  return {
    id: event.idTimeline,

    minute: event.intTime ? Number(event.intTime) : null,

    type: event.strTimeline || "Event",

    detail: event.strTimelineDetail || "Match event",

    player: event.strPlayer || null,

    team: event.strTeam || null,

    teamId: event.idTeam || null,

    assist: event.strAssist || null,

    playerImage: event.strCutout || null,

    period: event.strPeriod || null,
  };
}
