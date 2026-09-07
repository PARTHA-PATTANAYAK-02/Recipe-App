import style from "../css/footer.module.css";
import {
  FaHeart,
  FaUtensils,
  FaArrowUp,
  FaLeaf,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={style.footer}>
      <div className={`${style.decor} ${style.decorOne}`}>
        <FaLeaf />
      </div>

      <div className={`${style.decor} ${style.decorTwo}`}>
        <FaLeaf />
      </div>

      <div className={style.content}>
        <div className={style.mainContent}>
          {/* Brand */}
          <div className={style.brandBlock}>
            <div className={style.brandIcon}>
              <FaUtensils />
            </div>

            <div>
              <h2>Recipe App</h2>
              <span>Made for food lovers</span>
            </div>
          </div>

          {/* Description */}
          <p className={style.text}>
            Discover delicious recipes, explore new flavours, and find something
            wonderful to cook today.
          </p>

          {/* Navigation */}
          <div className={style.links}>
            <a href="/">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div className={style.divider}></div>

        <div className={style.bottom}>
          <p>
            &copy; {new Date().getFullYear()} Recipe App. Made with{" "}
            <FaHeart className={style.heart} /> for food lovers.
          </p>

          {/* Social Links + Back To Top */}
          <div className={style.bottomActions}>
            <div className={style.socialLinks}>
              <a
                href="https://github.com/PARTHA-PATTANAYAK-02"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/iampartha02/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>

            <button
              type="button"
              className={style.topButton}
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
