"use server";

import { neon } from "@neondatabase/serverless";
import { Book } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const sql = neon(`${process.env.DATABASE_URL}`);

  // 책 상세 조회
  if (req.method === "GET") {
    if (!id) {
      return res.status(400).json({ error: "책 id가 없습니다." });
    }
    try {
      const result = await sql("SELECT * FROM books WHERE id = $1", [id]);
      const books = result as Book[];

      if (books.length === 0) {
        return res
          .status(404)
          .json({ error: "해당 id를 가진 책은 존재하지 않습니다." });
      }
      res.status(200).json(books[0]);
    } catch {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  }

  // 책 삭제
  else if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "책 id가 없습니다." });
    }

    try {
      const result = await sql("SELECT * FROM books WHERE id = $1", [id]);
      const books = result as Book[];

      if (books.length === 0) {
        return res
          .status(404)
          .json({ error: "해당 id를 가진 책은 존재하지 않습니다." });
      }

      await sql("DELETE FROM books WHERE id = $1", [id]);

      res.status(200).json({ message: "책이 성공적으로 삭제되었습니다." });
    } catch {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  }

  // 책 수정
  else if (req.method === "PUT") {
    if (!id) {
      return res.status(400).json({ error: "책 id가 없습니다." });
    }

    const { title, author, stock } = req.body;

    if (!title || !author || !stock) {
      return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
    }

    try {
      const result = await sql("SELECT * FROM books WHERE id = $1", [id]);
      const books = result as Book[];

      if (books.length === 0) {
        return res
          .status(404)
          .json({ error: "해당 id를 가진 책은 존재하지 않습니다." });
      }

      // 책 정보 수정
      await sql(
        "UPDATE books SET title = $1, author = $2, stock = $3 WHERE id = $4",
        [title, author, stock, id]
      );

      res.status(200).json({ message: "책 정보가 성공적으로 수정되었습니다." });
    } catch {
      res.status(500).json({ error: "데이터베이스 쿼리 실패" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
    res.status(405).end("허용되지 않은 응답 처리입니다.");
  }
}
