import { createContext, useContext, useEffect, useState } from "react";

import { getFavouriteTeams, saveFavouriteTeams } from "../utils/storage";

const FavouriteTeamsContext = createContext(null);

export function FavouriteTeamsProvider({ children }) {
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

  return (
    <FavouriteTeamsContext.Provider
      value={{
        favouriteTeams,
        toggleFavourite,
      }}
    >
      {children}
    </FavouriteTeamsContext.Provider>
  );
}

export function useFavouriteTeamsContext() {
  const context = useContext(FavouriteTeamsContext);

  if (!context) {
    throw new Error(
      "useFavouriteTeamsContext must be used inside FavouriteTeamsProvider",
    );
  }

  return context;
}
