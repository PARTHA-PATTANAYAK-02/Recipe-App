import { useTheme } from "../context/ThemeContext";
import style from "../css/emptymessage.module.css";

export default function EmptyMessage({ msg1, msg2, emoji }) {
  const { theme } = useTheme();

  return (
    <div
      className={`${style.emptyContainer} ${
        theme === "dark" ? style.dark : style.light
      }`}
    >
      <div className={`${style.decor} ${style.decorOne}`}></div>
      <div className={`${style.decor} ${style.decorTwo}`}></div>

      <div className={style.emptyCard}>
        <div className={style.cardGlow}></div>

        <div className={style.emojiWrapper}>
          <span className={style.emojiRing}></span>
          <span className={style.emptyEmoji}>{emoji}</span>
        </div>

        <div className={style.smallLabel}>
          <span></span>
          NOTHING HERE YET
          <span></span>
        </div>

        <h3>{msg1}</h3>

        <p>{msg2}</p>

        <div className={style.bottomAccent}>
          <span></span>
          <i></i>
          <span></span>
        </div>
      </div>
    </div>
  );
}
