import { useTheme } from "../../context/ThemeContext";
import style from "../../css/Recipe/foodItem.module.css";

export default function FoodItem({ food, onSelect }) {
  const { theme } = useTheme();

  return (
    <div
      className={`${style.item} ${theme === "dark" ? style.dark : style.light}`}
      onMouseDown={() => onSelect(food)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(food);
        }
      }}
    >
      <div className={style.imageWrapper}>
        <img
          className={style.img}
          src={food.strMealThumb}
          alt={food.strMeal}
          loading="lazy"
        />
      </div>

      <div className={style.info}>
        <span className={style.category}>RECIPE</span>

        <span className={style.title}>{food.strMeal}</span>
      </div>

      <span className={style.arrow}>→</span>
    </div>
  );
}
