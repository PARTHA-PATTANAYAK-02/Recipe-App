import { useTheme } from "../context/ThemeContext";
import style from "../css/error.module.css";

export default function Error({ message }) {
  const { theme } = useTheme();

  return (
    <div
      className={`${style.errorContainer} ${
        theme === "dark" ? style.dark : style.light
      }`}
    >
      <div className={style.errorCard}>
        <div className={style.cardGlow}></div>

        <div className={style.errorIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className={style.errorContent}>
          <span className={style.errorLabel}>SOMETHING WENT WRONG</span>

          <h3 className={style.errorTitle}>We couldn't load that</h3>

          <p className={style.errorText}>{message}</p>
        </div>

        <div className={style.errorAccent}>
          <span></span>
          <i></i>
          <span></span>
        </div>
      </div>
    </div>
  );
}
