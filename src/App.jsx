import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Food from "./components/Food/Food";
import Search from "./components/Search";
import Footer from "./components/Footer";
import RecipeaDetails from "./components/Recipes/RecipeaDetails";
import Ingredients from "./components/Ingredients/Ingredients";
import Home from "./components/Home/Home";
import Drinksdetails from "./components/Drinks/Drinksdetails";
import RandomPage from "./components/Drinks/RandomPage";
import RandomRecipea from "./components/Recipes/RandomRecipea";
import Favorite from "./components/Favorite";

export default function App() {
  const [menu, setMenu] = useState(0);
  const [query, setQuery] = useState("");

  const [foodId, setFoodId] = useState(null);
  const [foodSearchTrigger, setFoodSearchTrigger] = useState(0);

  const [ingredientSearchTrigger, setIngredientSearchTrigger] = useState(0);

  const [drinkId, setDrinkId] = useState(null);

  const [fromFavorites, setFromFavorites] = useState(false);

  const [modalMeal, setModalMeal] = useState(null);

  const handleMenuChange = (index) => {
    setMenu(index);
    setQuery("");
    setFromFavorites(false);
  };

  const handleRandomDrink = () => {
    setDrinkId(null);
  };

  const handleRandomRecipe = () => {
    setFoodId(null);
  };

  const components = [
    <Home
      fromFavorites={fromFavorites}
      setFromFavorites={setFromFavorites}
      setMenu={setMenu}
    />,

    foodId === null ? (
      <RandomRecipea
        setFoodId={setFoodId}
        setFromFavorites={setFromFavorites}
        setMenu={setMenu}
      />
    ) : (
      <RecipeaDetails
        foodId={foodId}
        handleRandomRecipe={handleRandomRecipe}
        fromFavorites={fromFavorites}
        setFromFavorites={setFromFavorites}
        setMenu={setMenu}
      />
    ),

    <Food
      query={query}
      foodSearchTrigger={foodSearchTrigger}
      fromFavorites={fromFavorites}
      setFromFavorites={setFromFavorites}
      setMenu={setMenu}
      modalMeal={modalMeal}
      setModalMeal={setModalMeal}
    />,

    <Ingredients
      query={query}
      ingredientSearchTrigger={ingredientSearchTrigger}
      fromFavorites={fromFavorites}
    />,

    drinkId === null ? (
      <RandomPage
        fromFavorites={fromFavorites}
        setFromFavorites={setFromFavorites}
        setMenu={setMenu}
      />
    ) : (
      <Drinksdetails
        drinkId={drinkId}
        handleRandomDrink={handleRandomDrink}
        fromFavorites={fromFavorites}
        setFromFavorites={setFromFavorites}
        setMenu={setMenu}
      />
    ),

    <Favorite
      setMenu={setMenu}
      setFoodId={setFoodId}
      setDrinkId={setDrinkId}
      setFromFavorites={setFromFavorites}
      setModalMeal={setModalMeal}
    />,
  ];
  return (
    <div className="main">
      <Navbar setMenu={handleMenuChange} menuId={menu} />

      {menu !== 0 && menu !== 5 && (
        <Search
          query={query}
          setQuery={setQuery}
          setFoodId={setFoodId}
          menu={menu}
          setFoodSearchTrigger={setFoodSearchTrigger}
          setIngredientSearchTrigger={setIngredientSearchTrigger}
          setDrinkId={setDrinkId}
        />
      )}

      {components[menu]}

      <Footer />
    </div>
  );
}
