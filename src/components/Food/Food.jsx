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

export default function Food({
  query,
  foodSearchTrigger,
  fromFavorites,
  setFromFavorites,
  setMenu,
  modalMeal,
  setModalMeal,
}) {
  /* =======================================================
     STATES
     ======================================================= */

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  /* =======================================================
     CATEGORY FILTER
     ======================================================= */

  const [filter, setFilter] = useState("all");

  /* =======================================================
     SORT
     ======================================================= */

  const [sort, setSort] = useState("default");

  /* =======================================================
     FETCH FOOD
     ======================================================= */

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

        // Every new search starts from the default state.
        setFilter("all");
        setSort("default");

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

  /* =======================================================
     MODAL BODY SCROLL
     ======================================================= */

  useEffect(() => {
    document.body.style.overflow = modalMeal ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalMeal]);

  /* =======================================================
     AVAILABLE CATEGORIES
     
     Categories are generated only from the current
     search results. Nothing is hard-coded.
     ======================================================= */

  const categories = [
    "all",
    ...Array.from(
      new Set(meals.map((meal) => meal.strCategory?.trim()).filter(Boolean)),
    ),
  ];

  /* =======================================================
     CATEGORY FILTER
     ======================================================= */

  const filteredMeals =
    filter === "all"
      ? meals
      : meals.filter((meal) => meal.strCategory?.trim() === filter);

  /* =======================================================
     SORT FILTERED MEALS
     
     Important:
     Sort is applied AFTER category filtering.
     So if Chicken is selected, A-Z/Z-A only sorts
     the Chicken recipes.
     ======================================================= */

  const sortedMeals = [...filteredMeals].sort((a, b) => {
    if (sort === "az") {
      return a.strMeal.localeCompare(b.strMeal);
    }

    if (sort === "za") {
      return b.strMeal.localeCompare(a.strMeal);
    }

    return 0;
  });

  /* =======================================================
     VISIBLE MEALS
     ======================================================= */

  const visibleMeals = sortedMeals.slice(0, visibleCount);

  const hasMore = visibleCount < sortedMeals.length;

  /* =======================================================
     FILTER CHANGE
     ======================================================= */

  const handleFilterChange = (category) => {
    setFilter(category);
    setVisibleCount(12);
  };

  /* =======================================================
     SORT CHANGE
     ======================================================= */

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setVisibleCount(12);
  };

  /* =======================================================
     LOAD MORE
     ======================================================= */

  const loadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  /* =======================================================
     OPEN MODAL
     ======================================================= */

  const openMeal = (meal) => {
    setModalMeal(meal);
  };

  /* =======================================================
     CLOSE MODAL
     ======================================================= */

  const closeMeal = () => {
    setModalMeal(null);
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return <Loading />;
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error) {
    return <Error error={error} />;
  }

  /* =======================================================
     EMPTY — INITIAL
     ======================================================= */

  if (!searchQuery && !meals.length && !modalMeal) {
    return (
      <EmptyMessage
        msg1="Discover something delicious."
        msg2="Search for a food and explore recipes from around the world."
        emoji="🍽️"
      />
    );
  }

  /* =======================================================
     EMPTY — SEARCH RESULT
     ======================================================= */

  if (searchQuery && !meals.length && !modalMeal) {
    return (
      <EmptyMessage
        msg1="No food found."
        msg2={`We couldn't find any recipe for "${searchQuery}". Try another search.`}
        emoji="🥣"
      />
    );
  }

  /* =======================================================
     UI
     ======================================================= */

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
            INFO BAR
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
              <strong>{sortedMeals.length}</strong> recipes
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

          {/* =================================================
              FILTER + SORT
          ================================================= */}

          {categories.length > 1 && (
            <div className={style.filterSortBar}>
              {/* ================= CATEGORY FILTER ================= */}

              <div className={style.categoryFilter}>
                <div className={style.filterHeading}>
                  <span>FILTER BY</span>
                </div>

                <div className={style.categoryList}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`${style.categoryButton} ${
                        filter === category ? style.activeCategory : ""
                      }`}
                      onClick={() => handleFilterChange(category)}
                      aria-pressed={filter === category}
                    >
                      {category === "all" ? "All" : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= SORT ================= */}

              <div className={style.sortControl}>
                <span className={style.sortLabel}>SORT</span>

                <div className={style.sortSelectWrapper}>
                  <select
                    value={sort}
                    onChange={handleSortChange}
                    className={style.sortSelect}
                    aria-label="Sort recipes"
                  >
                    <option value="default">Default</option>
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                  </select>

                  <span className={style.sortArrow}>⌄</span>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              FILTERED + SORTED FOOD GRID
          ================================================= */}

          {sortedMeals.length > 0 ? (
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
          ) : (
            <div className={style.noCategoryResults}>
              <span>✦</span>
              <p>No recipes found in this category.</p>
            </div>
          )}

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
                  {visibleMeals.length} / {sortedMeals.length}
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

          <span>{sortedMeals.length} recipes</span>

          <span>Made for food lovers ✦</span>
        </footer>
      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {modalMeal && (
        <FoodModal
          data={modalMeal}
          onClose={closeMeal}
          fromFavorites={fromFavorites}
          setFromFavorites={setFromFavorites}
          setMenu={setMenu}
        />
      )}
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
