import pool from "@/lib/db";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // MySQL2에서 반환하는 타입을 RowDataPacket[]로 추론
      const [rows] = await pool.query("SELECT * FROM books");

      // 반환된 rows를 Book[]로 타입 선언
      const books = rows as Book[];

      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Get 요청만 가능합니다.");
  }
}
