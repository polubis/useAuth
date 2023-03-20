import { useCallback, useEffect, useState, useMemo } from "react";
import { catchError, EMPTY, from, Subject, switchMap, tap } from "rxjs";

// A set of interfaces that represent the data variants.
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

// Union of interfaces - these will be variants of our state.
type AuthState<T> =
  | IdleState
  | CheckingState
  | AuthorizingState
  | AuthorizedState<T>
  | AuthorizationErrorState;

// Function definition with API query for authorization.
type Provider<T> = (...params: unknown[]) => Promise<T>;
// Function that returns data about authorized user or null if he is not authorized.
type Check<T> = (...params: unknown[]) => Promise<T | null>;

// Such an object will be handed over to hook.
interface Config<T> {
  provider: Provider<T>;
  check: Check<T>;
}

const useAuth = <T>({ provider, check }: Config<T>) => {
  const [state, setState] = useState<AuthState<T>>({ status: "idle" });
  // Subject object to trigger actions.
  const authorizeAction = useMemo(() => new Subject<void>(), []);
  // Cast to observable to listen to actions.
  const authorizeAction$ = useMemo(() => authorizeAction.asObservable(), []);

  // Simple function to trigger action.
  const authorize = useCallback((): void => {
    authorizeAction.next();
  }, []);

  // Subscription to actions stream and logic definition.
  useEffect(() => {
    // Authorization logic for checking is user authorized or not.
    const sub = authorizeAction$
      .pipe(
        tap(() => {
          setState({ status: "checking" });
        }),
        switchMap(() =>
          // Promise casted to observable that checks you are authorized or not.
          from(check()).pipe(
            switchMap((data) => {
              // If null it means it's not authorized yet.
              const isAuthorized = !!data;

              if (isAuthorized) {
                setState({ status: "authorized", data });
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
          // Handling all errors.
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
