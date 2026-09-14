import { useRef } from "react";

import {
  UtensilsIcon,
  HeartIcon,
  ArrowUpIcon,
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MailIcon,
} from "@animateicons/react/lucide";

import { FaLeaf } from "react-icons/fa";

import style from "../css/footer.module.css";

export default function Footer() {
  const heartRef = useRef(null);
  const topRef = useRef(null);

  const githubRef = useRef(null);
  const linkedinRef = useRef(null);
  const facebookRef = useRef(null);
  const instagramRef = useRef(null);
  const twitterRef = useRef(null);
  const mailRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMouseEnter = (ref) => {
    ref.current?.startAnimation();
  };

  const handleMouseLeave = (ref) => {
    ref.current?.stopAnimation();
  };

  return (
    <footer className={style.footer}>
      {/* =====================================================
          DECORATIONS
      ====================================================== */}

      <div className={`${style.decor} ${style.decorOne}`}>
        <FaLeaf />
      </div>

      <div className={`${style.decor} ${style.decorTwo}`}>
        <FaLeaf />
      </div>

      <div className={style.content}>
        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <div className={style.mainContent}>
          {/* BRAND */}

          <div className={style.brandBlock}>
            <div className={style.brandIcon}>
              <UtensilsIcon size={20} duration={0.8} />
            </div>

            <div>
              <h2>Recipe App</h2>
              <span>Made for food lovers</span>
            </div>
          </div>

          {/* DESCRIPTION */}

          <p className={style.text}>
            Discover delicious recipes, explore new flavours, and find something
            wonderful to cook today.
          </p>
        </div>

        {/* ===================================================
            DIVIDER
        ==================================================== */}

        <div className={style.divider}></div>

        {/* ===================================================
            BOTTOM
        ==================================================== */}

        <div className={style.bottom}>
          {/* COPYRIGHT */}

          <div className={style.copyright}>
            <span>&copy; {new Date().getFullYear()} Recipe App. Made with</span>

            <HeartIcon
              ref={heartRef}
              className={style.heart}
              size={14}
              duration={0.8}
              onMouseEnter={() => handleMouseEnter(heartRef)}
              onMouseLeave={() => handleMouseLeave(heartRef)}
            />

            <span>for food lovers.</span>
          </div>

          {/* =================================================
              SOCIAL + BACK TO TOP
          ================================================= */}

          <div className={style.bottomActions}>
            <div className={style.socialLinks}>
              {/* GITHUB */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                onMouseEnter={() => handleMouseEnter(githubRef)}
                onMouseLeave={() => handleMouseLeave(githubRef)}
              >
                <GithubIcon ref={githubRef} size={15} duration={0.8} />
              </a>

              {/* LINKEDIN */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                onMouseEnter={() => handleMouseEnter(linkedinRef)}
                onMouseLeave={() => handleMouseLeave(linkedinRef)}
              >
                <LinkedinIcon ref={linkedinRef} size={15} duration={0.8} />
              </a>

              {/* FACEBOOK */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                onMouseEnter={() => handleMouseEnter(facebookRef)}
                onMouseLeave={() => handleMouseLeave(facebookRef)}
              >
                <FacebookIcon ref={facebookRef} size={15} duration={0.8} />
              </a>

              {/* INSTAGRAM */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                onMouseEnter={() => handleMouseEnter(instagramRef)}
                onMouseLeave={() => handleMouseLeave(instagramRef)}
              >
                <InstagramIcon ref={instagramRef} size={15} duration={0.8} />
              </a>

              {/* TWITTER */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                title="Twitter"
                onMouseEnter={() => handleMouseEnter(twitterRef)}
                onMouseLeave={() => handleMouseLeave(twitterRef)}
              >
                <TwitterIcon ref={twitterRef} size={15} duration={0.8} />
              </a>

              {/* EMAIL */}

              <a
                href="#"
                aria-label="Email"
                title="Email"
                onMouseEnter={() => handleMouseEnter(mailRef)}
                onMouseLeave={() => handleMouseLeave(mailRef)}
              >
                <MailIcon ref={mailRef} size={15} duration={0.8} />
              </a>
            </div>

            {/* BACK TO TOP */}

            <button
              type="button"
              className={style.topButton}
              onClick={scrollToTop}
              onMouseEnter={() => handleMouseEnter(topRef)}
              onMouseLeave={() => handleMouseLeave(topRef)}
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUpIcon ref={topRef} size={15} duration={0.8} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
