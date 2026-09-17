/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-useless-assignment */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../context/ThemeContext";

import style from "../../css/MealPlanner/mealPlannerButton.module.css";

import { ChevronDownIcon, CheckIcon } from "@animateicons/react/lucide";

const days = [
  {
    key: "monday",
    label: "Monday",
  },
  {
    key: "tuesday",
    label: "Tuesday",
  },
  {
    key: "wednesday",
    label: "Wednesday",
  },
  {
    key: "thursday",
    label: "Thursday",
  },
  {
    key: "friday",
    label: "Friday",
  },
  {
    key: "saturday",
    label: "Saturday",
  },
  {
    key: "sunday",
    label: "Sunday",
  },
];

const mealTimes = [
  {
    key: "breakfast",
    label: "Breakfast",
  },
  {
    key: "lunch",
    label: "Lunch",
  },
  {
    key: "dinner",
    label: "Dinner",
  },
];

export default function MealPlannerButton({ meal }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const [day, setDay] = useState("monday");

  const [mealTime, setMealTime] = useState("breakfast");

  const [planner, setPlanner] = useState({});

  const [isAdding, setIsAdding] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const chevronRef = useRef(null);

  const successCheckRef = useRef(null);

  /* =========================================================
     GET MEAL ID
  ========================================================= */

  const getMealId = (item) => {
    return String(item?.id ?? item?.idMeal ?? "");
  };

  /* =========================================================
     LOAD PLANNER
  ========================================================= */

  const loadPlanner = () => {
    const saved = localStorage.getItem("mealPlanner");

    try {
      setPlanner(saved ? JSON.parse(saved) : {});
    } catch {
      setPlanner({});
    }
  };

  /* =========================================================
     LOAD WHEN MODAL OPENS
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadPlanner();

    const handlePlannerUpdate = () => {
      loadPlanner();
    };

    window.addEventListener("mealPlannerUpdated", handlePlannerUpdate);

    return () => {
      window.removeEventListener("mealPlannerUpdated", handlePlannerUpdate);
    };
  }, [isOpen]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isAdding && !isSuccess) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isAdding, isSuccess]);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* =========================================================
     SELECT ARROW ANIMATION
  ========================================================= */

  const handleSelectMouseEnter = () => {
    chevronRef.current?.startAnimation();
  };

  const handleSelectMouseLeave = () => {
    chevronRef.current?.stopAnimation();
  };

  /* =========================================================
     FIND WHERE THIS MEAL IS ALREADY PLANNED
  ========================================================= */

  const alreadyPlannedSlots = [];

  days.forEach((dayItem) => {
    mealTimes.forEach((mealItem) => {
      const plannedMeal = planner?.[dayItem.key]?.[mealItem.key];

      if (plannedMeal && getMealId(plannedMeal) === getMealId(meal)) {
        alreadyPlannedSlots.push({
          day: dayItem.key,

          dayLabel: dayItem.label,

          mealTime: mealItem.key,

          mealLabel: mealItem.label,
        });
      }
    });
  });

  /* =========================================================
     CURRENT SLOT
  ========================================================= */

  const selectedSlotMeal = planner?.[day]?.[mealTime] ?? null;

  const isCurrentSlotOccupied = Boolean(selectedSlotMeal);

  const isCurrentSlotAlreadyThisMeal =
    isCurrentSlotOccupied && getMealId(selectedSlotMeal) === getMealId(meal);

  /* =========================================================
     SLOT STATUS
  ========================================================= */

  const getSlotStatus = (slotKey) => {
    const existingMeal = planner?.[day]?.[slotKey] ?? null;

    return {
      occupied: Boolean(existingMeal),

      sameMeal:
        Boolean(existingMeal) && getMealId(existingMeal) === getMealId(meal),
    };
  };

  /* =========================================================
     ADD MEAL
  ========================================================= */

  const handleAdd = () => {
    if (!meal || isCurrentSlotOccupied || isAdding || isSuccess) {
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      let currentPlanner = {};

      const saved = localStorage.getItem("mealPlanner");

      try {
        currentPlanner = saved ? JSON.parse(saved) : {};
      } catch {
        currentPlanner = {};
      }

      /* -----------------------------------------------------
         CREATE DAY IF NEEDED
      ----------------------------------------------------- */

      if (!currentPlanner[day]) {
        currentPlanner[day] = {
          breakfast: null,
          lunch: null,
          dinner: null,
        };
      }

      /* -----------------------------------------------------
         NEVER OVERWRITE EXISTING SLOT
      ----------------------------------------------------- */

      if (currentPlanner[day][mealTime]) {
        setPlanner(currentPlanner);

        setIsAdding(false);

        return;
      }

      /* -----------------------------------------------------
         NORMALIZE MEAL DATA
      ----------------------------------------------------- */

      const mealData = {
        id: meal?.id ?? meal?.idMeal,

        name: meal?.name ?? meal?.strMeal ?? meal?.strDrink ?? "",

        image:
          meal?.image ??
          meal?.strMealThumb ??
          meal?.strDrinkThumb ??
          meal?.thumbnail,

        type:
          meal?.type ?? meal?.strCategory ?? meal?.strDrinkCategory ?? "Recipe",

        data: meal?.data ?? meal,
      };

      /* -----------------------------------------------------
         ADD TO SLOT
      ----------------------------------------------------- */

      currentPlanner[day][mealTime] = mealData;

      localStorage.setItem("mealPlanner", JSON.stringify(currentPlanner));

      /* -----------------------------------------------------
         INFORM MEAL PLANNER PAGE
      ----------------------------------------------------- */

      window.dispatchEvent(new Event("mealPlannerUpdated"));

      setPlanner(currentPlanner);

      setIsAdding(false);

      setIsSuccess(true);

      /* -----------------------------------------------------
         SUCCESS ICON ANIMATION
      ----------------------------------------------------- */

      setTimeout(() => {
        successCheckRef.current?.startAnimation();
      }, 50);

      /* -----------------------------------------------------
         CLOSE AFTER SUCCESS
      ----------------------------------------------------- */

      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 1500);
    }, 450);
  };

  /* =========================================================
     CLOSE
  ========================================================= */

  const handleClose = () => {
    if (isAdding || isSuccess) {
      return;
    }

    setIsOpen(false);
  };

  /* =========================================================
     DISPLAY DATA
  ========================================================= */

  const selectedMealName =
    meal?.name ?? meal?.strMeal ?? meal?.strDrink ?? "Selected meal";

  const selectedMealImage =
    meal?.image ?? meal?.strMealThumb ?? meal?.strDrinkThumb ?? meal?.thumbnail;

  const selectedMealType =
    meal?.type ?? meal?.strCategory ?? meal?.strDrinkCategory ?? "Recipe";

  const selectedDayLabel = days.find((item) => item.key === day)?.label ?? day;

  const selectedMealTimeLabel =
    mealTimes.find((item) => item.key === mealTime)?.label ?? mealTime;

  /* =========================================================
     MODAL
     
     IMPORTANT:
     createPortal renders the popup directly inside BODY.
     
     So the popup is NOT trapped inside:
     - cards
     - sections
     - transformed parents
     - overflow containers
     - animated components
  ========================================================= */

  const modal = isOpen ? (
    <div
      className={`${style.overlay} ${theme === "dark" ? style.dark : style.light}`}
      onClick={handleClose}
    >
      <div className={style.modal} onClick={(event) => event.stopPropagation()}>
        <div className={style.modalGlow}></div>

        {isSuccess ? (
          /* =================================================
             SUCCESS STATE
          ================================================= */

          <div className={style.successState}>
            <div className={style.successCircle}>
              <CheckIcon ref={successCheckRef} size={28} duration={0.8} />
            </div>

            <span className={style.successEyebrow}>MEAL PLANNED</span>

            <h2>Added successfully!</h2>

            <p>
              <strong>{selectedMealName}</strong>
              <br />
              has been added to your meal plan.
            </p>

            <div className={style.successLocation}>
              <span>{selectedDayLabel}</span>

              <i>•</i>

              <span>{selectedMealTimeLabel}</span>
            </div>

            <div className={style.successProgress}>
              <span></span>
            </div>
          </div>
        ) : (
          /* =================================================
             MAIN FORM
          ================================================= */

          <>
            <div className={style.modalHeader}>
              <div>
                <span className={style.eyebrow}>PLAN YOUR WEEK</span>

                <h2>Add to Meal Planner</h2>

                <p>Choose when you want to enjoy this meal.</p>
              </div>

              <button
                type="button"
                className={style.closeButton}
                onClick={handleClose}
                disabled={isAdding}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* =============================================
                MEAL PREVIEW
            ============================================= */}

            <div className={style.mealPreview}>
              {selectedMealImage && (
                <img src={selectedMealImage} alt={selectedMealName} />
              )}

              <div className={style.previewInfo}>
                <span>{selectedMealType}</span>

                <h3>{selectedMealName}</h3>
              </div>
            </div>

            {/* =============================================
                FORM
            ============================================= */}

            <div className={style.form}>
              {/* -------------------------------------------
                  DAY
              ------------------------------------------- */}

              <div className={style.formGroup}>
                <label htmlFor="planner-day">DAY</label>

                <div
                  className={style.selectWrapper}
                  onMouseEnter={handleSelectMouseEnter}
                  onMouseLeave={handleSelectMouseLeave}
                >
                  <select
                    id="planner-day"
                    value={day}
                    onChange={(event) => setDay(event.target.value)}
                    className={style.select}
                    disabled={isAdding}
                  >
                    {days.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <span className={style.selectArrow} aria-hidden="true">
                    <ChevronDownIcon
                      ref={chevronRef}
                      size={16}
                      duration={0.7}
                    />
                  </span>
                </div>
              </div>

              {/* -------------------------------------------
                  MEAL TIME
              ------------------------------------------- */}

              <div className={style.formGroup}>
                <span className={style.formLabel}>MEAL</span>

                <div className={style.mealOptions}>
                  {mealTimes.map((item) => {
                    const slotStatus = getSlotStatus(item.key);

                    return (
                      <label
                        key={item.key}
                        className={`
                            ${style.mealOption}

                            ${mealTime === item.key ? style.selected : ""}

                            ${slotStatus.occupied ? style.disabledOption : ""}
                          `}
                      >
                        <input
                          type="radio"
                          name="mealTime"
                          value={item.key}
                          checked={mealTime === item.key}
                          onChange={(event) => setMealTime(event.target.value)}
                          disabled={slotStatus.occupied || isAdding}
                        />

                        <span className={style.radio}></span>

                        <span className={style.optionText}>{item.label}</span>

                        {slotStatus.occupied && (
                          <span className={style.usedBadge}>
                            {slotStatus.sameMeal ? "Added" : "Occupied"}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* =========================================
                  ALREADY PLANNED
              ========================================= */}

              {alreadyPlannedSlots.length > 0 && (
                <div className={style.alreadyPlanned}>
                  <div className={style.alreadyIcon}>✓</div>

                  <div className={style.alreadyContent}>
                    <span className={style.alreadyTitle}>Already planned</span>

                    <div className={style.plannedLocations}>
                      {alreadyPlannedSlots.map((item) => (
                        <span
                          key={`${item.day}-${item.mealTime}`}
                          className={style.plannedLocation}
                        >
                          {item.dayLabel}

                          {" • "}

                          {item.mealLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================
                  CURRENT SLOT WARNING
              ========================================= */}

              {isCurrentSlotOccupied && (
                <div className={style.slotWarning}>
                  <span>•</span>

                  <p>
                    {isCurrentSlotAlreadyThisMeal
                      ? "This meal is already added to this slot."
                      : "This meal slot is already occupied."}
                  </p>
                </div>
              )}
            </div>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <div className={style.actions}>
              <button
                type="button"
                className={style.cancelButton}
                onClick={handleClose}
                disabled={isAdding}
              >
                Cancel
              </button>

              <button
                type="button"
                className={style.addButton}
                onClick={handleAdd}
                disabled={isCurrentSlotOccupied || isAdding}
              >
                {isAdding ? (
                  <>
                    <span className={style.spinner}></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <span>+</span>
                    Add Meal
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      <button
        type="button"
        className={`${style.plannerButton} ${theme === "dark" ? style.dark : style.light}`}
        onClick={() => {
          loadPlanner();

          setIsSuccess(false);

          setIsAdding(false);

          setIsOpen(true);
        }}
      >
        <span className={style.plus}>+</span>

        <span>Add to Meal Planner</span>
      </button>

      {/* =====================================================
          RENDER MODAL DIRECTLY INTO BODY
      ===================================================== */}

      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
}
