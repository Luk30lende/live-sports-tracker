const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";

function request(endpoint) {
  return fetch(`${BASE_URL}/${endpoint}`).then((response) => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  });
}

export function searchTeam(teamName) {
  return request(`searchteams.php?t=${encodeURIComponent(teamName)}`);
}

export function getLeagueNextEvents(leagueId) {
  return request(`eventsnextleague.php?id=${leagueId}`);
}

export function getLeaguePreviousEvents(leagueId) {
  return request(`eventspastleague.php?id=${leagueId}`);
}

export function getTeamPlayers(teamId) {
  return request(`lookup_all_players.php?id=${teamId}`);
}

export function getTeam(teamId) {
  return request(`lookupteam.php?id=${teamId}`);
}

export function getTeamNextEvents(teamId) {
  return request(`eventsnext.php?id=${teamId}`);
}

export function getTeamPreviousEvents(teamId) {
  return request(`eventslast.php?id=${teamId}`);
}

export function getPlayerStats(playerId) {
  return request(`lookupplayerstats.php?id=${playerId}`);
}

export function getLeagueStandings(leagueId) {
  return request(`lookuptable.php?l=${leagueId}`);
}

export function getLeagueTeams(leagueName) {
  return request(`search_all_teams.php?l=${encodeURIComponent(leagueName)}`);
}

export function getEventsByDay(date, leagueId) {
  return request(`eventsday.php?d=${date}&l=${leagueId}`);
}

export function getPlayer(playerId) {
  return request(`lookupplayer.php?id=${playerId}`);
}

export function getEvent(eventId) {
  return request(`lookupevent.php?id=${eventId}`);
}

export function getEventTimeline(eventId) {
  return request(`lookuptimeline.php?id=${eventId}`);
}
