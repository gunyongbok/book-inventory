"use client";

import { Book } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newBook, setNewBook] = useState({ title: "", author: "", stock: "" });
  const itemsPerPage = 10;
  const router = useRouter();

  // 서버에서 책 목록을 가져오는 함수
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("책 데이터를 불러오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 책 목록에서 현재 페이지에 해당하는 책들을 가져오는 로직
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 사용자가 입력한 책 정보를 추가하는 함수
  const addBook = async () => {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newBook.title,
          author: newBook.author,
          stock: parseInt(newBook.stock),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.message);
        fetchBooks();
        setNewBook({ title: "", author: "", stock: "" });
      } else {
        const errorData = await res.json();
        console.error(
          "책 추가에 실패했습니다:",
          errorData.error || "알 수 없는 오류"
        );
      }
    } catch (error) {
      console.error("책 추가 요청에 실패했습니다.", error);
    }
  };

  const handleBookClick = (id: number) => {
    router.push(`/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Books List</h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">책이 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {currentBooks.map((book) => (
              <div
                key={book.id}
                className="border p-2 cursor-pointer"
                onClick={() => handleBookClick(book.id)}
              >
                <h2 className="font-semibold text-center">{book.title}</h2>
                <p className="text-center">Author: {book.author}</p>
                <p className="text-center">Stock: {book.stock}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1 ? "bg-gray-200" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">원하는 새로운 책 추가하기</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="w-full border px-2 py-1"
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="w-full border px-2 py-1"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newBook.stock}
            onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
            className="w-full border px-2 py-1"
          />
          <button
            className="px-4 py-2 border rounded bg-blue-500 text-white"
            onClick={addBook}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
