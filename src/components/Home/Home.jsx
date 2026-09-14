/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import style from "../../css/Home/home.module.css";
import ErrorPage from "../Error";
import Loading from "../Loading";
import FavoriteButton from "../FavoriteButton";
import MealPlannerButton from "../new/MealPlannerButton";
import {
  RefreshCwIcon,
  CirclePlayIcon,
  ChevronsRightIcon,
  SquareArrowOutUpRightIcon,
} from "@animateicons/react/lucide";

const URL = import.meta.env.VITE_MEAL_API_URL;

export default function Home() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchRandomRecipe = async () => {
    try {
      setError(null);
      setIsRefreshing(true);

      const response = await fetch(`${URL}/random.php`);

      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await response.json();

      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0]);
      } else {
        setError("No recipe found");
      }
    } catch (e) {
      if (e.message === "Failed to fetch") setError("No Internet Connection.");
      else setError(e.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  useEffect(() => {
    if (!recipe) return;

    const exists = favorites.some(
      (item) => item.type === "recipe" && item.id === recipe.idMeal,
    );

    setIsFavorite(exists);
  }, [recipe, favorites]);
  const addFavorite = () => {
    const newData = {
      type: "recipe",
      id: recipe.idMeal,
      name: recipe.strMeal,
      image: recipe.strMealThumb,
    };
    const updatedFavorites = [...favorites, newData];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(true);
  };
  const removeFavorite = () => {
    const updatedFavorites = favorites.filter(
      (item) => !(item.type === "recipe" && item.id === recipe.idMeal),
    );

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(false);
  };
  const handleRefresh = () => {
    if (!isRefreshing) {
      fetchRandomRecipe();
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorPage message={error} />;

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const name = recipe?.[`strIngredient${index + 1}`];
    const measure = recipe?.[`strMeasure${index + 1}`];

    if (!name?.trim()) return null;

    return {
      name: name.trim(),
      measure: measure?.trim() || "",
    };
  }).filter(Boolean);

  const steps = recipe?.strInstructions
    ? recipe.strInstructions
        .split(/\r?\n/)
        .map((step) => step.trim())
        .filter(Boolean)
    : [];

  return (
    <div className={style.home}>
      <div className={style.backgroundOrb}></div>
      <div className={style.backgroundOrbTwo}></div>

      {/* HERO */}
      <section className={style.hero}>
        <div className={style.heroTop}>
          <span className={style.heroKicker}>
            <span></span>
            DAILY RECIPE DISCOVERY
          </span>

          <span className={style.heroIndex}>01 / DISCOVER</span>
        </div>

        <div className={style.heroMain}>
          <h1 className={style.heroTitle}>
            <span className={style.something}>Your next</span>
            <br />
            <span className={style.delicious}>craving</span>
            <i>.</i>
          </h1>

          <div className={style.heroSide}>
            <p>
              Let us pick your next meal. Discover a random recipe and find
              something new to make today.
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={style.refreshButton}
            >
              <RefreshCwIcon size={21} color="#ffffff" />
              <span>{isRefreshing ? "Finding..." : "Surprise Me"}</span>
            </button>
          </div>
        </div>

        <div className={style.heroLine}>
          <span>GOOD FOOD</span>
          <div></div>
          <span>GOOD MOOD</span>
        </div>
      </section>

      {/* RECIPE */}
      {recipe && (
        <section className={style.recipeCard}>
          <div className={style.imageWrapper}>
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className={style.recipeImage}
            />

            <div className={style.imageOverlay}></div>

            <div className={style.imageTop}>
              <span>RANDOM PICK</span>
              <span>RECIPE / 001</span>
            </div>

            <div className={style.imageBottom}>
              <div className={style.imageRecipeMeta}>
                <span>{recipe.strCategory}</span>
                <b>•</b>
                <span>{recipe.strArea}</span>
              </div>

              <div className={style.imageRecipeName}>{recipe.strMeal}</div>
            </div>
          </div>

          <div className={style.recipeDetails}>
            <div className={style.recipeNumber}>01</div>

            <header className={style.recipeHeader}>
              <span className={style.categoryLabel}>{recipe.strCategory}</span>

              <h2>{recipe.strMeal}</h2>

              <p>
                A recipe from <strong>{recipe.strArea}</strong> cuisine.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <FavoriteButton
                  onClick={isFavorite ? removeFavorite : addFavorite}
                  active={isFavorite}
                />

                <MealPlannerButton
                  meal={{
                    type: "recipe",
                    id: recipe.idMeal,
                    name: recipe.strMeal,
                    image: recipe.strMealThumb,
                  }}
                />
              </div>
            </header>

            {/* INGREDIENTS */}
            <section className={style.ingredientsSection}>
              <div className={style.sectionHeading}>
                <div className={style.headingLeft}>
                  <span className={style.sectionNumber}>02</span>

                  <div>
                    <span className={style.headingMini}>GATHER THESE</span>

                    <h3>Ingredients</h3>
                  </div>
                </div>

                <span className={style.count}>{ingredients.length} items</span>
              </div>

              <div className={style.ingredientsGrid}>
                {ingredients.map((ingredient, index) => (
                  <div
                    key={`${ingredient.name}-${index}`}
                    className={style.ingredient}
                    style={{ "--ingredient-index": index }}
                  >
                    <span className={style.ingredientDot}></span>

                    <span className={style.ingredientName}>
                      {ingredient.name}
                    </span>

                    {ingredient.measure && (
                      <span className={style.measure}>
                        {ingredient.measure}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}

      {/* INSTRUCTIONS */}
      {recipe && steps.length > 0 && (
        <section className={style.instructionsCard}>
          <div className={style.instructionsTop}>
            <div className={style.instructionsTitle}>
              <span className={style.bigNumber}>03</span>

              <div>
                <span className={style.headingMini}>FROM START TO FINISH</span>

                <h3>
                  How to make <span>it.</span>
                </h3>

                <p>
                  Follow the steps, take your time, and turn simple ingredients
                  into something worth sharing.
                </p>
              </div>
            </div>
          </div>

          <div className={style.steps}>
            {steps.map((step, index) => (
              <article
                key={index}
                className={style.step}
                style={{ "--step-index": index }}
              >
                <div className={style.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className={style.stepContent}>
                  <span className={style.stepLabel}>
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>

                  <p>{step}</p>

                  <div className={style.stepArrow}>
                    <ChevronsRightIcon size={19} color="#15803d" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* VIDEO / SOURCE */}
          {(recipe.strYoutube || recipe.strSource) && (
            <div className={style.actions}>
              {recipe.strYoutube && (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.youtubeButton}
                >
                  <CirclePlayIcon size={20} duration={1.5} color="#ffffff" />
                  <span>Watch Tutorial</span>
                </a>
              )}

              {recipe.strSource && (
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.sourceButton}
                >
                  <SquareArrowOutUpRightIcon size={19} color="#52525b" />
                  <span>Original Recipe</span>
                </a>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
