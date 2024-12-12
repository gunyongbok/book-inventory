import { Suspense } from "react";
import BookDetails from "./BookDetails";

const BookPage = async ({ params }: { params: { id: string } }) => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BookDetails id={params.id} />
    </Suspense>
  );
};

export default BookPage;
