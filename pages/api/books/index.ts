import { neon } from "@neondatabase/serverless";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 책 목록을 조회
  if (req.method === "GET") {
    try {
      const sql = neon(`${process.env.DATABASE_URL}`);
      const result = await sql("SELECT * FROM books");

      const books = result as Book[];

      res.status(200).json(books);
    } catch {
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
      const sql = neon(`${process.env.DATABASE_URL}`);

      const result = await sql(
        "SELECT * FROM books WHERE title = $1 AND author = $2",
        [title, author]
      );

      const existingBooks = result as Book[];

      if (existingBooks.length > 0) {
        const bookId = existingBooks[0].id;
        const newStock = existingBooks[0].stock + stock;

        await sql("UPDATE books SET stock = $1 WHERE id = $2", [
          newStock,
          bookId,
        ]);

        return res.status(200).json({
          message: "책이 이미 존재하여 수량이 업데이트되었습니다.",
        });
      } else {
        await sql(
          "INSERT INTO books (title, author, stock) VALUES ($1, $2, $3)",
          [title, author, stock]
        );
        return res
          .status(201)
          .json({ message: "책이 성공적으로 추가되었습니다." });
      }
    } catch {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end("허용되지 않은 응답 처리입니다.");
  }
}
