import { useCallback, useEffect, useState, useMemo } from "react";
import { catchError, EMPTY, from, Subject, switchMap, tap } from "rxjs";

// Possible states described by interfaces.
interface IdleState {
  status: "idle";
}

interface CheckingState {
  status: "checking";
}

interface AuthorizingState {
  status: "authorizing";
}

interface AuthorizedState<T> {
  status: "authorized";
  data: T;
}

interface AuthorizationErrorState {
  status: "error";
  message: string;
}

// Union of interfaces - variants of our state.
type AuthState<T> =
  | IdleState
  | CheckingState
  | AuthorizingState
  | AuthorizedState<T>
  | AuthorizationErrorState;

// Function definition for authorization.
type Provider<T> = (...params: unknown[]) => Promise<T>;
// Function that returns data about authorized user or null if he is not authorized.
type Check<T> = (...params: unknown[]) => Promise<T | null>;

interface Config<T> {
  provider: Provider<T>;
  check: Check<T>;
}

const useAuth = <T>({ provider, check }: Config<T>) => {
  const [state, setState] = useState<AuthState<T>>({ status: "idle" });
  // Through the subject we will start authorization.
  const authorizeAction = useMemo(() => new Subject<void>(), []);
  // To listen for actions we use the observable.
  const authorizeAction$ = useMemo(() => authorizeAction.asObservable(), []);

  const authorize = useCallback((): void => {
    // Next emits new action.
    authorizeAction.next();
  }, []);

  useEffect(() => {
    const sub = authorizeAction$
      .pipe(
        tap(() => {
          setState({ status: "checking" });
        }),
        switchMap(() =>
          // Promise casted to observable that checks you are authorized or not.
          from(check()).pipe(
            switchMap((data) => {
              // It's not authorized yet if data is null.
              const isAuthorized = !!data;

              if (isAuthorized) {
                setState({ status: "authorized", data });
                // EMPTY is returned to not close authorizeAction$ stream.
                return EMPTY;
              }

              setState({ status: "authorizing" });

              // Calling endpoint that checks for auth.
              return from(provider()).pipe(
                tap((data) => {
                  setState({ status: "authorized", data });
                })
              );
            })
          )
        ),
        catchError((error) => {
          // Handling errors.
          setState({
            status: "error",
            message: error?.message ?? "Unknown error"
          });
          return EMPTY;
        })
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return {
    state,
    authorize
  };
};

export { useAuth };
