export function createRequire() {
  return () => {
    throw new Error("Node.js modules are unavailable in the browser.");
  };
}
