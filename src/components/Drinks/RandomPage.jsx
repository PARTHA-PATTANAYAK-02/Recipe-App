/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import style from "../../css/Drinks/random.module.css";
import Loading from "../Loading";
import ErrorPage from "../Error";
import FavoriteButton from "../FavoriteButton";
import BackToFavorites from "../BackToFavorites";
import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_DRINK_API_URL;

export default function RandomPage({
  fromFavorites,
  setFromFavorites,
  setMenu,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    if (!data) return;

    const exists = favorites.some(
      (item) => item.type === "drink" && item.id === data.idDrink,
    );

    setIsFavorite(exists);
  }, [data, favorites]);
  const addFavorite = () => {
    const newFavorite = {
      type: "drink",
      id: data.idDrink,
      name: data.strDrink,
      image: data.strDrinkThumb,
      data: data,
    };

    const updatedFavorites = [...favorites, newFavorite];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  const removeFavorite = () => {
    const updatedFavorites = favorites.filter(
      (item) => !(item.type === "drink" && item.id === data.idDrink),
    );

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  const handleBackToFavorites = () => {
    setFromFavorites(false);
    setMenu(5);
  };
  useEffect(() => {
    async function fetchRandomDrink() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${URL}/random.php`);

        if (!res.ok) {
          throw new Error("Unable to fetch a random drink");
        }

        const result = await res.json();

        if (!result.drinks || result.drinks.length === 0) {
          setError("No drink found");
          setData(null);
          return;
        }

        setData(result.drinks[0]);
      } catch (e) {
        if (e.message === "Failed to fetch")
          setError("No Internet Connection.");
        else setError(e.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomDrink();
  }, [refreshKey]);

  function handleRefresh() {
    setData(null);
    setRefreshKey((prev) => prev + 1);
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <section className={style.randomPage}>
        <div className={style.errorWrapper}>
          <ErrorPage message={error} />

          <button
            className={style.refreshButton}
            onClick={handleRefresh}
            type="button"
          >
            <span className={style.refreshIcon}>↻</span>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = data[`strIngredient${i}`];
    const measure = data[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({
        ingredient,
        measure: measure?.trim() || "",
      });
    }
  }

  return (
    <main className={style.randomPage}>
      <div className={style.backgroundGlow}></div>
      <div className={style.backgroundGlowTwo}></div>

      {/* ================= HERO ================= */}

      <section className={style.hero}>
        <div className={style.heading}>
          <span className={style.eyebrow}>✦ RANDOM DRINK DISCOVERY</span>

          <h1>
            Discover your
            <span> next favorite.</span>
          </h1>

          <p>
            Let the surprise decide. Explore a randomly selected drink and
            discover something deliciously unexpected.
          </p>
        </div>

        <button
          className={style.refreshButton}
          onClick={handleRefresh}
          type="button"
        >
          <span className={style.refreshIcon}>↻</span>
          <span>Discover Another</span>
        </button>
      </section>

      {/* ================= MAIN CARD ================= */}

      <section className={style.drinkCard}>
        {/* ================= IMAGE ================= */}

        <div className={style.imageSection}>
          <div className={style.imageGlow}></div>

          <div className={style.imageRing}></div>

          <div className={style.imageWrapper}>
            <img
              src={data.strDrinkThumb}
              alt={data.strDrink}
              className={style.drinkImage}
            />
          </div>

          <div className={style.floatingBadge}>
            <span>✦</span>
            Random Pick
          </div>
        </div>

        {/* ================= DETAILS ================= */}

        <div className={style.contentSection}>
          <div className={style.metaRow}>
            {data.strCategory && (
              <span className={style.metaPill}>
                <span>◈</span>
                {data.strCategory}
              </span>
            )}

            {data.strAlcoholic && (
              <span className={style.metaPill}>
                <span>●</span>
                {data.strAlcoholic}
              </span>
            )}

            {data.strGlass && (
              <span className={style.metaPill}>
                <span>◇</span>
                {data.strGlass}
              </span>
            )}
          </div>

          <div className={style.titleBlock}>
            <span className={style.smallLabel}>TODAY&apos;S DISCOVERY</span>

            <h2>{data.strDrink}</h2>

            {data.strDrinkAlternate && (
              <p className={style.alternateName}>
                Also known as {data.strDrinkAlternate}
              </p>
            )}

            <FavoriteButton
              active={isFavorite}
              onClick={isFavorite ? removeFavorite : addFavorite}
            />

            {fromFavorites && (
              <BackToFavorites onClick={handleBackToFavorites} />
            )}
          </div>

          {/* ================= QUICK INFO ================= */}

          <div className={style.quickInfo}>
            <div className={style.infoCard}>
              <div className={style.infoIcon}>◉</div>

              <div>
                <span>Serve in</span>
                <strong>{data.strGlass || "Not specified"}</strong>
              </div>
            </div>

            <div className={style.infoCard}>
              <div className={style.infoIcon}>◈</div>

              <div>
                <span>Category</span>
                <strong>{data.strCategory || "Not specified"}</strong>
              </div>
            </div>

            <div className={style.infoCard}>
              <div className={style.infoIcon}>●</div>

              <div>
                <span>Type</span>
                <strong>{data.strAlcoholic || "Not specified"}</strong>
              </div>
            </div>
          </div>

          <div className={style.divider}></div>

          {/* ================= INGREDIENTS ================= */}

          <div className={style.ingredientsSection}>
            <div className={style.sectionHeader}>
              <div>
                <span className={style.sectionLabel}>WHAT YOU NEED</span>

                <h3>Ingredients</h3>
              </div>

              <span className={style.ingredientCount}>
                {ingredients.length}{" "}
                {ingredients.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className={style.ingredientsList}>
              {ingredients.map((item, index) => (
                <div
                  className={style.ingredient}
                  key={`${item.ingredient}-${index}`}
                >
                  <span className={style.ingredientNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className={style.ingredientName}>
                    {item.ingredient}
                  </span>

                  {item.measure && (
                    <span className={style.measure}>{item.measure}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= INSTRUCTIONS ================= */}

        <div className={style.instructionsSection}>
          <div className={style.instructionsHeader}>
            <span className={style.sectionLabel}>THE PERFECT POUR</span>

            <h3>How to make it</h3>
          </div>

          <div className={style.instructionContent}>
            <span className={style.quoteMark}>“</span>

            <p>{data.strInstructions}</p>

            <span className={style.quoteMark}>”</span>
          </div>

          <button
            className={style.bottomRefresh}
            onClick={handleRefresh}
            type="button"
          >
            <span>↻</span>
            Surprise Me Again
          </button>
        </div>
      </section>
    </main>
  );
}
