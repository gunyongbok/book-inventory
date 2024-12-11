import pool from "@/lib/db";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (!id) {
      return res.status(400).json({ error: "책 id가 없습니다." });
    }
    try {
      const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
      const books = rows as Book[];

      if (books.length === 0) {
        return res
          .status(404)
          .json({ error: "해당 id를 가진 책은 존재하지 않습니다." });
      }

      // 책 정보 반환
      res.status(200).json(books[0]);
    } catch (error) {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    // GET 이외의 요청이 들어왔을 경우 405 Method Not Allowed 반환
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Get 요청만 가능합니다.");
  }
}
