import { useEffect } from "react";

export const useCloseOnScroll = (
  isOpen: boolean,
  onClose: () => void,
): void => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose]);
};