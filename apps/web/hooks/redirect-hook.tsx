export default function useRedirectHook() {
  const getLocalStorageItem = (key: string) => {
    return typeof window !== "undefined"
      ? window.localStorage.getItem(key)
      : null;
  };
  let truthy = false;
  const token = getLocalStorageItem("chat-token");
  if (token) {
    truthy = true;
  }
  return truthy;
}
