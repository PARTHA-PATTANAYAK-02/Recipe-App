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

export default function App() {
  const [menu, setMenu] = useState(0);
  const [query, setQuery] = useState("");

  const [foodId, setFoodId] = useState(null);
  const [foodSearchTrigger, setFoodSearchTrigger] = useState(0);

  const [ingredientSearchTrigger, setIngredientSearchTrigger] = useState(0);

  const [drinkId, setDrinkId] = useState(null);

  const handleMenuChange = (index) => {
    setMenu(index);
    setQuery("");
  };

  const handleRandomDrink = () => {
    setDrinkId(null);
  };

  const handleRandomRecipe = () => {
    setFoodId(null);
  };

  const components = [
    <Home />,

    foodId === null ? (
      <RandomRecipea setFoodId={setFoodId} />
    ) : (
      <RecipeaDetails foodId={foodId} handleRandomRecipe={handleRandomRecipe} />
    ),

    <Food query={query} foodSearchTrigger={foodSearchTrigger} />,

    <Ingredients
      query={query}
      ingredientSearchTrigger={ingredientSearchTrigger}
    />,

    drinkId === null ? (
      <RandomPage />
    ) : (
      <Drinksdetails drinkId={drinkId} handleRandomDrink={handleRandomDrink} />
    ),
  ];

  return (
    <div className="main">
      <Navbar setMenu={handleMenuChange} />

      {menu !== 0 && (
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
