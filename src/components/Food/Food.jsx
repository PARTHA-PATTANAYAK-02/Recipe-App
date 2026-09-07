/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

import style from "../../css/Food/food.module.css";

import Loading from "../Loading";
import Error from "../Error";
import EmptyMessage from "../EmptyMessage";
import FoodModal from "./FoodModal";

import {
  FaUtensils,
  FaGlobeAmericas,
  FaArrowRight,
  FaPlay,
  FaBookOpen,
} from "react-icons/fa";

const URL = import.meta.env.VITE_MEAL_API_URL;

export default function Food({ query, foodSearchTrigger }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalMeal, setModalMeal] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!query?.trim()) {
      // setMeals([]);
      setError("");
      return;
    }

    async function getFood() {
      try {
        setLoading(true);
        setError("");
        setMeals([]);
        setVisibleCount(12);

        const res = await fetch(
          `${URL}/search.php?s=${encodeURIComponent(query)}`,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const result = await res.json();

        if (!result.meals) {
          setMeals([]);
          return;
        }

        setMeals(result.meals);
      } catch (e) {
        if (e.message === "Failed to fetch") {
          setError("No Internet Connection.");
        } else {
          setError(e.message);
        }

        setMeals([]);
      } finally {
        setLoading(false);
      }
    }

    getFood();
    setSearchQuery(query);
  }, [foodSearchTrigger]);

  useEffect(() => {
    document.body.style.overflow = modalMeal ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalMeal]);

  const visibleMeals = meals.slice(0, visibleCount);

  const hasMore = visibleCount < meals.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const openMeal = (meal) => {
    setModalMeal(meal);
  };

  const closeMeal = () => {
    setModalMeal(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  // if (!query?.trim() && !meals) {
  //   return (
  //     <EmptyMessage
  //       msg1="Discover something delicious."
  //       msg2="Search for a food and explore recipes from around the world."
  //       emoji="🍽️"
  //     />
  //   );
  // }

  // if (!meals.length) {
  //   return (
  //     <EmptyMessage
  //       msg1="No food found."
  //       msg2={`We couldn't find any recipe for "${query}". Try another search.`}
  //       emoji="🥣"
  //     />
  //   );
  // }
  if (!searchQuery && !meals.length) {
    return (
      <EmptyMessage
        msg1="Discover something delicious."
        msg2="Search for a food and explore recipes from around the world."
        emoji="🍽️"
      />
    );
  }

  if (searchQuery && !meals.length) {
    return (
      <EmptyMessage
        msg1="No food found."
        msg2={`We couldn't find any recipe for "${searchQuery}". Try another search.`}
        emoji="🥣"
      />
    );
  }

  return (
    <main className={style.pageWrapper}>
      <div className={style.foodContainer}>
        {/* =================================================
            HEADER
        ================================================= */}

        <header className={style.foodHeader}>
          <div className={style.headerTop}>
            <div className={style.foodLabel}>
              <span>✦</span>
              FOOD RECIPES
            </div>

            <div className={style.resultCount}>
              {meals.length} RECIPES FOUND
            </div>
          </div>

          <div className={style.headerMain}>
            <div className={style.titleBlock}>
              <p className={style.headerEyebrow}>SEARCHING THE KITCHEN</p>

              <h1>
                Recipes for <span>"{searchQuery}"</span>
              </h1>
            </div>

            <p className={style.headerDescription}>
              Explore recipes, ingredients and cooking ideas from different
              cuisines. Tap any recipe to see the full details.
            </p>
          </div>
        </header>

        {/* =================================================
            SMALL INFO BAR
        ================================================= */}

        <div className={style.infoBar}>
          <div className={style.infoLeft}>
            <div className={style.infoIcon}>
              <FaBookOpen />
            </div>

            <div>
              <span>YOUR SEARCH</span>
              <strong>{searchQuery}</strong>
            </div>
          </div>

          <div className={style.infoRight}>
            <span>
              Showing <strong>{visibleMeals.length}</strong>
            </span>

            <span className={style.infoDivider}>/</span>

            <span>
              <strong>{meals.length}</strong> recipes
            </span>
          </div>
        </div>

        {/* =================================================
            FOOD GRID
        ================================================= */}

        <section className={style.resultsSection}>
          <div className={style.sectionHeader}>
            <div>
              <span>FRESH FROM THE KITCHEN</span>

              <h2>
                Pick a recipe
                <em>.</em>
              </h2>
            </div>

            <p>Click a card to explore the complete recipe.</p>
          </div>

          <div className={style.foodGrid}>
            {visibleMeals.map((meal, index) => {
              const ingredientCount = getIngredients(meal).length;

              const hasVideo = Boolean(meal.strYoutube?.trim());

              return (
                <article
                  key={meal.idMeal}
                  className={style.foodCard}
                  style={{
                    "--card-delay": `${index * 0.045}s`,
                  }}
                  onClick={() => openMeal(meal)}
                >
                  {/* IMAGE */}

                  <div className={style.cardImage}>
                    {meal.strMealThumb ? (
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className={style.imageFallback}
                      style={{
                        display: meal.strMealThumb ? "none" : "flex",
                      }}
                    >
                      🍽️
                    </div>

                    <div className={style.imageOverlay}></div>

                    <span className={style.cardNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {hasVideo && (
                      <span className={style.videoBadge}>
                        <FaPlay />
                        VIDEO
                      </span>
                    )}

                    <span className={style.viewBadge}>
                      VIEW RECIPE
                      <FaArrowRight />
                    </span>
                  </div>

                  {/* BODY */}

                  <div className={style.cardBody}>
                    <div className={style.cardMeta}>
                      {meal.strCategory && <span>{meal.strCategory}</span>}

                      {meal.strArea && (
                        <span className={style.areaMeta}>
                          <FaGlobeAmericas />
                          {meal.strArea}
                        </span>
                      )}
                    </div>

                    <h3>{meal.strMeal}</h3>

                    <div className={style.cardDetails}>
                      <div>
                        <FaUtensils />

                        <span>{ingredientCount} ingredients</span>
                      </div>

                      {meal.strCountry && (
                        <div>
                          <span>{meal.strCountry}</span>
                        </div>
                      )}
                    </div>

                    <div className={style.cardFooter}>
                      <span>Explore recipe</span>

                      <div className={style.footerArrow}>
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* =================================================
              LOAD MORE
          ================================================= */}

          {hasMore && (
            <div className={style.loadMoreArea}>
              <button
                type="button"
                className={style.loadMoreButton}
                onClick={loadMore}
              >
                <span>Load More Recipes</span>

                <small>
                  {visibleMeals.length} / {meals.length}
                </small>

                <FaArrowRight />
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            BOTTOM NOTE
        ================================================= */}

        <div className={style.bottomNote}>
          <div className={style.bottomIcon}>🍴</div>

          <div>
            <span>COOK SOMETHING GOOD</span>

            <p>
              Choose a recipe, gather your ingredients, and enjoy the process.
            </p>
          </div>

          <div className={style.bottomStar}>✦</div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className={style.footer}>
          <span>FOOD DISCOVERY</span>

          <span>{meals.length} recipes</span>

          <span>Made for food lovers ✦</span>
        </footer>
      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {modalMeal && <FoodModal data={modalMeal} onClose={closeMeal} />}
    </main>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();

    const measure = meal[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push({
        ingredient,
        measure,
      });
    }
  }

  return ingredients;
}
