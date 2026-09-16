const FAVOURITE_TEAMS_KEY = "favouriteTeams";

export function getFavouriteTeams() {
  try {
    const savedTeams = localStorage.getItem(FAVOURITE_TEAMS_KEY);

    if (!savedTeams) {
      return [];
    }

    return JSON.parse(savedTeams);
  } catch (error) {
    console.error("Failed to load favourite teams:", error);

    return [];
  }
}

export function saveFavouriteTeams(teamIds) {
  try {
    localStorage.setItem(FAVOURITE_TEAMS_KEY, JSON.stringify(teamIds));
  } catch (error) {
    console.error("Failed to save favourite teams:", error);
  }
}
