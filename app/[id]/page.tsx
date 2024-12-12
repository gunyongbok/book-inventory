import { Suspense } from "react";
import BookDetails from "./BookDetails";

type PageProps = {
  params: {
    id: string;
  };
};

const BookPage = async ({ params }: PageProps) => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BookDetails id={params.id} />
    </Suspense>
  );
};

export default BookPage;
