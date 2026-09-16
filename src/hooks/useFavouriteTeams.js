import { useEffect, useState } from "react";

import { getFavouriteTeams, saveFavouriteTeams } from "../utils/storage";

function useFavouriteTeams() {
  const [favouriteTeams, setFavouriteTeams] = useState(() =>
    getFavouriteTeams(),
  );

  useEffect(() => {
    saveFavouriteTeams(favouriteTeams);
  }, [favouriteTeams]);

  const toggleFavourite = (teamId) => {
    setFavouriteTeams((currentFavourites) => {
      if (currentFavourites.includes(teamId)) {
        return currentFavourites.filter((id) => id !== teamId);
      }

      return [...currentFavourites, teamId];
    });
  };

  return {
    favouriteTeams,
    toggleFavourite,
  };
}

export default useFavouriteTeams;
