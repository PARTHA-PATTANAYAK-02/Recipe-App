import { useTheme } from "../context/ThemeContext";

import style from "../css/loading.module.css";

export default function Loading() {
  const { theme } = useTheme();

  return (
    <div
      className={`${style.loadingContainer} ${
        theme === "dark" ? style.dark : style.light
      }`}
    >
      <div className={style.ambientGlow}></div>

      <div className={style.loaderWrapper}>
        <div className={style.loader}></div>

        <div className={style.loaderRing}></div>

        <div className={style.loaderDot}></div>
      </div>

      <div className={style.textWrapper}>
        <p className={style.loadingText}>Preparing something delicious...</p>

        <div className={style.dots}>
          <span className={style.dot}></span>

          <span className={style.dot}></span>

          <span className={style.dot}></span>
        </div>
      </div>
    </div>
  );
}
