import { useEffect } from "react";
import { getUser, User } from "./getUser.service";
import { useAuth } from "./useAuth";

// Async function that checks is user authorized or not.
const isAuthorized = (): Promise<User | null> => {
  const user = localStorage.getItem("user") as string | null;

  if (!user) {
    return Promise.resolve(null);
  }

  return Promise.resolve(JSON.parse(user) as User);
};

// Facade to have implementation logic in one place.
const useMyAppAuth = () => {
  // Setup of auth logic.
  const result = useAuth<User>({ provider: getUser, check: isAuthorized });

  useEffect(() => {
    // Triggers getUser() to call authorization endpoint.
    result.authorize();
  }, []);

  return result;
};

export { useMyAppAuth };
