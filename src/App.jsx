import { useState } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Footer from "./components/Footer";

import Home from "./components/Home/Home";
import Food from "./components/Food/Food";
import Ingredients from "./components/Ingredients/Ingredients";

import RandomRecipea from "./components/Recipes/RandomRecipea";
import RecipeaDetails from "./components/Recipes/RecipeaDetails";

import RandomPage from "./components/Drinks/RandomPage";
import Drinksdetails from "./components/Drinks/Drinksdetails";

import Favorite from "./components/Favorite";
import MealPlanner from "./components/new/MealPlanner";

import NotFound from "./components/NotFound";

/* =========================================================
   RECIPE DETAILS ROUTE
========================================================= */

function RecipeDetailsRoute() {
  const { id } = useParams();

  const isValidId = /^\d+$/.test(id);

  if (!isValidId) {
    return <NotFound />;
  }

  return <RecipeaDetails />;
}

/* =========================================================
   DRINK DETAILS ROUTE
========================================================= */

function DrinkDetailsRoute() {
  const { id } = useParams();

  const isValidId = /^\d+$/.test(id);

  if (!isValidId) {
    return <NotFound />;
  }

  return <Drinksdetails />;
}

/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");

  const [foodSearchTrigger, setFoodSearchTrigger] = useState(0);
  const [ingredientSearchTrigger, setIngredientSearchTrigger] = useState(0);

  const [modalMeal, setModalMeal] = useState(null);

  /* =======================================================
     SEARCH MENU
  ======================================================= */

  const getSearchMenu = () => {
    const path = location.pathname;

    if (path === "/recipes" || path.startsWith("/recipes/")) {
      return 1;
    }

    if (path === "/food" || path.startsWith("/food/")) {
      return 2;
    }

    if (path === "/ingredients" || path.startsWith("/ingredients/")) {
      return 3;
    }

    if (path === "/drinks" || path.startsWith("/drinks/")) {
      return 4;
    }

    return 0;
  };

  const searchMenu = getSearchMenu();

  const showSearch = searchMenu !== 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className={`main ${theme === "dark" ? "dark" : "light"}`}>
      <Navbar />

      {showSearch && (
        <Search
          query={query}
          setQuery={setQuery}
          menu={searchMenu}
          setFoodSearchTrigger={setFoodSearchTrigger}
          setIngredientSearchTrigger={setIngredientSearchTrigger}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/recipes" element={<RandomRecipea />} />

        <Route path="/recipes/:id" element={<RecipeDetailsRoute />} />

        <Route
          path="/food"
          element={
            <Food
              query={query}
              foodSearchTrigger={foodSearchTrigger}
              modalMeal={modalMeal}
              setModalMeal={setModalMeal}
            />
          }
        />

        <Route
          path="/ingredients"
          element={
            <Ingredients
              query={query}
              ingredientSearchTrigger={ingredientSearchTrigger}
            />
          }
        />

        <Route path="/drinks" element={<RandomPage />} />

        <Route path="/drinks/:id" element={<DrinkDetailsRoute />} />

        <Route
          path="/favorites"
          element={<Favorite setModalMeal={setModalMeal} />}
        />

        <Route
          path="/meal-planner"
          element={<MealPlanner setModalMeal={setModalMeal} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return <AppContent />;
}
