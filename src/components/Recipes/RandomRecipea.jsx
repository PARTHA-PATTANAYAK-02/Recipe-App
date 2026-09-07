import { useEffect } from "react";

const URL = import.meta.env.VITE_MEAL_API_URL;

export default function RandomRecipea({ setFoodId }) {
  useEffect(() => {
    async function fetchRandomRecipe() {
      try {
        const res = await fetch(`${URL}/random.php`);

        if (!res.ok) {
          throw new Error("Unable to fetch a random recipe");
        }

        const data = await res.json();

        const randomMeal = data.meals?.[0];

        if (randomMeal) {
          setFoodId(randomMeal.idMeal);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRandomRecipe();
  }, [setFoodId]);

  return null;
}
