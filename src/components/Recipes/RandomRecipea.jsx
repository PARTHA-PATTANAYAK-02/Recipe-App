import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_MEAL_API_URL;

export default function RandomRecipea() {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRandomRecipe() {
      try {
        const res = await fetch(`${URL}/random.php`);

        if (!res.ok) {
          throw new Error("Unable to fetch a random recipe");
        }

        const data = await res.json();
        const randomMeal = data.meals?.[0];

        if (randomMeal?.idMeal) {
          navigate(`/recipes/${randomMeal.idMeal}`, {
            replace: true,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRandomRecipe();
  }, [navigate]);

  return null;
}
