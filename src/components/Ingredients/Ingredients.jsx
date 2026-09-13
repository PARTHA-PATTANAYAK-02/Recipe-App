/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import EmptyMessage from "../EmptyMessage";
import Loading from "../Loading";
import Error from "../Error";
import IngredientModal from "./IngredientModal";
import style from "../../css/Ingredients/ingredients.module.css";
import { ChevronDownIcon } from "@animateicons/react/lucide";

const URL = import.meta.env.VITE_MEAL_API_URL;
const IMAGE_URL = import.meta.env.VITE_MEAL_IMAGE_URL;

export default function Ingredients({ query, ingredientSearchTrigger }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [visibleCount, setVisibleCount] = useState(12);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [sort, setSort] = useState("default");

  const chevronRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      setError("");
      setSort("default");
      return;
    }

    async function fetchIngredients() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${URL}/list.php?i=list`);

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const result = await res.json();

        const ingredients = result.meals || [];

        const searchTerm = query.trim().toLowerCase();

        const filteredIngredients = ingredients.filter((ingredient) =>
          ingredient.strIngredient?.toLowerCase().includes(searchTerm),
        );

        setData(filteredIngredients);
        setVisibleCount(12);
        setSort("default");
      } catch (error) {
        setError(error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
    setSearchTerm(query);
  }, [ingredientSearchTrigger]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleOpenModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setVisibleCount(12);
  };

  const handleSortMouseEnter = () => {
    chevronRef.current?.startAnimation();
  };

  const handleSortMouseLeave = () => {
    chevronRef.current?.stopAnimation();
  };

  const getImageUrl = (ingredientName) => {
    if (!ingredientName) return null;

    const imageName = ingredientName.trim().replace(/\s+/g, "_");

    return `${IMAGE_URL}${encodeURIComponent(imageName)}.png`;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!searchTerm && !data.length) {
    return (
      <EmptyMessage
        msg1="The perfect dish starts with the right ingredients."
        msg2="Search for an ingredient and discover what you can create!"
        emoji="🌿"
      />
    );
  }

  if (searchTerm && !data.length) {
    return (
      <EmptyMessage
        msg1="No ingredients found."
        msg2={`We couldn't find anything matching "${query}".`}
        emoji="🥕"
      />
    );
  }

  const sortedData = [...data].sort((a, b) => {
    const ingredientA = a.strIngredient?.trim() || "";
    const ingredientB = b.strIngredient?.trim() || "";

    if (sort === "az") {
      return ingredientA.localeCompare(ingredientB);
    }

    if (sort === "za") {
      return ingredientB.localeCompare(ingredientA);
    }

    return 0;
  });

  const visibleItems = sortedData.slice(0, visibleCount);
  const hasMore = visibleCount < sortedData.length;

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* HEADER */}
        <header className={style.header}>
          <div className={style.headerTop}>
            <div className={style.headerLabel}>
              <span>✦</span>
              INGREDIENT COLLECTION
            </div>

            <div className={style.resultPill}>{data.length} RESULTS</div>
          </div>

          <div className={style.headerContent}>
            <div>
              <p className={style.headerEyebrow}>YOUR SEARCH</p>

              <h1 className={style.headerTitle}>
                Ingredients for{" "}
                <span className={style.queryHighlight}>"{searchTerm}"</span>
              </h1>
            </div>

            <p className={style.headerDescription}>
              Explore ingredients and discover the building blocks behind
              delicious meals.
            </p>
          </div>
        </header>

        {/* RESULTS */}
        <section className={style.resultsSection}>
          <div className={style.sectionHeader}>
            <div>
              <span className={style.sectionEyebrow}>EXPLORE</span>

              <h2>All Ingredients</h2>
            </div>

            <div className={style.showingCount}>
              Showing{" "}
              <strong>{Math.min(visibleCount, sortedData.length)}</strong> of{" "}
              {sortedData.length}
            </div>
          </div>

          {/* SORT */}
          {data.length > 0 && (
            <div className={style.sortBar}>
              <span className={style.sortLabel}>SORT</span>

              <div
                className={style.sortSelectWrapper}
                onMouseEnter={handleSortMouseEnter}
                onMouseLeave={handleSortMouseLeave}
              >
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className={style.sortSelect}
                  aria-label="Sort ingredients"
                >
                  <option value="default">Default</option>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                </select>

                <span className={style.sortArrow} aria-hidden="true">
                  <ChevronDownIcon ref={chevronRef} size={16} duration={0.7} />
                </span>
              </div>
            </div>
          )}

          {/* GRID */}
          <div className={style.grid}>
            {visibleItems.map((ingredient, index) => {
              const imageUrl = getImageUrl(ingredient.strIngredient);

              return (
                <article
                  className={style.card}
                  key={ingredient.idIngredient || index}
                  onClick={() => handleOpenModal(ingredient)}
                >
                  {/* IMAGE */}
                  <div className={style.cardImageWrapper}>
                    <div className={style.imageGlow}></div>

                    <span className={style.cardNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className={style.imageHint}>VIEW →</span>

                    {imageUrl ? (
                      <img
                        className={style.cardImage}
                        src={imageUrl}
                        alt={ingredient.strIngredient}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const fallback = e.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className={style.fallbackIcon}
                      style={{
                        display: imageUrl ? "none" : "flex",
                      }}
                    >
                      🌿
                    </div>
                  </div>

                  {/* BODY */}
                  <div className={style.cardBody}>
                    <div className={style.cardTitleRow}>
                      <h3 className={style.cardTitle}>
                        {ingredient.strIngredient}
                      </h3>

                      <span className={style.cardArrow}>↗</span>
                    </div>

                    <div className={style.cardFooter}>
                      <span className={style.cardId}>INGREDIENT</span>

                      <span className={style.cardIdNumber}>
                        #{ingredient.idIngredient}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* LOAD MORE */}
          {hasMore && (
            <div className={style.loadMoreWrapper}>
              <button
                className={style.loadMoreBtn}
                type="button"
                onClick={handleLoadMore}
              >
                <span>Load More Ingredients</span>

                <small>{sortedData.length - visibleCount} left</small>

                <b>↓</b>
              </button>
            </div>
          )}
        </section>

        {/* BOTTOM BANNER */}
        <div className={style.bottomBanner}>
          <div className={style.bannerIcon}>🌿</div>

          <div className={style.bannerText}>
            <span>FROM PANTRY TO PLATE</span>

            <h2>
              Every great recipe <em>starts somewhere.</em>
            </h2>
          </div>

          <div className={style.bannerDecoration}>✦</div>
        </div>

        {/* FOOTER */}
        <footer className={style.footer}>
          <span>TASTORA · INGREDIENT COLLECTION</span>

          <span>DISCOVER · CREATE · ENJOY</span>
        </footer>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedIngredient && (
        <IngredientModal
          ingredient={selectedIngredient}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
