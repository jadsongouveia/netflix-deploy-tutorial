import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
   try {
        const { currentUser } = await serverAuth(req, res);

        const { movieId } = req.body;

        if (!movieId || typeof movieId !== "string") {
          return res.status(400).json({ error: "Invalid movie ID" })
        }

        const existingMovie = await prismadb.movie.findUnique({
          where: {
            id: movieId
          },
        });

        if (!existingMovie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        if (req.method === "POST") {
          const user = await prismadb.user.update({
            where: {
                email: currentUser.email || '',
            },
            data: {
               favoriteIds: {
                 push: movieId,
               },
            },
          });
 
        return res.status(200).json({ favoriteIds: user.favoriteIds });
     }

     if (req.method === 'DELETE') {
       const updatedFavoriteIds = without(currentUser.favoriteIds, movieId); 

       const updatedUser = await prismadb.user.update({
         where: {
          email: currentUser.email || '',
         },
         data: {
          favoriteIds: updatedFavoriteIds,
         },
       });

       return res.status(200).json({ favoriteIds: updatedUser.favoriteIds });

     }

     return res.status(405).json({ error: "Method not allowed" });
   } catch (error: unknown) {
    console.error("Favorite API Error:", error);

    if(error instanceof Error) {
      return res.status(401).json({ error: error.message })
    }

      return res.status(401).json({ error: "Unauthorized" });
  }
}