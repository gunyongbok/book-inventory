"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types";

const BookDetails = ({ id }: { id: string }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", stock: 0 });
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
        setFormData({
          title: data.title,
          author: data.author,
          stock: data.stock,
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("책 삭제에 실패했습니다.");
      }
      alert("책이 성공적으로 삭제되었습니다.");
      router.push("/");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("책 수정에 실패했습니다.");
      }
      alert("책 정보가 성공적으로 수정되었습니다.");
      setEditMode(false);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  };

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

      {editMode ? (
        <div className="border p-4">
          <div>
            <label>제목:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
          </div>
          <div>
            <label>저자:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
          </div>
          <div>
            <label>재고:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
          </div>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
          >
            저장
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            취소
          </button>
        </div>
      ) : (
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
      )}

      <div className="mt-4">
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
          >
            수정
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded mr-2"
        >
          삭제
        </button>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => router.back()}
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
