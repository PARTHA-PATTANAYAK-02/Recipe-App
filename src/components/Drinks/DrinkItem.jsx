import style from "../../css/Drinks/drinkItem.module.css";
import { useTheme } from "../../context/ThemeContext";

export default function DrinkItem({ drink, onSelect }) {
  const { theme } = useTheme();

  return (
    <div
      className={`${style.item} ${theme === "dark" ? style.dark : style.light}`}
      onMouseDown={() => onSelect(drink)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(drink);
        }
      }}
    >
      <div className={style.imageWrapper}>
        <img
          className={style.img}
          src={drink.strDrinkThumb}
          alt={drink.strDrink}
          loading="lazy"
        />
      </div>

      <div className={style.info}>
        <span className={style.category}>DRINK</span>
        <span className={style.title}>{drink.strDrink}</span>
      </div>

      <span className={style.arrow}>→</span>
    </div>
  );
}
