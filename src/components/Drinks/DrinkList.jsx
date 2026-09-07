/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import style from "../../css/Drinks/drinkList.module.css";
import DrinkItem from "./DrinkItem";

const URL = import.meta.env.VITE_DRINK_API_URL;

export default function DrinkList({ query, setQuery, setDrinkId }) {
  const [drinkData, setDrinkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDrink() {
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

        if (!data.drinks) {
          setError("Not found");
          setDrinkData([]);
          return;
        }

        setDrinkData(data.drinks);
      } catch (e) {
        if (e.message === "Failed to fetch") {
          setError("No Internet Connection.");
        } else {
          setError(e.message);
        }

        setDrinkData([]);
      } finally {
        setLoading(false);
      }
    }

    if (query.trim() === "") {
      setDrinkData([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      fetchDrink();
    }, 700);

    return () => clearTimeout(timer);
  }, [query]);

  if (!loading && !error && drinkData.length === 0) {
    return (
      <div className={style.drinkList}>
        <div className={style.empty}>
          <span className={style.emptyIcon}>🍹</span>
          <div className={style.emptyText}>Start discovering</div>
          <div className={style.emptySubtext}>
            Your next favorite drink could be here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.drinkList}>
      <div className={style.listHeader}>
        <span className={style.listTitle}>Drink suggestions</span>

        {!loading && !error && drinkData.length > 0 && (
          <span className={style.resultCount}>{drinkData.length} found</span>
        )}
      </div>

      {loading && (
        <div className={style.loading}>
          <div className={style.loader}></div>

          <div>
            <span className={style.loadingText}>Looking for drinks...</span>

            <span className={style.loadingSubtext}>
              Finding something refreshing
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
        drinkData.map((drink) => (
          <DrinkItem
            key={drink.idDrink}
            drink={drink}
            onSelect={(selectedDrink) => {
              setDrinkId(selectedDrink.idDrink);
              setQuery(selectedDrink.strDrink);
            }}
          />
        ))}
    </div>
  );
}
