/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../css/Recipe/foodList.module.css";
import FoodItem from "./FoodItem";

const URL = import.meta.env.VITE_MEAL_API_URL;

export default function FoodList({ query, setQuery }) {
  const navigate = useNavigate();

  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFood() {
      try {
        setError("");
        setLoading(true);

        const res = await fetch(
          `${URL}/search.php?s=${encodeURIComponent(query)}`,
        );

        if (!res.ok) {
          throw new Error("Unknown Error");
        }

        const data = await res.json();

        if (!data.meals || data.meals.length === 0) {
          setError("Not found");
          setFoodData([]);
          return;
        }

        setFoodData(data.meals);
      } catch (e) {
        if (e.message === "Failed to fetch") {
          setError("No Internet Connection.");
        } else {
          setError(e.message);
        }

        setFoodData([]);
      } finally {
        setLoading(false);
      }
    }

    if (query.trim() === "") {
      setFoodData([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      fetchFood();
    }, 700);

    return () => clearTimeout(timer);
  }, [query]);

  if (!loading && !error && foodData.length === 0) {
    return (
      <div className={style.foodList}>
        <div className={style.empty}>
          <span className={style.emptyIcon}>🍽️</span>

          <div className={style.emptyText}>Start discovering</div>

          <div className={style.emptySubtext}>
            Search results will appear here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.foodList}>
      <div className={style.listHeader}>
        <span className={style.listTitle}>Recipe suggestions</span>

        {!loading && !error && foodData.length > 0 && (
          <span className={style.resultCount}>{foodData.length} found</span>
        )}
      </div>

      {loading && (
        <div className={style.loading}>
          <div className={style.loader}></div>

          <div>
            <span className={style.loadingText}>Looking for recipes...</span>

            <span className={style.loadingSubtext}>
              Finding something delicious
            </span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className={style.error}>
          <span className={style.errorIcon}>😕</span>

          <span className={style.errorText}>{error}</span>

          {error === "No Internet Connection." && (
            <span className={style.errorSubtext}>
              Please check your connection
            </span>
          )}

          {error === "Not found" && (
            <span className={style.errorSubtext}>
              Try searching for something else
            </span>
          )}
        </div>
      )}

      {!loading &&
        !error &&
        foodData.map((food) => (
          <FoodItem
            key={food.idMeal}
            food={food}
            onSelect={(selectedFood) => {
              if (!selectedFood?.idMeal) return;

              setQuery("");
              navigate(`/recipes/${selectedFood.idMeal}`);
            }}
          />
        ))}
    </div>
  );
}
