"use client";

import { Book } from "@/types";
import React, { useState, useEffect } from "react";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 서버에서 책 목록을 가져오는 함수
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books"); // API 호출
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("책 데이터를 불러오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Books List</h1>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {currentBooks.map((book) => (
          <div key={book.id} className="border p-2">
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
    </div>
  );
};

export default BooksPage;
