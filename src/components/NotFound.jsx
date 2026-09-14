import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  HouseIcon,
  SearchIcon,
} from "@animateicons/react/lucide";

import style from "../css/notFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  const arrowRef = useRef(null);
  const homeRef = useRef(null);

  const handleHome = () => {
    navigate("/");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleHomeMouseEnter = () => {
    homeRef.current?.startAnimation();
  };

  const handleHomeMouseLeave = () => {
    homeRef.current?.stopAnimation();
  };

  const handleBackMouseEnter = () => {
    arrowRef.current?.startAnimation();
  };

  const handleBackMouseLeave = () => {
    arrowRef.current?.stopAnimation();
  };

  return (
    <main className={style.page}>
      {/* BACKGROUND DECORATIONS */}

      <div className={style.glowOne}></div>
      <div className={style.glowTwo}></div>

      <div className={style.circleOne}></div>
      <div className={style.circleTwo}></div>

      {/* FLOATING FOOD DECORATIONS */}

      <div className={`${style.foodFloat} ${style.foodOne}`}>🍋</div>

      <div className={`${style.foodFloat} ${style.foodTwo}`}>🌿</div>

      <div className={`${style.foodFloat} ${style.foodThree}`}>🍅</div>

      <div className={`${style.foodFloat} ${style.foodFour}`}>🥕</div>

      {/* MAIN CONTENT */}

      <section className={style.content}>
        {/* ICON */}

        <div className={style.iconScene}>
          <div className={style.iconGlow}></div>

          <div className={style.plate}>
            <div className={style.plateInner}>
              <span>🍽️</span>
            </div>
          </div>

          <div className={`${style.sparkle} ${style.sparkleOne}`}>✦</div>

          <div className={`${style.sparkle} ${style.sparkleTwo}`}>✦</div>

          <div className={`${style.sparkle} ${style.sparkleThree}`}>·</div>
        </div>

        {/* EYEBROW */}

        <div className={style.eyebrow}>
          <span className={style.eyebrowDot}></span>
          RECIPE NOT FOUND
        </div>

        {/* 404 */}

        <div className={style.errorNumber} aria-hidden="true">
          <span>4</span>

          <div className={style.errorPlate}>
            <div className={style.errorPlateInner}>🍴</div>
          </div>

          <span>4</span>
        </div>

        {/* TITLE */}

        <h1 className={style.title}>
          Looks like this recipe
          <br />
          wandered off.
        </h1>

        {/* DESCRIPTION */}

        <p className={style.description}>
          We searched the kitchen, checked the cookbook,
          <br className={style.desktopBreak} />
          but this page doesn't seem to exist.
        </p>

        {/* ACTIONS */}

        <div className={style.actions}>
          {/* BACK */}

          <button
            type="button"
            className={style.backButton}
            onClick={handleBack}
            onMouseEnter={handleBackMouseEnter}
            onMouseLeave={handleBackMouseLeave}
          >
            <span className={style.backIcon} aria-hidden="true">
              <ArrowLeftIcon ref={arrowRef} size={17} duration={0.8} />
            </span>

            <span>Go Back</span>
          </button>

          {/* HOME */}

          <button
            type="button"
            className={style.homeButton}
            onClick={handleHome}
            onMouseEnter={handleHomeMouseEnter}
            onMouseLeave={handleHomeMouseLeave}
          >
            <span className={style.homeIcon} aria-hidden="true">
              <HouseIcon ref={homeRef} size={17} duration={0.8} />
            </span>

            <span>Back to Home</span>
          </button>
        </div>

        {/* SMALL HINT */}

        <div className={style.hint}>
          <span className={style.hintIcon}>
            <SearchIcon size={13} />
          </span>

          <span>Try exploring our recipes instead</span>
        </div>
      </section>
    </main>
  );
}
