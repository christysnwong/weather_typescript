import { useState, useEffect } from "react";

function useLocalStorage<T>(key : string, firstValue = null) {
  const json = JSON.parse(localStorage.getItem(key) || "{}");
  const initialValue : T = json.length > 0 ? json : firstValue;
  const [item, setItem] = useState<T>(initialValue);

  useEffect(
    function setKeyInLocalStorage() {

      if (item === null) {
        localStorage.removeItem(key);
        
      } else {
        localStorage.setItem(key, JSON.stringify(item));
      }
    },
    [key, item]
  );

  return [item, setItem] as const;
}

export default useLocalStorage;
