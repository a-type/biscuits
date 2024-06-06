import { useEffect, useState } from 'react';
import { getIsTouch } from '../platform.js';

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(getIsTouch);
  useEffect(() => {
    function update() {
      setIsTouch(getIsTouch());
    }
    window.addEventListener('touchstart', update);
    return () => {
      window.removeEventListener('touchstart', update);
    };
  }, []);
  return isTouch;
}
