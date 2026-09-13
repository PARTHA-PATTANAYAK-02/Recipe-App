/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import style from "../../css/Drinks/drinksDetails.module.css";
import Loading from "../Loading";
import ErrorPage from "../Error";
import FavoriteButton from "../FavoriteButton";
import BackToFavorites from "../BackToFavorites";
import MealPlannerButton from "../new/MealPlannerButton";
const URL = import.meta.env.VITE_DRINK_API_URL;

export default function Drinksdetails({
  drinkId,
  handleRandomDrink,
  fromFavorites,
  setFromFavorites,
  setMenu,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    async function fetchDrinks() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        const res = await fetch(`${URL}/lookup.php?i=${drinkId}`);

        if (!res.ok) {
          throw new Error("Unable to fetch drink details");
        }

        const result = await res.json();

        if (!result.drinks || result.drinks.length === 0) {
          throw new Error("No drink found");
        }

        setData(result.drinks[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (drinkId) {
      fetchDrinks();
    }
  }, [drinkId]);

  if (loading) {
    return (
      <div className={style.statusWrapper}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.statusWrapper}>
        <ErrorPage />
      </div>
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
        name: ingredient,
        measure: measure ? measure.trim() : "As required",
      });
    }
  }

  const tags = data.strTags
    ? data.strTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const languages = [
    {
      name: "English",
      code: "EN",
      instruction: data.strInstructions,
    },
    {
      name: "Spanish",
      code: "ES",
      instruction: data.strInstructionsES,
    },
    {
      name: "German",
      code: "DE",
      instruction: data.strInstructionsDE,
    },
    {
      name: "French",
      code: "FR",
      instruction: data.strInstructionsFR,
    },
    {
      name: "Italian",
      code: "IT",
      instruction: data.strInstructionsIT,
    },
    {
      name: "Chinese (Simplified)",
      code: "ZH",
      instruction: data["strInstructionsZH-HANS"],
    },
    {
      name: "Chinese (Traditional)",
      code: "ZH",
      instruction: data["strInstructionsZH-HANT"],
    },
  ].filter((language) => language.instruction);

  const instructions = data.strInstructions
    ? data.strInstructions
        .split(". ")
        .map((step) => step.trim())
        .filter(Boolean)
    : [];

  return (
    <section className={style.detailsSection}>
      <div className={style.decorCircleOne}></div>
      <div className={style.decorCircleTwo}></div>
      <div className={style.decorLeaf}>✦</div>

      <div className={style.container}>
        {/* TOP BAR */}
        <div className={style.topBar}>
          <div className={style.breadcrumb}>
            <span>HOME</span>
            <b>/</b>
            <span>DRINKS</span>
            <b>/</b>
            <strong>{data.strDrink}</strong>
          </div>

          <button
            type="button"
            className={style.randomButton}
            onClick={handleRandomDrink}
          >
            <span className={style.randomIcon}>🎲</span>

            <span className={style.randomText}>
              <small>FEELING ADVENTUROUS?</small>
              Discover another drink
            </span>

            <span className={style.randomArrow}>→</span>
          </button>
        </div>

        {/* HERO */}
        <div className={style.hero}>
          <div className={style.imageSide}>
            <div className={style.imageCard}>
              <div className={style.imageBadge}>
                <span>✦</span>
                RECIPE SPOTLIGHT
              </div>

              <div className={style.imageShine}></div>

              <img
                src={data.strDrinkThumb}
                alt={data.strDrink}
                className={style.drinkImage}
              />

              <div className={style.imageBottom}>
                <span>
                  {data.strAlcoholic === "Alcoholic"
                    ? "🍸 Alcoholic"
                    : "🥤 Non-Alcoholic"}
                </span>

                {data.strGlass && <span>🥃 {data.strGlass}</span>}
              </div>
            </div>

            <div className={style.imageCaption}>
              <span className={style.captionLine}></span>
              <p>Pour something delicious.</p>
            </div>
          </div>

          <div className={style.contentSide}>
            <div className={style.categoryRow}>
              {data.strCategory && (
                <span className={style.category}>{data.strCategory}</span>
              )}

              {data.strIBA && <span className={style.iba}>{data.strIBA}</span>}

              {data.strAlcoholic && (
                <span className={style.alcohol}>{data.strAlcoholic}</span>
              )}
            </div>

            <h1 className={style.title}>
              {data.strDrink}
              <span>.</span>
            </h1>

            {data.strDrinkAlternate && (
              <p className={style.alternate}>
                Also known as {data.strDrinkAlternate}
              </p>
            )}

            {tags.length > 0 && (
              <div className={style.tags}>
                {tags.map((tag, index) => (
                  <span key={`${tag}-${index}`}>#{tag}</span>
                ))}
              </div>
            )}

            <p className={style.intro}>
              Discover everything about this drink — its ingredients, serving
              style, category, preparation method, and recipe information.
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
                type: "drink",
                id: data.idDrink,
                name: data.strDrink,
                image: data.strDrinkThumb,
                data: data,
              }}
            />
            <div className={style.infoGrid}>
              <div className={style.infoCard}>
                <div className={style.infoIcon}>🥂</div>

                <div>
                  <span>BEST SERVED IN</span>
                  <strong>{data.strGlass || "Not specified"}</strong>
                </div>
              </div>

              <div className={style.infoCard}>
                <div className={style.infoIcon}>🍹</div>

                <div>
                  <span>DRINK TYPE</span>
                  <strong>{data.strAlcoholic || "Not specified"}</strong>
                </div>
              </div>

              <div className={style.infoCard}>
                <div className={style.infoIcon}>🥄</div>

                <div>
                  <span>INGREDIENTS</span>
                  <strong>{ingredients.length} items</strong>
                </div>
              </div>

              <div className={style.infoCard}>
                <div className={style.infoIcon}>🍋</div>

                <div>
                  <span>CATEGORY</span>
                  <strong>{data.strCategory || "Not specified"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            RECIPE AREA
            INGREDIENTS FIRST
            PREPARATION BELOW
        ================================================== */}
        <div className={style.recipeArea}>
          {/* INGREDIENTS */}
          <div className={style.ingredientsCard}>
            <div className={style.sectionHeader}>
              <div>
                <span className={style.sectionEyebrow}>WHAT YOU NEED</span>

                <h2>Ingredients</h2>
              </div>

              <span className={style.itemCount}>
                {ingredients.length} ITEMS
              </span>
            </div>

            <div className={style.ingredientsList}>
              {ingredients.map((item, index) => (
                <div className={style.ingredient} key={`${item.name}-${index}`}>
                  <div className={style.ingredientNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className={style.ingredientDot}></div>

                  <div className={style.ingredientDetails}>
                    <strong>{item.name}</strong>
                    <span>{item.measure}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREPARATION */}
          <div className={style.preparationCard}>
            <div className={style.sectionHeader}>
              <div>
                <span className={style.sectionEyebrow}>LET&apos;S MAKE IT</span>

                <h2>Preparation</h2>
              </div>

              <span className={style.stepIcon}>✦</span>
            </div>

            <div className={style.stepsList}>
              {instructions.length > 0 ? (
                instructions.map((instruction, index) => (
                  <div className={style.instructionStep} key={index}>
                    <div className={style.stepNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p>
                      {instruction}
                      {instruction.endsWith(".") ? "" : "."}
                    </p>
                  </div>
                ))
              ) : (
                <div className={style.instructionStep}>
                  <div className={style.stepNumber}>01</div>

                  <p>
                    {data.strInstructions ||
                      "No preparation instructions available."}
                  </p>
                </div>
              )}
            </div>

            <div className={style.tipBox}>
              <span className={style.tipIcon}>💡</span>

              <div>
                <strong>Serving tip</strong>

                <p>
                  Serve immediately after preparation for the freshest taste and
                  best presentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RECIPE DETAILS */}
        <div className={style.extraInfo}>
          <div className={style.sectionHeader}>
            <div>
              <span className={style.sectionEyebrow}>
                MORE ABOUT THIS RECIPE
              </span>

              <h2>Recipe Details</h2>
            </div>

            <span className={style.itemCount}>FULL ENTRY</span>
          </div>

          <div className={style.detailGrid}>
            <div className={style.detailItem}>
              <span>Drink ID</span>
              <strong>{data.idDrink || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Drink Name</span>
              <strong>{data.strDrink || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Alternate Name</span>
              <strong>{data.strDrinkAlternate || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Category</span>
              <strong>{data.strCategory || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>IBA Classification</span>
              <strong>{data.strIBA || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Alcoholic</span>
              <strong>{data.strAlcoholic || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Glass</span>
              <strong>{data.strGlass || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Video</span>
              <strong>{data.strVideo ? "Available" : "Not available"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Image Source</span>

              <strong>
                {data.strImageSource ? (
                  <a
                    href={data.strImageSource}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View source ↗
                  </a>
                ) : (
                  "Not specified"
                )}
              </strong>
            </div>

            <div className={style.detailItem}>
              <span>Image Attribution</span>
              <strong>{data.strImageAttribution || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Creative Commons</span>
              <strong>{data.strCreativeCommonsConfirmed || "—"}</strong>
            </div>

            <div className={style.detailItem}>
              <span>Last Modified</span>
              <strong>{data.dateModified || "—"}</strong>
            </div>
          </div>
        </div>

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <div className={style.languageInfo}>
            <div className={style.sectionHeader}>
              <div>
                <span className={style.sectionEyebrow}>
                  MULTILINGUAL RECIPE
                </span>

                <h2>Instructions in Other Languages</h2>
              </div>

              <span className={style.itemCount}>
                {languages.length} LANGUAGES
              </span>
            </div>

            <div className={style.languageGrid}>
              {languages.map((language, index) => (
                <div
                  className={style.languageCard}
                  key={`${language.name}-${index}`}
                >
                  <div className={style.languageTop}>
                    <span>{language.code}</span>
                    <strong>{language.name}</strong>
                  </div>

                  <p>{language.instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM BANNER */}
        <div className={style.bottomBanner}>
          <div>
            <span>KEEP EXPLORING</span>

            <h2>
              There&apos;s always
              <em> something delicious.</em>
            </h2>
          </div>
        </div>

        {/* FOOTER */}
        <footer className={style.footer}>
          <span>DRINK #{data.idDrink}</span>

          <span>
            {data.strAlcoholic === "Alcoholic"
              ? "Alcoholic Recipe"
              : "Non-Alcoholic Recipe"}
          </span>

          <span>Made for food lovers ✦</span>
        </footer>
      </div>
    </section>
  );
}
