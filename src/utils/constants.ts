export const ACTIVITY_STATUS = {
  PENDING: "pending" as const,
  ACTIVE: "active" as const,
  DONE: "done" as const,
};

export const ACTIVITY_STATUS_TEXT = {
  [ACTIVITY_STATUS.PENDING]: "Pendiente",
  [ACTIVITY_STATUS.ACTIVE]: "En proceso",
  [ACTIVITY_STATUS.DONE]: "Finalizada",
};

export const ROUTES = {
  DASHBOARD: "/",
  ACTIVITIES: "/activities",
  LOGIN: "/login",
  SIGNUP: "/signup",
};

export const STORAGE_KEYS = {
  ACTIVITIES: "activities",
  USER_ID: "userId", 
  USER_EMAIL: "userEmail",
};