export interface User {
  id: number;
  username: string;
}

export const getUser = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 0, username: "Piotro" } as User);
    }, 1500);
  });
};
