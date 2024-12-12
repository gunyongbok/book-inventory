"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types";

const BookDetails = ({ id }: { id: string }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) {
          throw new Error("책 데이터를 불러오는 데 실패했습니다.");
        }
        const data: Book = await res.json();
        setBook(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!book) {
    return <div>책을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">책 상세 정보</h1>
      <div className="border p-4">
        <p>
          <strong>제목:</strong> {book.title}
        </p>
        <p>
          <strong>저자:</strong> {book.author}
        </p>
        <p>
          <strong>재고:</strong> {book.stock}
        </p>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.back()}
      >
        뒤로가기
      </button>
    </div>
  );
};

export default BookDetails;
