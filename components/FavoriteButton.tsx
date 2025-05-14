import axios from "@/lib/axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
    movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
   const { mutate: mutateFavorites } = useFavorites();
   const { data: currentUser, mutate } = useCurrentUser();

   const isFavorite = useMemo(() => {
     const list = currentUser?.favoriteIds || [];

     return list.includes(movieId);
   }, [currentUser, movieId]);

   const toggleFavorites = useCallback(async () => {
    try {
      if (isFavorite) {
         await axios.delete('/api/favorite', { 
            data: { movieId }, 
            withCredentials: true, 
        });
      } else {
         await axios.post(
            '/api/favorite', 
            { movieId },
            { withCredentials: true}
        );
      }

      mutate((prev: typeof currentUser) => ({
        ...prev!,
        favoriteIds: isFavorite
          ? prev!.favoriteIds.filter((id: string) => id !== movieId)
          : [...(prev!.favoriteIds || []), movieId],
      }));
      

      mutateFavorites();

    } catch (error) {
       console.log("Error ao atualizar favoritos:", error);
    }
   }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

        
        const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

   return (
     <div 
       onClick={toggleFavorites}
       className="
        cursor-pointer
        group/item
        w-6
        h-6
        lg:w-10
        lg:h-10
        border-white
        border-2
        rounded-full
        flex 
        justify-center
        items-center
        transition
        hover:border-neutral-300
     ">
        <Icon className="text-white" size={25} />
     </div>
   )
}

export default FavoriteButton;