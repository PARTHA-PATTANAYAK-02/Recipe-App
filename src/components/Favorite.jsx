/* =========================================================
   FAVORITE PAGE
   ========================================================= */

import { useEffect, useRef, useState } from "react";
import style from "../css/favorite.module.css";
import { EyeIcon, Trash2Icon } from "@animateicons/react/lucide";

export default function Favorite({
  setMenu,
  setFoodId,
  setDrinkId,
  setFromFavorites,
  setModalMeal,
}) {
  /* =======================================================
     LOAD FAVORITES FROM LOCAL STORAGE
     ======================================================= */

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");

    try {
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  /* =======================================================
     FILTER
     ======================================================= */

  const [filter, setFilter] = useState("all");

  const filteredFavorites =
    filter === "all"
      ? favorites
      : favorites.filter((item) => item.type === filter);

  /* =======================================================
     REALTIME FAVORITES UPDATE
     ======================================================= */

  useEffect(() => {
    const updateFavorites = () => {
      const savedFavorites = localStorage.getItem("favorites");

      try {
        setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
      } catch {
        setFavorites([]);
      }
    };

    window.addEventListener("storage", updateFavorites);
    window.addEventListener("favoritesUpdated", updateFavorites);

    return () => {
      window.removeEventListener("storage", updateFavorites);
      window.removeEventListener("favoritesUpdated", updateFavorites);
    };
  }, []);

  /* =======================================================
     OPEN FAVORITE
     ======================================================= */

  const handleOpenFavorite = (item) => {
    if (item.type === "recipe") {
      setFoodId(item.id);
      setMenu(1);
      setFromFavorites(true);
    }

    if (item.type === "food") {
      setModalMeal(item.data);
      setMenu(2);
      setFromFavorites(true);
    }

    if (item.type === "drink") {
      setDrinkId(item.id);
      setMenu(4);
      setFromFavorites(true);
    }
  };

  /* =======================================================
     REMOVE FAVORITE
     ======================================================= */

  const handleRemoveFavorite = (item) => {
    const updatedFavorites = favorites.filter(
      (favorite) => !(favorite.type === item.type && favorite.id === item.id),
    );

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    setFavorites(updatedFavorites);

    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  /* =======================================================
     FILTER CHANGE
     ======================================================= */

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <main className={style.favoritePage}>
      {/* ================= BACKGROUND ================= */}

      <div className={style.backgroundGlowOne}></div>
      <div className={style.backgroundGlowTwo}></div>

      <div className={style.backgroundLeafOne}>✦</div>
      <div className={style.backgroundLeafTwo}>✦</div>

      {/* ================= HERO ================= */}

      <section className={style.hero}>
        <div className={style.heroContent}>
          <span className={style.eyebrow}>
            <span>✦</span>
            YOUR COLLECTION
          </span>

          <h1>
            Your
            <span> Favorites.</span>
          </h1>

          <p>
            Everything you loved, saved in one place. Pick something delicious
            and keep exploring.
          </p>
        </div>

        <div className={style.favoriteCount}>
          <div className={style.countIcon}>♥</div>

          <div className={style.countContent}>
            <span>{favorites.length}</span>

            <small>
              {favorites.length === 1 ? "SAVED ITEM" : "SAVED ITEMS"}
            </small>
          </div>
        </div>
      </section>

      {/* ================= FILTER NAVBAR ================= */}

      {favorites.length > 0 && (
        <nav className={style.filterNav} aria-label="Favorite filters">
          <div className={style.filterNavInner}>
            <button
              className={`${style.filterButton} ${
                filter === "all" ? style.activeFilter : ""
              }`}
              type="button"
              onClick={() => handleFilterChange("all")}
              aria-pressed={filter === "all"}
            >
              <span className={style.filterIcon}>✦</span>
              <span>All</span>
            </button>

            <button
              className={`${style.filterButton} ${
                filter === "recipe" ? style.activeFilter : ""
              }`}
              type="button"
              onClick={() => handleFilterChange("recipe")}
              aria-pressed={filter === "recipe"}
            >
              <span className={style.filterIcon}>🍽️</span>
              <span>Recipes</span>
            </button>

            <button
              className={`${style.filterButton} ${
                filter === "food" ? style.activeFilter : ""
              }`}
              type="button"
              onClick={() => handleFilterChange("food")}
              aria-pressed={filter === "food"}
            >
              <span className={style.filterIcon}>🍕</span>
              <span>Food</span>
            </button>

            <button
              className={`${style.filterButton} ${
                filter === "drink" ? style.activeFilter : ""
              }`}
              type="button"
              onClick={() => handleFilterChange("drink")}
              aria-pressed={filter === "drink"}
            >
              <span className={style.filterIcon}>🍷</span>
              <span>Drinks</span>
            </button>
          </div>
        </nav>
      )}

      {/* ================= FAVORITES ================= */}

      {favorites.length === 0 ? (
        <section className={style.emptyState}>
          <div className={style.emptyDecorOne}></div>
          <div className={style.emptyDecorTwo}></div>

          <div className={style.emptyIcon}>
            <span>♡</span>
          </div>

          <span className={style.emptyEyebrow}>YOUR COLLECTION IS EMPTY</span>

          <h2>
            Nothing saved
            <span> yet.</span>
          </h2>

          <p>
            Start exploring recipes, food and drinks and save the ones you love.
            They&apos;ll all be waiting for you here.
          </p>

          <button
            className={style.exploreButton}
            type="button"
            onClick={() => {
              setMenu(0);
              setFromFavorites(false);
            }}
          >
            <span className={style.exploreIcon}>✦</span>
            <span>Explore Recipes</span>
            <span className={style.exploreArrow}>→</span>
          </button>
        </section>
      ) : filteredFavorites.length === 0 ? (
        <section className={style.emptyState}>
          <div className={style.emptyDecorOne}></div>
          <div className={style.emptyDecorTwo}></div>

          <div className={style.emptyIcon}>
            <span>♡</span>
          </div>

          <span className={style.emptyEyebrow}>NOTHING IN THIS COLLECTION</span>

          <h2>
            No {filter === "recipe" ? "recipes" : filter}
            <span> saved.</span>
          </h2>

          <p>
            You haven&apos;t saved any{" "}
            {filter === "recipe" ? "recipes" : filter} yet. Explore more and add
            something you love to your favorites.
          </p>
        </section>
      ) : (
        <section className={style.favoriteGrid}>
          {filteredFavorites.map((item, index) => (
            <FavoriteCard
              key={`${item.type}-${item.id}`}
              item={item}
              index={index}
              onView={handleOpenFavorite}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </section>
      )}
    </main>
  );
}

/* =========================================================
   FAVORITE CARD
   ========================================================= */

function FavoriteCard({ item, index, onView, onRemove }) {
  const viewIconRef = useRef(null);
  const deleteIconRef = useRef(null);

  return (
    <article className={style.favoriteCard} style={{ "--card-index": index }}>
      {/* ================= IMAGE ================= */}

      <div className={style.imageWrapper}>
        <img src={item.image} alt={item.name} className={style.image} />

        <div className={style.imageOverlay}></div>

        <div className={style.imageTop}>
          <span className={style.typeBadge}>{item.type}</span>

          <span className={style.savedBadge}>
            <span>♥</span>
            Saved
          </span>
        </div>

        <div className={style.imageBottom}>
          <span>FAVORITE #{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className={style.cardContent}>
        <div className={style.cardHeader}>
          <span className={style.cardLabel}>SAVED FAVORITE</span>

          <span className={style.itemId}>#{item.id}</span>
        </div>

        <h2>{item.name}</h2>

        <div className={style.cardBottom}>
          {/* ================= VIEW ================= */}

          <button
            className={style.viewButton}
            type="button"
            onClick={() => onView(item)}
            onMouseEnter={() => viewIconRef.current?.startAnimation()}
            onMouseLeave={() => viewIconRef.current?.stopAnimation()}
            aria-label={`View ${item.name}`}
          >
            <EyeIcon ref={viewIconRef} size={17} duration={1} />

            <span>View</span>
          </button>

          {/* ================= REMOVE ================= */}

          <button
            className={style.removeButton}
            type="button"
            onClick={() => onRemove(item)}
            onMouseEnter={() => deleteIconRef.current?.startAnimation()}
            onMouseLeave={() => deleteIconRef.current?.stopAnimation()}
            aria-label={`Remove ${item.name} from favorites`}
            title="Remove from favorites"
          >
            <Trash2Icon ref={deleteIconRef} size={17} duration={1} />

            <span>Remove</span>
          </button>
        </div>
      </div>
    </article>
  );
}
