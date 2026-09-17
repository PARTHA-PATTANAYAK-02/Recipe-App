/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../css/navbar.module.css";

import { ChevronDownIcon, ArrowRightIcon } from "@animateicons/react/lucide";

import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const moreRef = useRef(null);
  const moreArrowRef = useRef(null);
  const toggleTimerRef = useRef(null);

  const primaryMenu = [
    { index: 0, label: "Home", path: "/" },
    { index: 1, label: "Recipes", path: "/recipes" },
    { index: 2, label: "Food", path: "/food" },
    { index: 4, label: "Drinks", path: "/drinks" },
  ];

  const moreMenu = [
    {
      index: 3,
      label: "Ingredients",
      description: "Explore ingredients",
      icon: "✦",
      path: "/ingredients",
    },
    {
      index: 5,
      label: "Favorite",
      description: "Your saved recipes",
      icon: "♡",
      path: "/favorites",
    },
    {
      index: 6,
      label: "Meal Planner",
      description: "Plan your weekly meals",
      icon: "◒",
      path: "/meal-planner",
    },
  ];

  /*
   * =========================================================
   * ACTIVE ROUTE
   * =========================================================
   */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isMoreActive = moreMenu.some((item) => isActive(item.path));

  /*
   * =========================================================
   * CLOSE MORE WHEN CLICKING OUTSIDE
   * =========================================================
   */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
   * =========================================================
   * ESCAPE KEY
   * =========================================================
   */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      setIsMoreOpen(false);
      setIsMobileOpen(false);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /*
   * =========================================================
   * CLEANUP TOGGLE TIMER
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (toggleTimerRef.current) {
        clearTimeout(toggleTimerRef.current);
      }
    };
  }, []);

  /*
   * =========================================================
   * MENU SELECT
   * =========================================================
   */

  const handleMenuSelect = (path) => {
    navigate(path);

    setIsMoreOpen(false);
    setIsMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * =========================================================
   * MORE ARROW ANIMATION
   * =========================================================
   */

  const handleMoreMouseEnter = () => {
    moreArrowRef.current?.startAnimation?.();
  };

  const handleMoreMouseLeave = () => {
    moreArrowRef.current?.stopAnimation?.();
  };

  /*
   * =========================================================
   * DROPDOWN ARROW ANIMATION
   * =========================================================
   */

  const handleArrowMouseEnter = (event) => {
    const svg = event.currentTarget.querySelector("svg");

    svg?.startAnimation?.();
  };

  const handleArrowMouseLeave = (event) => {
    const svg = event.currentTarget.querySelector("svg");

    svg?.stopAnimation?.();
  };

  /*
   * =========================================================
   * TOGGLES
   * =========================================================
   */

  const handleMoreToggle = () => {
    setIsMoreOpen((prev) => !prev);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen((prev) => !prev);
    setIsMoreOpen(false);
  };

  /*
   * =========================================================
   * THEME TOGGLE
   * =========================================================
   */

  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    if (isToggling) return;

    setIsToggling(true);

    toggleTheme();

    if (toggleTimerRef.current) {
      clearTimeout(toggleTimerRef.current);
    }

    toggleTimerRef.current = setTimeout(() => {
      setIsToggling(false);
    }, 900);
  };

  return (
    <nav
      className={`${style.navbar} ${
        isDark ? style.dark : style.light
      } ${isMobileOpen ? style.mobileMenuOpen : ""}`}
    >
      {/* -----------------------------------------
          BRAND
      ----------------------------------------- */}

      <button
        type="button"
        className={style.brand}
        onClick={() => handleMenuSelect("/")}
        aria-label="Go to Home"
      >
        <div className={style.logoWrapper}>
          <img className={style.logo} src="./logo.png" alt="Tastora" />
        </div>

        <div className={style.brandText}>
          <h2 className={style.name}>Tastora</h2>

          <span className={style.tagline}>Taste • Discover • Enjoy</span>
        </div>
      </button>

      {/* -----------------------------------------
          DESKTOP NAVIGATION
      ----------------------------------------- */}

      <div className={style.desktopNavigation}>
        <ul className={style.menu}>
          {primaryMenu.map((item) => {
            const active = isActive(item.path);

            return (
              <li key={item.index}>
                <button
                  type="button"
                  className={`${style.menuItem} ${active ? style.active : ""}`}
                  onClick={() => handleMenuSelect(item.path)}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}

          {/* MORE */}

          <li ref={moreRef} className={style.moreWrapper}>
            <button
              type="button"
              className={`${style.moreButton} ${
                isMoreActive ? style.moreActive : ""
              }`}
              onClick={handleMoreToggle}
              onMouseEnter={handleMoreMouseEnter}
              onMouseLeave={handleMoreMouseLeave}
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
            >
              <span>More</span>

              <ChevronDownIcon ref={moreArrowRef} size={15} duration={0.7} />
            </button>

            {/* DROPDOWN */}

            {isMoreOpen && (
              <div className={style.moreDropdown} role="menu">
                <div className={style.dropdownHeader}>
                  <div>
                    <span>EXPLORE</span>
                    <strong>More from Tastora</strong>
                  </div>
                </div>

                <div className={style.dropdownItems}>
                  {moreMenu.map((item) => {
                    const active = isActive(item.path);

                    return (
                      <button
                        key={item.index}
                        type="button"
                        className={`${style.dropdownItem} ${
                          active ? style.dropdownItemActive : ""
                        }`}
                        onClick={() => handleMenuSelect(item.path)}
                        onMouseEnter={handleArrowMouseEnter}
                        onMouseLeave={handleArrowMouseLeave}
                        role="menuitem"
                      >
                        <span className={style.dropdownIcon}>{item.icon}</span>

                        <span className={style.dropdownContent}>
                          <strong>{item.label}</strong>

                          <small>{item.description}</small>
                        </span>

                        <span
                          className={style.dropdownArrow}
                          aria-hidden="true"
                        >
                          <ArrowRightIcon size={15} duration={0.7} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* -----------------------------------------
          THEME TOGGLE — CELESTIAL SWITCH
      ----------------------------------------- */}

      <button
        type="button"
        className={`${style.themeToggle} ${
          isDark ? style.themeToggleDark : ""
        } ${isToggling ? style.themeToggleActive : ""}`}
        onClick={handleThemeToggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
      >
        {/* Animated sky background */}
        <span className={style.skyLayer}>
          <span className={style.skySun}></span>
          <span className={style.skyMoon}></span>
          <span className={style.skyStar1}></span>
          <span className={style.skyStar2}></span>
          <span className={style.skyStar3}></span>
          <span className={style.skyCloud1}></span>
          <span className={style.skyCloud2}></span>
        </span>

        {/* The travelling orb */}
        <span className={style.orbWrap}>
          <span className={style.orbRays}></span>
          <span className={style.orbBody}>
            <span className={style.orbSunFace}></span>
            <span className={style.orbMoonFace}></span>
            <span className={style.orbCrater1}></span>
            <span className={style.orbCrater2}></span>
            <span className={style.orbCrater3}></span>
          </span>
          <span className={style.orbTrail}></span>
        </span>

        {/* Burst on click */}
        <span className={style.burstRing}></span>

        {/* Floating particles */}
        <span className={style.particles}>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </button>

      {/* -----------------------------------------
          MOBILE BUTTON
      ----------------------------------------- */}

      <button
        type="button"
        className={style.mobileToggle}
        onClick={handleMobileToggle}
        aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isMobileOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* -----------------------------------------
          MOBILE NAVIGATION
      ----------------------------------------- */}

      {isMobileOpen && (
        <div className={style.mobileNavigation}>
          <div className={style.mobileNavIntro}>
            <span>MENU</span>

            <small>Taste • Discover • Enjoy</small>
          </div>

          <div className={style.mobilePrimary}>
            <span className={style.mobileSectionTitle}>MAIN</span>

            {primaryMenu.map((item) => {
              const active = isActive(item.path);

              return (
                <button
                  key={item.index}
                  type="button"
                  className={`${style.mobileMenuItem} ${
                    active ? style.mobileActive : ""
                  }`}
                  onClick={() => handleMenuSelect(item.path)}
                  onMouseEnter={handleArrowMouseEnter}
                  onMouseLeave={handleArrowMouseLeave}
                >
                  <span>{item.label}</span>

                  <span className={style.mobileArrow} aria-hidden="true">
                    <ArrowRightIcon size={15} duration={0.7} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className={style.mobileMore}>
            <span className={style.mobileSectionTitle}>EXPLORE</span>

            {moreMenu.map((item) => {
              const active = isActive(item.path);

              return (
                <button
                  key={item.index}
                  type="button"
                  className={`${style.mobileMenuItem} ${
                    active ? style.mobileActive : ""
                  }`}
                  onClick={() => handleMenuSelect(item.path)}
                  onMouseEnter={handleArrowMouseEnter}
                  onMouseLeave={handleArrowMouseLeave}
                >
                  <span className={style.mobileItemLeft}>
                    <i>{item.icon}</i>
                    {item.label}
                  </span>

                  <span className={style.mobileArrow} aria-hidden="true">
                    <ArrowRightIcon size={15} duration={0.7} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
