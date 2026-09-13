/* eslint-disable no-useless-assignment */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import style from "../../css/MealPlanner/mealPlanner.module.css";
import { EyeIcon, Trash2Icon, CheckIcon } from "@animateicons/react/lucide";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const mealTimes = [
  {
    key: "breakfast",
    label: "Breakfast",
    icon: "☀",
  },
  {
    key: "lunch",
    label: "Lunch",
    icon: "◒",
  },
  {
    key: "dinner",
    label: "Dinner",
    icon: "☾",
  },
];

export default function MealPlanner({
  setMenu,
  setFoodId,
  setDrinkId,
  setModalMeal,
}) {
  const [planner, setPlanner] = useState({});
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [deletedSlot, setDeletedSlot] = useState(null);

  const successRef = useRef(null);

  const loadPlanner = () => {
    const saved = localStorage.getItem("mealPlanner");

    try {
      setPlanner(saved ? JSON.parse(saved) : {});
    } catch {
      setPlanner({});
    }
  };

  useEffect(() => {
    loadPlanner();

    const handlePlannerUpdate = () => {
      loadPlanner();
    };

    window.addEventListener("mealPlannerUpdated", handlePlannerUpdate);

    return () => {
      window.removeEventListener("mealPlannerUpdated", handlePlannerUpdate);
    };
  }, []);

  const plannedMeals = days.reduce((total, day) => {
    return (
      total + mealTimes.filter((meal) => planner?.[day]?.[meal.key]).length
    );
  }, 0);

  const totalMeals = days.length * mealTimes.length;

  const remainingMeals = totalMeals - plannedMeals;

  const progress = totalMeals > 0 ? (plannedMeals / totalMeals) * 100 : 0;

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getDayShort = (day) => {
    return day.slice(0, 3).toUpperCase();
  };
  const handleOpenMealPlanner = (item) => {
    if (item.type === "recipe") {
      setFoodId(item.id);
      setMenu(1);
    }

    if (item.type === "food") {
      setModalMeal(item.data);
      setMenu(2);
    }

    if (item.type === "drink") {
      setDrinkId(item.id);
      setMenu(4);
    }
  };
  const handleDelete = (day, mealKey) => {
    const item = planner?.[day]?.[mealKey];

    if (!item) return;

    const slotId = `${day}-${mealKey}`;

    setDeletingSlot(slotId);

    setTimeout(() => {
      const saved = localStorage.getItem("mealPlanner");

      let currentPlanner = {};

      try {
        currentPlanner = saved ? JSON.parse(saved) : {};
      } catch {
        currentPlanner = {};
      }

      if (currentPlanner?.[day]) {
        currentPlanner[day][mealKey] = null;
      }

      localStorage.setItem("mealPlanner", JSON.stringify(currentPlanner));

      setPlanner(currentPlanner);

      window.dispatchEvent(new Event("mealPlannerUpdated"));

      setDeletingSlot(null);
      setDeletedSlot(slotId);

      setTimeout(() => {
        successRef.current?.startAnimation();
      }, 30);

      setTimeout(() => {
        setDeletedSlot(null);
      }, 900);
    }, 350);
  };

  return (
    <main className={style.mealPlanner}>
      <div className={style.pageGlow}></div>
      <div className={style.pageGlowTwo}></div>

      <div className={style.container}>
        {/* ================= HERO ================= */}

        <header className={style.hero}>
          <div className={style.heroIntro}>
            <span className={style.eyebrow}>
              <i>✦</i>
              YOUR WEEK
            </span>

            <h1>
              Meal
              <span> Planner.</span>
            </h1>

            <p>A simple view of everything you have planned for the week.</p>
          </div>

          <div className={style.heroSummary}>
            <div className={style.summaryMain}>
              <span>WEEKLY PROGRESS</span>

              <strong>
                {plannedMeals}
                <small> / {totalMeals}</small>
              </strong>

              <p>
                {plannedMeals === totalMeals
                  ? "Your week is fully planned."
                  : `${remainingMeals} ${
                      remainingMeals === 1 ? "slot" : "slots"
                    } still open.`}
              </p>
            </div>

            <div className={style.progressCircle}>
              <svg viewBox="0 0 42 42" aria-hidden="true">
                <circle className={style.progressBg} cx="21" cy="21" r="17" />

                <circle
                  className={style.progressValue}
                  cx="21"
                  cy="21"
                  r="17"
                  style={{
                    strokeDasharray: `${progress} 100`,
                  }}
                />
              </svg>

              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </header>

        {/* ================= SECTION HEADER ================= */}

        <div className={style.sectionHeader}>
          <div>
            <span className={style.sectionEyebrow}>THIS WEEK</span>

            <h2>Your meal schedule</h2>
          </div>

          <div className={style.slotLegend}>
            <span>
              <i className={style.plannedDot}></i>
              Planned
            </span>

            <span>
              <i className={style.emptyDot}></i>
              Available
            </span>
          </div>
        </div>

        {/* ================= WEEK ================= */}

        <section className={style.weekList}>
          {days.map((day, dayIndex) => {
            const dayMeals = planner?.[day] || {};

            const dayMealCount = mealTimes.filter(
              (meal) => dayMeals[meal.key],
            ).length;

            return (
              <article
                key={day}
                className={`${style.dayCard} ${
                  dayMealCount === 3 ? style.dayComplete : ""
                }`}
              >
                {/* DAY HEADER */}

                <div className={style.dayHeader}>
                  <div className={style.dayNumber}>
                    {String(dayIndex + 1).padStart(2, "0")}
                  </div>

                  <div className={style.dayName}>
                    <span>{getDayShort(day)}</span>

                    <h3>{getDayLabel(day)}</h3>
                  </div>

                  <div
                    className={`${style.dayCount} ${
                      dayMealCount === 3 ? style.completeCount : ""
                    }`}
                  >
                    {dayMealCount}/3
                  </div>
                </div>

                {/* MEALS */}

                <div className={style.dayMeals}>
                  {mealTimes.map((meal) => {
                    const item = dayMeals[meal.key];

                    const slotId = `${day}-${meal.key}`;

                    const isDeleting = deletingSlot === slotId;

                    const isDeleted = deletedSlot === slotId;

                    return (
                      <div
                        key={meal.key}
                        className={`${style.mealSlot} ${
                          item ? style.plannedSlot : style.emptySlot
                        } ${isDeleting ? style.deleting : ""} ${
                          isDeleted ? style.deleted : ""
                        }`}
                      >
                        {/* SLOT HEADER */}

                        <div className={style.slotHeader}>
                          <span className={style.slotIcon}>{meal.icon}</span>

                          <span className={style.slotLabel}>{meal.label}</span>
                        </div>

                        {item ? (
                          <div className={style.plannedContent}>
                            {/* IMAGE */}

                            <div className={style.imageWrapper}>
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <div className={style.noImage}>🍽</div>
                              )}
                            </div>

                            {/* INFO */}

                            <div className={style.mealInfo}>
                              <span className={style.mealType}>
                                {item.type}
                              </span>

                              <h4 title={item.name}>{item.name}</h4>
                            </div>

                            {/* ACTIONS */}

                            <div className={style.mealActions}>
                              {/* VIEW BUTTON
                                  UI ONLY */}

                              <button
                                type="button"
                                className={style.iconButton}
                                aria-label={`View ${item.name}`}
                                onMouseEnter={(event) => {
                                  event.currentTarget
                                    .querySelector("svg")
                                    ?.startAnimation?.();
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget
                                    .querySelector("svg")
                                    ?.stopAnimation?.();
                                }}
                                onClick={() => handleOpenMealPlanner(meal)}
                              >
                                <EyeIcon size={16} duration={0.7} />
                              </button>

                              {/* DELETE BUTTON
                                  FUNCTIONAL */}

                              <button
                                type="button"
                                className={`${style.iconButton} ${style.deleteButton}`}
                                aria-label={`Delete ${item.name}`}
                                disabled={isDeleting}
                                onMouseEnter={(event) => {
                                  event.currentTarget
                                    .querySelector("svg")
                                    ?.startAnimation?.();
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget
                                    .querySelector("svg")
                                    ?.stopAnimation?.();
                                }}
                                onClick={() => handleDelete(day, meal.key)}
                              >
                                <Trash2Icon size={16} duration={0.7} />
                              </button>
                            </div>

                            {/* DELETE SUCCESS */}

                            {isDeleted && (
                              <div className={style.deletedOverlay}>
                                <div className={style.deletedCircle}>
                                  <CheckIcon
                                    ref={successRef}
                                    size={18}
                                    duration={0.7}
                                  />
                                </div>

                                <span>Removed</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* EMPTY SLOT */

                          <div className={style.emptyContent}>
                            <span className={style.emptyPlus}>+</span>

                            <div>
                              <strong>No meal planned</strong>

                              <small>Available slot</small>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        {/* ================= BANNER ================= */}

        <section className={style.bottomBanner}>
          <div className={style.bannerIcon}>🍽</div>

          <div className={style.bannerContent}>
            <span>GOOD FOOD · GOOD WEEK</span>

            <h2>
              Plan ahead.
              <em> Eat better.</em>
            </h2>

            <p>Keep your week organized and make every meal count.</p>
          </div>

          <div className={style.bannerDecoration}>✦</div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className={style.footer}>
          <span>TASTORA · MEAL PLANNER</span>

          <span>PLAN · PREPARE · ENJOY</span>
        </footer>
      </div>
    </main>
  );
}
