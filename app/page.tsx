"use client";

import { Book } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  // 1개의 랜덤한 책을 추가하는 함수
  const addRandomBook = async () => {
    const newBook = {
      title: `Random Book ${Math.floor(Math.random() * 1000) + 1}`,
      author: `Random Author ${Math.floor(Math.random() * 1000) + 1}`,
      stock: Math.floor(Math.random() * 100) + 1,
    };

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.message);
        fetchBooks();
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
          Previous
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
          Next
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 border rounded bg-blue-500 text-white"
          onClick={addRandomBook}
        >
          랜덤 책 1개 추가
        </button>
      </div>
    </div>
  );
};

export default BooksPage;
