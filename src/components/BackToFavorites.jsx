import { useRef } from "react";
import style from "../css/backToFavorites.module.css";
import { ArrowLeftIcon } from "@animateicons/react/lucide";

export default function BackToFavorites({ onClick }) {
  const arrowRef = useRef(null);

  const handleMouseEnter = () => {
    arrowRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    arrowRef.current?.stopAnimation();
  };

  return (
    <button
      className={style.button}
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Back to Favorites"
    >
      <span className={style.arrow} aria-hidden="true">
        <ArrowLeftIcon ref={arrowRef} size={18} duration={0.8} />
      </span>

      <span className={style.text}>Back to Favorites</span>
    </button>
  );
}
