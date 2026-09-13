/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import style from "../../css/Food/modal.module.css";
import FavoriteButton from "../FavoriteButton";
import BackToFavorites from "../BackToFavorites";
import MealPlannerButton from "../new/MealPlannerButton";
import {
  FaTimes,
  FaPlay,
  FaGlobeAmericas,
  FaUtensils,
  FaLeaf,
  FaExternalLinkAlt,
  FaArrowRight,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";

export default function FoodModal({
  data,
  onClose,
  fromFavorites,
  setFromFavorites,
  setMenu,
}) {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!data) return;

    const exists = favorites.some(
      (item) => item.type === "food" && item.id === data.idMeal,
    );

    setIsFavorite(exists);
  }, [data, favorites]);

  const addFavorite = () => {
    const newFavorite = {
      type: "food",
      id: data.idMeal,
      name: data.strMeal,
      image: data.strMealThumb,
      data: data,
    };

    const updatedFavorites = [...favorites, newFavorite];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  const removeFavorite = () => {
    const updatedFavorites = favorites.filter(
      (item) => !(item.type === "food" && item.id === data.idMeal),
    );

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleBackToFavorites = () => {
    setFromFavorites(false);
    setMenu(5);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const ingredients = getIngredients(data);

  const instructions = getInstructions(data.strInstructions);

  const tags = data.strTags
    ? data.strTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const youtubeId = getYoutubeId(data.strYoutube);

  return (
    <div className={style.backdrop} onClick={handleBackdropClick}>
      <div className={style.modalWindow}>
        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          className={style.closeButton}
          onClick={onClose}
          aria-label="Close recipe details"
        >
          <FaTimes />
        </button>

        {/* =================================================
            HERO IMAGE
        ================================================= */}

        <div className={style.modalHero}>
          {data.strMealThumb ? (
            <img
              src={data.strMealThumb}
              alt={data.strMeal}
              className={style.heroImage}
            />
          ) : (
            <div className={style.heroFallback}>🍽️</div>
          )}

          <div className={style.heroOverlay}></div>

          <div className={style.heroTop}>
            <span className={style.recipeLabel}>
              <FaUtensils />
              RECIPE
            </span>
          </div>

          <div className={style.heroBottom}>
            <div>
              {data.strCategory && (
                <span className={style.heroCategory}>{data.strCategory}</span>
              )}

              <h2>{data.strMeal}</h2>

              <div className={style.heroLocation}>
                {data.strArea && (
                  <span>
                    <FaGlobeAmericas />
                    {data.strArea}
                  </span>
                )}

                {data.strCountry && data.strCountry !== data.strArea && (
                  <span>
                    <FaMapMarkerAlt />
                    {data.strCountry}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className={style.modalContent}>
          {/* =================================================
              QUICK FACTS
          ================================================= */}

          <div className={style.quickFacts}>
            <div className={style.fact}>
              <div className={style.factIcon}>
                <FaUtensils />
              </div>

              <div>
                <span>INGREDIENTS</span>
                <strong>{ingredients.length}</strong>
              </div>
            </div>

            <div className={style.fact}>
              <div className={style.factIcon}>
                <FaGlobeAmericas />
              </div>

              <div>
                <span>AREA</span>
                <strong>{data.strArea || "Unknown"}</strong>
              </div>
            </div>

            <div className={style.fact}>
              <div className={style.factIcon}>
                <FaLeaf />
              </div>

              <div>
                <span>CATEGORY</span>
                <strong>{data.strCategory || "Food"}</strong>
              </div>
            </div>
          </div>

          {/* =================================================
              INTRO
          ================================================= */}

          <div className={style.introSection}>
            <div className={style.introHeading}>
              <span>ABOUT THIS RECIPE</span>

              <h3>
                Something worth
                <em> cooking.</em>
              </h3>
            </div>

            <p>
              A {data.strCategory?.toLowerCase() || "delicious"} recipe
              {data.strArea ? ` from ${data.strArea}` : ""}. Gather the
              ingredients below and follow the cooking steps to make it
              yourself.
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
                type: "food",
                id: data.idMeal,
                name: data.strMeal,
                image: data.strMealThumb,
                data: data,
              }}
            />
          </div>

          {/* =================================================
              INGREDIENTS
          ================================================= */}

          <section className={style.ingredientsSection}>
            <div className={style.sectionTitle}>
              <div className={style.sectionNumber}>01</div>

              <div>
                <span>GATHER FIRST</span>

                <h3>Ingredients</h3>
              </div>

              <small>{ingredients.length} items</small>
            </div>

            {ingredients.length > 0 ? (
              <div className={style.ingredientsGrid}>
                {ingredients.map((item, index) => (
                  <div
                    className={style.ingredient}
                    key={`${item.ingredient}-${index}`}
                  >
                    <span className={style.ingredientNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className={style.ingredientIcon}>
                      <FaLeaf />
                    </div>

                    <div className={style.ingredientText}>
                      <strong>{item.ingredient}</strong>

                      <span>{item.measure || "As needed"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={style.emptyBox}>
                <span>🥣</span>

                <p>Ingredient information is not available for this recipe.</p>
              </div>
            )}
          </section>

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          <section className={style.instructionsSection}>
            <div className={style.sectionTitle}>
              <div className={style.sectionNumber}>02</div>

              <div>
                <span>LET'S COOK</span>

                <h3>How to make it</h3>
              </div>

              <small>
                {instructions.length}{" "}
                {instructions.length === 1 ? "step" : "steps"}
              </small>
            </div>

            {instructions.length > 0 ? (
              <div className={style.instructionsList}>
                {instructions.map((instruction, index) => (
                  <article
                    className={style.instruction}
                    key={`${instruction}-${index}`}
                  >
                    <div className={style.stepNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className={style.instructionContent}>
                      <span>STEP {String(index + 1).padStart(2, "0")}</span>

                      <p>{instruction}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={style.emptyBox}>
                <span>👨‍🍳</span>

                <p>Cooking instructions are not available for this recipe.</p>
              </div>
            )}
          </section>

          {/* =================================================
              TAGS
          ================================================= */}

          {tags.length > 0 && (
            <div className={style.tagsSection}>
              <div className={style.tagsHeading}>
                <FaTag />

                <span>RECIPE TAGS</span>
              </div>

              <div className={style.tags}>
                {tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          {(youtubeId || data.strSource) && (
            <div className={style.actions}>
              {youtubeId && (
                <a
                  href={data.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.youtubeButton}
                >
                  <span>
                    <FaPlay />
                  </span>
                  Watch Recipe Video
                  <FaArrowRight />
                </a>
              )}

              {data.strSource && (
                <a
                  href={data.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.sourceButton}
                >
                  <FaExternalLinkAlt />
                  Original Source
                </a>
              )}
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className={style.modalFooter}>
            <span>FOOD DISCOVERY</span>

            <span>Recipe #{data.idMeal}</span>

            {data.dateModified && (
              <span>Updated {formatDate(data.dateModified)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
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

function getInstructions(text) {
  if (!text) {
    return [];
  }

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((step) => step.trim())
    .filter(Boolean);
}

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
