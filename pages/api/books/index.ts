import pool from "@/lib/db";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("1");
  if (req.method === "GET") {
    try {
      // MySQL2에서 반환하는 타입을 Book[]로 캐스팅
      const [rows] = (await pool.query("SELECT * FROM books")) as unknown as [
        Book[]
      ]; // 타입 캐스팅
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("not allowed");
  }
}
