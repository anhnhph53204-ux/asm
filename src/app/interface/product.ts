export interface IProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  size?: string;
  color?: string;
  description?: string;
}

export interface IPicture {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
export interface ICategory {
  id: number;
  name: string;
  description?: string;
  status: boolean;
}