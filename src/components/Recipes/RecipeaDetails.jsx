/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import style from "../../css/Recipe/recipeadetails.module.css";

import Loading from "../Loading";
import ErrorComp from "../Error";
import EmptyMessage from "../EmptyMessage";
import FavoriteButton from "../FavoriteButton";
import BackToFavorites from "../BackToFavorites";
import MealPlannerButton from "../new/MealPlannerButton";
import {
  FaUtensils,
  FaGlobeAmericas,
  FaTag,
  FaBookOpen,
  FaPlay,
  FaExternalLinkAlt,
  FaLeaf,
  FaMapMarkerAlt,
  FaArrowRight,
  FaDice,
} from "react-icons/fa";

const URL = import.meta.env.VITE_MEAL_API_URL;

export default function RecipeaDetails({
  foodId,
  handleRandomRecipe,
  fromFavorites,
  setFromFavorites,
  setMenu,
}) {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");

    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleBackToFavorites = () => {
    setFromFavorites(false);
    setMenu(5);
  };

  useEffect(() => {
    if (!foodId) {
      setMeal(null);
      setError("");
      return;
    }

    async function fetchMealDetails() {
      setLoading(true);
      setError("");
      setMeal(null);

      try {
        const res = await fetch(`${URL}/lookup.php?i=${foodId}`);

        if (!res.ok) {
          throw new Error(
            `Failed to fetch recipe details (Status: ${res.status})`,
          );
        }

        const data = await res.json();

        if (!data.meals || data.meals.length === 0) {
          throw new Error("Recipe not found.");
        }

        setMeal(data.meals[0]);
      } catch (err) {
        if (err.message === "Failed to fetch") {
          setError("No Internet Connection.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMealDetails();
  }, [foodId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComp message={error} />;
  }

  if (!foodId) {
    return (
      <EmptyMessage
        msg1="Choose something delicious."
        msg2="Search for a recipe and discover how to make it."
        emoji="🍳"
      />
    );
  }

  if (!meal) {
    return null;
  }

  const {
    idMeal,
    strMeal,
    strCategory,
    strArea,
    strCountry,
    strInstructions,
    strMealThumb,
    strTags,
    strYoutube,
    strSource,
    dateModified,
  } = meal;

  const isFavorite = favorites.some(
    (item) => item.type === "recipe" && item.id === idMeal,
  );

  const addFavorite = () => {
    const newFavorite = {
      type: "recipe",
      id: idMeal,
      name: strMeal,
      image: strMealThumb,
    };

    const updatedFavorites = [...favorites, newFavorite];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFavorite = () => {
    const updatedFavorites = favorites.filter(
      (item) => !(item.type === "recipe" && item.id === idMeal),
    );

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

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

  const tags = strTags
    ? strTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const instructions = strInstructions
    ? strInstructions
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split(/\n+/)
        .map((step) => step.trim())
        .filter(Boolean)
    : [];

  const youtubeId = getYoutubeId(strYoutube);

  return (
    <main className={style.recipePage}>
      <div className={style.backgroundShapeOne}></div>
      <div className={style.backgroundShapeTwo}></div>

      <div className={style.recipeContainer}>
        {/* DISCOVER RANDOM RECIPE BUTTON */}

        <div className={style.discoverWrapper}>
          <button
            type="button"
            className={style.discoverButton}
            onClick={handleRandomRecipe}
          >
            <span className={style.discoverIcon}>
              <FaDice />
            </span>

            <span>Discover Random Recipe</span>

            <FaArrowRight className={style.discoverArrow} />
          </button>
        </div>

        {/* HERO */}

        <section className={style.heroSection}>
          <div className={style.heroImageArea}>
            <div className={style.heroImageFrame}>
              <div className={style.imageGlow}></div>

              {strMealThumb ? (
                <img
                  src={strMealThumb}
                  alt={strMeal}
                  className={style.heroImage}
                />
              ) : (
                <div className={style.imageFallback}>🍽️</div>
              )}

              <div className={style.recipeBadge}>
                <FaBookOpen />
                <span>RECIPE</span>
              </div>

              <div className={style.imageNumber}>#{idMeal}</div>
            </div>
          </div>

          <div className={style.heroContent}>
            <div className={style.heroEyebrow}>
              <span></span>
              SOMETHING DELICIOUS
              <span></span>
            </div>

            <h1 className={style.recipeTitle}>{strMeal}</h1>

            <div className={style.heroTags}>
              {strCategory && (
                <span className={`${style.heroTag} ${style.categoryTag}`}>
                  <FaLeaf />
                  {strCategory}
                </span>
              )}

              {strArea && (
                <span className={`${style.heroTag} ${style.areaTag}`}>
                  <FaGlobeAmericas />
                  {strArea}
                </span>
              )}
            </div>

            <p className={style.heroIntro}>
              A delicious {strCategory?.toLowerCase() || "recipe"}
              {strArea ? ` from ${strArea}` : ""}. Gather the ingredients,
              follow the steps, and make something worth sharing.
            </p>

            <FavoriteButton
              active={isFavorite}
              onClick={isFavorite ? removeFavorite : addFavorite}
            />

            {fromFavorites && (
              <BackToFavorites onClick={handleBackToFavorites} />
            )}
            <MealPlannerButton
              meal={{
                type: "recipe",
                id: idMeal,
                name: strMeal,
                image: strMealThumb,
              }}
            />

            <div className={style.heroFacts}>
              {strCategory && (
                <div className={style.heroFact}>
                  <div className={`${style.heroFactIcon} ${style.greenFact}`}>
                    <FaLeaf />
                  </div>

                  <div>
                    <span>CATEGORY</span>
                    <strong>{strCategory}</strong>
                  </div>
                </div>
              )}

              {strArea && (
                <div className={style.heroFact}>
                  <div className={`${style.heroFactIcon} ${style.orangeFact}`}>
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <span>ORIGIN</span>
                    <strong>{strArea}</strong>
                  </div>
                </div>
              )}

              {ingredients.length > 0 && (
                <div className={style.heroFact}>
                  <div className={`${style.heroFactIcon} ${style.yellowFact}`}>
                    <FaUtensils />
                  </div>

                  <div>
                    <span>INGREDIENTS</span>
                    <strong>{ingredients.length}</strong>
                  </div>
                </div>
              )}
            </div>

            {strSource && (
              <div className={style.heroActions}>
                <a
                  href={strSource}
                  target="_blank"
                  rel="noreferrer"
                  className={style.sourceButton}
                >
                  <FaExternalLinkAlt />
                  Original Source
                </a>
              </div>
            )}
          </div>
        </section>

        {/* RECIPE DETAILS */}

        <section className={style.overviewSection}>
          <div className={style.sectionHeading}>
            <div className={style.sectionNumber}>01</div>

            <div>
              <span className={style.sectionEyebrow}>GET TO KNOW IT</span>
              <h2>Recipe details</h2>
            </div>
          </div>

          <div className={style.overviewGrid}>
            <div className={style.overviewCard}>
              <div className={`${style.overviewIcon} ${style.greenOverview}`}>
                <FaLeaf />
              </div>

              <div>
                <span>CATEGORY</span>
                <strong>{strCategory || "Not specified"}</strong>
              </div>
            </div>

            <div className={style.overviewCard}>
              <div className={`${style.overviewIcon} ${style.orangeOverview}`}>
                <FaGlobeAmericas />
              </div>

              <div>
                <span>AREA</span>
                <strong>{strArea || "Not specified"}</strong>
              </div>
            </div>

            <div className={style.overviewCard}>
              <div className={`${style.overviewIcon} ${style.yellowOverview}`}>
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>COUNTRY</span>
                <strong>{strCountry || strArea || "Not specified"}</strong>
              </div>
            </div>

            <div className={style.overviewCard}>
              <div className={`${style.overviewIcon} ${style.greenOverview}`}>
                <FaUtensils />
              </div>

              <div>
                <span>INGREDIENTS</span>
                <strong>{ingredients.length} items</strong>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className={style.tagsBox}>
              <div className={style.tagsHeading}>
                <FaTag />
                <span>RECIPE TAGS</span>
              </div>

              <div className={style.tagsList}>
                {tags.map((tag) => (
                  <span key={tag} className={style.recipeTag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* INGREDIENTS */}

        <section className={style.ingredientsSection}>
          <div className={style.sectionHeading}>
            <div className={style.sectionNumber}>02</div>

            <div>
              <span className={style.sectionEyebrow}>GATHER FIRST</span>
              <h2>Everything you need</h2>
            </div>

            <span className={style.itemCount}>{ingredients.length} items</span>
          </div>

          {ingredients.length > 0 ? (
            <div className={style.ingredientsGrid}>
              {ingredients.map((item, index) => (
                <div
                  className={style.ingredientCard}
                  key={`${item.ingredient}-${index}`}
                  style={{
                    "--ingredient-delay": `${index * 0.04}s`,
                  }}
                >
                  <div className={style.ingredientIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className={style.ingredientVisual}>
                    <FaLeaf />
                  </div>

                  <div className={style.ingredientContent}>
                    <strong>{item.ingredient}</strong>
                    <span>{item.measure || "As needed"}</span>
                  </div>

                  <FaArrowRight className={style.ingredientArrow} />
                </div>
              ))}
            </div>
          ) : (
            <div className={style.emptyIngredients}>
              <span>🥣</span>
              <p>Ingredient information is not available for this recipe.</p>
            </div>
          )}
        </section>

        {/* INSTRUCTIONS */}

        <section className={style.instructionsSection}>
          <div className={style.instructionsHeader}>
            <div className={style.sectionHeading}>
              <div className={style.sectionNumber}>03</div>

              <div>
                <span className={style.sectionEyebrow}>LET'S COOK</span>
                <h2>How to make it</h2>
              </div>
            </div>

            <div className={style.instructionsMeta}>
              <span className={style.metaDot}></span>
              <strong>{instructions.length}</strong>
              <span>
                {instructions.length === 1 ? "cooking step" : "cooking steps"}
              </span>
            </div>
          </div>

          {instructions.length > 0 ? (
            <div className={style.stepsGrid}>
              {instructions.map((instruction, index) => (
                <article
                  className={`${style.newStepCard} ${
                    index === 0 ? style.featuredStep : ""
                  }`}
                  key={`${instruction}-${index}`}
                  style={{
                    "--step-delay": `${index * 0.045}s`,
                  }}
                >
                  <div className={style.stepTop}>
                    <div className={style.bigStepNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className={style.stepLabel}>
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className={style.stepDivider}></div>

                  <p className={style.newStepText}>{instruction}</p>

                  <div className={style.stepBottom}>
                    <span>
                      {index === 0
                        ? "START HERE"
                        : index === instructions.length - 1
                          ? "ALMOST THERE"
                          : "KEEP COOKING"}
                    </span>

                    <FaArrowRight />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={style.emptyInstructions}>
              <span>👨‍🍳</span>
              <h3>Cooking instructions unavailable</h3>
              <p>We couldn't find step-by-step instructions for this recipe.</p>
            </div>
          )}

          {/* ONLY ONE WATCH BUTTON */}

          {youtubeId && (
            <div className={style.watchRecipeBox}>
              <div className={style.watchRecipeInfo}>
                <div className={style.watchIcon}>
                  <FaPlay />
                </div>

                <div>
                  <span>WANT TO SEE IT IN ACTION?</span>
                  <h3>Cook along with the recipe.</h3>
                </div>
              </div>

              <a
                href={strYoutube}
                target="_blank"
                rel="noreferrer"
                className={style.watchButton}
              >
                Watch Recipe
                <FaArrowRight />
              </a>
            </div>
          )}
        </section>

        {/* FINAL */}

        <section className={style.finalSection}>
          <div className={style.finalDecorOne}></div>
          <div className={style.finalDecorTwo}></div>

          <div className={style.finalContent}>
            <span className={style.finalEmoji}>🍴</span>

            <span className={style.finalEyebrow}>MADE FOR FOOD LOVERS</span>

            <h2>
              Good food is
              <br />
              <em>worth the effort.</em>
            </h2>

            <p>
              Take your time, enjoy the process, and make something delicious.
            </p>

            {dateModified && (
              <span className={style.updatedText}>
                Recipe updated {formatDate(dateModified)}
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function getYoutubeId(url) {
  if (!url) {
    return null;
  }

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);

  return match ? match[1] : null;
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
