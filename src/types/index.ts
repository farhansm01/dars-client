export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  createdAt?: string;
}

export interface Lecture {
  _id: string;
  course: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt?: string;
}

