"use client";

import { Suspense } from "react";
import { use } from "react";
import BookDetails from "./BookDetails";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const BookPage = ({ params }: PageProps) => {
  const unwrappedParams = use(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BookDetails id={unwrappedParams.id} />
    </Suspense>
  );
};

export default BookPage;
