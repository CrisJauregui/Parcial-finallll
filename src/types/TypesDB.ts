export type UserType = {
  id: string;
  fullName: string;
  email: string;
  registeredAt?: Date;
};

export type ActivityType = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: Date;
};