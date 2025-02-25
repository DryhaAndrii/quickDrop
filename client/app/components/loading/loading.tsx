import ReactDOM from "react-dom";
import { useState } from "react";

function Loading({ isShow }: { isShow: boolean }) {
  if (!isShow || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[150]">
      <div className="bg-background p-5 rounded-lg shadow-defaultShadow">
        <h1 className="text-lg font-bold text-foreground">Loading...</h1>
      </div>
    </div>,
    document.body
  );
}

export function useLoading() {
  const [isShow, setIsShow] = useState(false);

  return {
    isShow,
    showLoading: () => setIsShow(true),
    hideLoading: () => setIsShow(false),
  };
}

export default Loading;
