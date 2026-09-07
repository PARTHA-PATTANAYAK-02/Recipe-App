import { useState } from "react";
import style from "../css/navbar.module.css";

export default function Navbar({ setMenu }) {
  const menu = ["Home", "Recipes", "Food", "Ingredients", "Drinks"];
  const [active, setActive] = useState(0);

  return (
    <nav className={style.navbar}>
      <div className={style.topShine}></div>

      {/* ---------- Brand ---------- */}
      <div className={style.brand}>
        <div className={style.logoWrapper}>
          <span className={style.logoGlow}></span>

          <img className={style.logo} src="./logo.png" alt="Tastora" />

          <span className={style.logoRing}></span>
        </div>

        <div className={style.brandText}>
          <h2 className={style.name}>Tastora</h2>
          <span className={style.tagline}>Taste • Discover • Enjoy</span>
        </div>
      </div>

      {/* ---------- Menu ---------- */}
      <ul className={style.menu}>
        <span className={style.menuShine}></span>

        {menu.map((val, index) => (
          <li
            key={val}
            onClick={() => {
              setActive(index);
              setMenu(index);
            }}
            className={`${style.menuItem} ${
              active === index ? style.active : ""
            }`}
          >
            {active === index && <span className={style.activePill}></span>}

            <span className={style.menuText}>{val}</span>

            {active === index && <span className={style.activeDot}></span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
