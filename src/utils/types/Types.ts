type UserType = {
  id: string;
  username: string;
};

type PostType = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
}

export type { UserType, PostType };