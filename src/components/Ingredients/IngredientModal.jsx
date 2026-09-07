import { useEffect } from "react";
import style from "../../css/Ingredients/modal.module.css";
const IMAGE_URL = import.meta.env.VITE_MEAL_IMAGE_URL;
export default function IngredientModal({ ingredient, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!ingredient) return null;

  const imageName = ingredient.strIngredient?.trim().replace(/\s+/g, "_");

  const imageUrl = imageName
    ? `${IMAGE_URL}${encodeURIComponent(imageName)}.png`
    : null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={style.backdrop} onMouseDown={handleBackdropClick}>
      <div className={style.modalWindow}>
        {/* CLOSE */}
        <button
          className={style.dismissBtn}
          type="button"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* IMAGE AREA */}
        <div className={style.mediaImageWrapper}>
          <div className={style.imageDecoration}></div>

          <div className={style.imageLabel}>
            <span>✦</span>
            INGREDIENT
          </div>

          {imageUrl ? (
            <img
              className={style.modalImage}
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
            className={style.modalFallback}
            style={{
              display: imageUrl ? "none" : "flex",
            }}
          >
            🌿
          </div>

          <div className={style.imageBottomLine}>
            <span>ID #{ingredient.idIngredient}</span>

            <span>THEMEALDB</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className={style.modalTextContent}>
          <div className={style.modalHeaderMeta}>
            <span className={style.categoryTag}>INGREDIENT</span>

            <span className={style.idTag}>#{ingredient.idIngredient}</span>
          </div>

          <div className={style.titleArea}>
            <p className={style.titleEyebrow}>INGREDIENT DETAILS</p>

            <h2 className={style.modalMainTitle}>{ingredient.strIngredient}</h2>

            <p className={style.titleDescription}>
              A simple ingredient can be the starting point for something
              delicious.
            </p>
          </div>

          {/* INFO CARD */}
          <div className={style.infoCard}>
            <div className={style.infoCardHeader}>
              <div>
                <span className={style.infoEyebrow}>ABOUT THIS INGREDIENT</span>

                <h3>Ingredient Information</h3>
              </div>

              <div className={style.infoIcon}>🌱</div>
            </div>

            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Name</span>

                <strong>{ingredient.strIngredient || "—"}</strong>
              </div>

              <div className={style.infoItem}>
                <span className={style.infoLabel}>ID</span>

                <strong>#{ingredient.idIngredient || "—"}</strong>
              </div>

              <div className={style.infoItem}>
                <span className={style.infoLabel}>Type</span>

                <strong>{ingredient.strType || "Not specified"}</strong>
              </div>

              <div className={style.infoItem}>
                <span className={style.infoLabel}>Alcohol</span>

                <strong>{ingredient.strAlcohol || "Not specified"}</strong>
              </div>

              <div className={style.infoItem}>
                <span className={style.infoLabel}>ABV</span>

                <strong>{ingredient.strABV || "Not specified"}</strong>
              </div>

              <div className={style.infoItem}>
                <span className={style.infoLabel}>Image</span>

                <strong className={style.imageFile}>
                  {ingredient.strIngredient ? "Available" : "Unavailable"}
                </strong>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className={style.modalFooterActions}>
            <button
              className={style.closeActionBtn}
              type="button"
              onClick={onClose}
            >
              Done
            </button>
          </div>

          {/* NOTE */}
          <div className={style.modalNote}>
            <span>✦</span>

            <p>Great dishes begin with great ingredients.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
