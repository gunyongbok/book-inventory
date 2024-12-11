import pool from "@/lib/db";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 책 목록을 조회
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM books");
      const books = rows as Book[];
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  }
  // 책 추가
  else if (req.method === "POST") {
    const { title, author, stock } = req.body;

    if (!title || !author || !stock) {
      return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
    }

    try {
      // 기존에 동일한 책이 있는지 확인하는 쿼리
      const [rows] = await pool.query(
        "SELECT * FROM books WHERE title = ? AND author = ?",
        [title, author]
      );

      if ((rows as Book[]).length > 0) {
        // 책이 이미 존재하면 수량만 업데이트
        const bookId = (rows as Book[])[0].id;
        const newStock = (rows as Book[])[0].stock + stock;

        await pool.query("UPDATE books SET stock = ? WHERE id = ?", [
          newStock,
          bookId,
        ]);

        return res.status(200).json({
          message: "책이 이미 존재하여 수량이 업데이트되었습니다.",
        });
      } else {
        // 책이 없으면 새로 추가
        await pool.query(
          "INSERT INTO books (title, author, stock) VALUES (?, ?, ?)",
          [title, author, stock]
        );
        return res
          .status(201)
          .json({ message: "책이 성공적으로 추가되었습니다." });
      }
    } catch (error) {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end("허용되지 않은 응답 처리입니다.");
  }
}
