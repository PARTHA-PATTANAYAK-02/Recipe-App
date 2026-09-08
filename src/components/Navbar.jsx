import style from "../css/navbar.module.css";

export default function Navbar({ setMenu, menuId = 0 }) {
  const menu = ["Home", "Recipes", "Food", "Ingredients", "Drinks", "Favorite"];

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

        {menu.map((val, index) => {
          // Check korchhi current item-ta active kina
          const isActive = menuId === index;

          return (
            <li
              key={val}
              onClick={() => setMenu(index)}
              className={`${style.menuItem} ${isActive ? style.active : ""}`}
            >
              {isActive && <span className={style.activePill}></span>}

              <span className={style.menuText}>{val}</span>

              {isActive && <span className={style.activeDot}></span>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
