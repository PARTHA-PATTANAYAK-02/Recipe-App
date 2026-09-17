/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import { HeartIcon } from "@animateicons/react/lucide";

import { useTheme } from "../context/ThemeContext";
import style from "../css/favoriteButton.module.css";

export default function FavoriteButton({ onClick, active = false }) {
  const heartRef = useRef(null);
  const [showAdded, setShowAdded] = useState(false);

  const { theme } = useTheme();

  /* =========================================================
     ADDED ANIMATION
     ========================================================= */

  useEffect(() => {
    if (!active) {
      setShowAdded(false);
      return;
    }

    setShowAdded(true);

    heartRef.current?.startAnimation();

    const timer = setTimeout(() => {
      setShowAdded(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [active]);

  /* =========================================================
     HOVER ANIMATION
     ========================================================= */

  const handleMouseEnter = () => {
    heartRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    if (!showAdded) {
      heartRef.current?.stopAnimation();
    }
  };

  /* =========================================================
     CLICK
     ========================================================= */

  const handleClick = () => {
    onClick();
  };

  return (
    <button
      className={`${style.button} ${
        theme === "dark" ? style.dark : style.light
      } ${active ? style.active : ""} ${showAdded ? style.adding : ""}`}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={style.icon} aria-hidden="true">
        <HeartIcon ref={heartRef} size={18} duration={0.8} />
      </span>

      <span className={style.text}>
        {active ? (showAdded ? "Added" : "Favorited") : "Favorite"}
      </span>
    </button>
  );
}
