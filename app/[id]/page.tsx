import { Suspense, useEffect, useState } from "react";
import BookDetails from "./BookDetails";

type PageProps = {
  params: {
    id: string;
  };
};

const BookPage = ({ params }: PageProps) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setId(params.id);
    }
  }, [params]);

  if (!id) {
    return <div>로딩 중...</div>;
  }

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BookDetails id={id} />
    </Suspense>
  );
};

export default BookPage;
