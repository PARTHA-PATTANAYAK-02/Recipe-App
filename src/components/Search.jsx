/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import style from "../css/search.module.css";
import { SearchIcon } from "@animateicons/react/lucide";

import FoodList from "./Recipes/FoodList";
import DrinkList from "./Drinks/DrinkList";

export default function Search({
  query,
  setQuery,
  menu,
  setFoodSearchTrigger,
  setIngredientSearchTrigger,
}) {
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const placeHolder = [
    {},
    {
      p: "Search for a recipe...",
      m: "What are you craving today? 🍴",
    },
    {
      p: "Search for food...",
      m: "Discover something delicious. ✨",
    },
    {
      p: "Search ingredients...",
      m: "Find the perfect ingredients. 🌿",
    },
    {
      p: "Search for a drink...",
      m: "Sip, relax, and enjoy. 🍹",
    },
  ];

  /*
   * =========================================================
   * RESET SEARCH WHEN ROUTE / SEARCH TYPE CHANGES
   * =========================================================
   */

  useEffect(() => {
    setQuery("");
  }, [menu]);

  /*
   * =========================================================
   * SEARCH BUTTON
   * =========================================================
   */

  const handleSearch = () => {
    if (query.trim() === "") return;

    if (menu === 2) {
      setFoodSearchTrigger((prev) => prev + 1);
    } else if (menu === 3) {
      setIngredientSearchTrigger((prev) => prev + 1);
    }
  };

  /*
   * =========================================================
   * SEARCH BUTTON ONLY FOR FOOD / INGREDIENTS
   * =========================================================
   */

  const showSearchButton = menu === 2 || menu === 3;

  /*
   * =========================================================
   * CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
   * =========================================================
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={style.searchBox} ref={ref}>
      <div className={style.decorCircleOne}></div>
      <div className={style.decorCircleTwo}></div>

      <div className={style.content}>
        <div className={style.eyebrow}>
          <span className={style.eyebrowDot}></span>
          {menu === 4 ? "DRINK DISCOVERY" : "FOOD DISCOVERY"}
        </div>

        <h1 className={style.message}>{placeHolder[menu].m}</h1>

        <div className={style.searchArea}>
          <div
            className={`${style.search} ${
              isFocused ? style.searchFocused : ""
            }`}
            onMouseEnter={() => ref.current?.startAnimation?.()}
            onMouseLeave={() => ref.current?.stopAnimation?.()}
          >
            <div className={style.iconWrapper}>
              <SearchIcon
                ref={ref}
                size={25}
                duration={1}
                color="#557b45"
              />
            </div>

            <div className={style.inputWrapper}>
              <span className={style.inputLabel}>
                {menu === 4
                  ? "Find your next drink"
                  : menu === 3
                    ? "Search by ingredient"
                    : menu === 2
                      ? "Search for a food"
                      : "Find a recipe"}
              </span>

              <input
                type="text"
                placeholder={placeHolder[menu].p}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                onFocus={() => {
                  setIsFocused(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
              />
            </div>

            {query.trim() !== "" && (
              <button
                className={`${style.clearButton} ${
                  showSearchButton ? style.withSearchButton : ""
                }`}
                type="button"
                aria-label="Clear search"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setQuery("")}
              >
                ×
              </button>
            )}

            {showSearchButton && (
              <button
                className={style.searchButton}
                type="button"
                onClick={handleSearch}
                disabled={query.trim() === ""}
              >
                <span>Search</span>
                <span className={style.arrow}>→</span>
              </button>
            )}
          </div>

          {menu === 1 && query.trim() !== "" && (
            <div
              className={style.suggestionWrapper}
              style={{
                display: isFocused ? "block" : "none",
              }}
            >
              <FoodList
                query={query}
                setQuery={setQuery}
              />
            </div>
          )}

          {menu === 4 && query.trim() !== "" && (
            <div
              className={style.suggestionWrapper}
              style={{
                display: isFocused ? "block" : "none",
              }}
            >
              <DrinkList
                query={query}
                setQuery={setQuery}
              />
            </div>
          )}
        </div>

        {menu === 1 || menu === 4 ? (
          <div className={style.searchHint}>
            <span>⌕</span>
            Explore suggestions
          </div>
        ) : (
          <div className={style.searchHint}>
            <span>↵</span>
            Press Enter to search or click on search
          </div>
        )}
      </div>
    </div>
  );
}