import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      try {
        await serverAuth(req,res);

        const movies = await prismadb.movie.findMany();

        return res.status(200).json(movies);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error ao buscar filmes"});
      }
}