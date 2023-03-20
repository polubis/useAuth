import { useState } from "react";
import { Timeline, DataSetsKeys, DATA_SETS } from "./timeline";
import { useMyAppAuth } from "./useMyAppAuth";

function App() {
  const [current, setCurrent] = useState(DATA_SETS.BIG);
  const { state, authorize } = useMyAppAuth();

  if (state.status === "idle") {
    // Happens when authorize is never called.
    return null;
  }

  if (state.status === "checking" || state.status === "authorizing") {
    // Showing spinner when authorizing...
    return <div>Authorizing...</div>;
  }

  // This means API failed.
  if (state.status === "error") {
    return <button onClick={authorize}>Error - authorize again.</button>;
  }

  // We want to render only if authorized.
  if (state.status === "authorized") {
    return (
      <>
        <button onClick={authorize}>Revalidate authorization</button>

        <Timeline data={current.data} />

        <div
          style={{
            display: "flex",
            padding: "24px"
          }}
        >
          {(Object.keys(DATA_SETS) as DataSetsKeys[]).map((key) => (
            <button
              key={key}
              style={{
                marginRight: "24px",
                padding: "12px",
                cursor: "pointer",
                borderRadius: "4px"
              }}
              onClick={() => setCurrent(DATA_SETS[key])}
            >
              {DATA_SETS[key].label}
            </button>
          ))}
        </div>
      </>
    );
  }

  throw new Error(
    "What the hek you are doing. There is unsupported status handled..."
  );
}

export default App;
