import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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

function AppContent() {
  const location = useLocation();

  const [query, setQuery] = useState("");

  const [foodSearchTrigger, setFoodSearchTrigger] = useState(0);
  const [ingredientSearchTrigger, setIngredientSearchTrigger] = useState(0);

  const [modalMeal, setModalMeal] = useState(null);

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

  return (
    <div className="main">
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
        {/* ================= HOME ================= */}

        <Route path="/" element={<Home />} />

        {/* ================= RECIPES ================= */}

        <Route path="/recipes" element={<RandomRecipea />} />

        <Route path="/recipes/:id" element={<RecipeaDetails />} />

        {/* ================= FOOD ================= */}

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

        {/* ================= INGREDIENTS ================= */}

        <Route
          path="/ingredients"
          element={
            <Ingredients
              query={query}
              ingredientSearchTrigger={ingredientSearchTrigger}
            />
          }
        />

        {/* ================= DRINKS ================= */}

        <Route path="/drinks" element={<RandomPage />} />

        <Route path="/drinks/:id" element={<Drinksdetails />} />

        {/* ================= FAVORITES ================= */}

        <Route
          path="/favorites"
          element={<Favorite setModalMeal={setModalMeal} />}
        />

        {/* ================= MEAL PLANNER ================= */}

        <Route
          path="/meal-planner"
          element={<MealPlanner setModalMeal={setModalMeal} />}
        />

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
