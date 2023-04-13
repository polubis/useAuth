import { useEffect } from "react";
import { getUser, User } from "./getUser.service";
import { useAuth } from "./useAuth";

const getAuthorizedUser = (): Promise<User | null> => {
  const user = localStorage.getItem("user") as string | null;

  // If there is no user data in Local storage it simply returns null.
  if (!user) {
    return Promise.resolve(null);
  }

  return Promise.resolve(JSON.parse(user) as User);
};

// Facade to have logic in one place.
const useMyAppAuth = () => {
  // Setup of auth logic.
  const result = useAuth<User>({ provider: getUser, check: getAuthorizedUser });

  useEffect(() => {
    // The getUser() function is called underneath, which 
    // performs an authorization request.
    result.authorize();
  }, []);

  return result;
};

export { useMyAppAuth };
