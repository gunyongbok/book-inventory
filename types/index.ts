export interface Book {
  id: number;
  title: string;
  author: string;
  stock: number;
}

export interface NewBook {
  title: string;
  author: string;
  stock: number;
}
