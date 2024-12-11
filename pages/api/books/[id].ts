import pool from "@/lib/db";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // 책 상세 조회
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
  }

  // 책 삭제
  else if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "책 id가 없습니다." });
    }

    try {
      // 책이 존재하는지 확인
      const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

      if ((rows as Book[]).length === 0) {
        return res
          .status(404)
          .json({ error: "해당 id를 가진 책은 존재하지 않습니다." });
      }

      // 책 삭제
      await pool.query("DELETE FROM books WHERE id = ?", [id]);

      res.status(200).json({ message: "책이 성공적으로 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end("허용되지 않은 응답 처리입니다.");
  }
}
