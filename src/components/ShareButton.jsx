import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import style from "../css/share.module.css";

export default function ShareButton({ title = "Tastora Recipe", url }) {
  const [copied, setCopied] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [ripples, setRipples] = useState([]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const timerRef = useRef(null);

  const shareUrl = url;

  /*
   * =========================================================
   * CLEANUP
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /*
   * =========================================================
   * RIPPLE (position-aware)
   * =========================================================
   */

  const createRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  /*
   * =========================================================
   * COPY STATE
   * =========================================================
   */

  const triggerCopied = () => {
    setCopied(true);
    setBurstKey((k) => k + 1);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /*
   * =========================================================
   * HANDLERS
   * =========================================================
   */

  const handleShare = async (event) => {
    createRipple(event);

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this recipe on Tastora!`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      triggerCopied();
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  const handleCopy = async (event) => {
    createRipple(event);

    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerCopied();
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className={`${style.shareWrap} ${isDark ? style.dark : style.light}`}>
      {/* -----------------------------------------
          SHARE BUTTON
      ----------------------------------------- */}

      <button
        type="button"
        className={style.shareBtn}
        onClick={handleShare}
        aria-label="Share recipe"
      >
        <span className={style.shareIconWrap}>
          <svg
            className={style.shareIcon}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </span>

        <span className={style.btnLabel}>Share</span>

        {ripples.map((r) => (
          <span
            key={r.id}
            className={style.ripple}
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </button>

      {/* -----------------------------------------
          COPY BUTTON
      ----------------------------------------- */}

      <button
        type="button"
        className={`${style.copyBtn} ${copied ? style.copied : ""}`}
        onClick={handleCopy}
        aria-label="Copy link"
      >
        <span className={style.copyIconWrap}>
          {/* Link icon (default) */}
          <svg
            className={style.linkIcon}
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>

          {/* Check icon (copied) */}
          <svg
            className={style.checkIcon}
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>

          {/* Burst ring */}
          <span key={burstKey} className={style.burstRing} />

          {/* Sparkle particles */}
          <span key={`p-${burstKey}`} className={style.sparkles}>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
        </span>

        <span className={style.btnLabel}>
          {copied ? "Copied!" : "Copy Link"}
        </span>

        {ripples.map((r) => (
          <span
            key={`c-${r.id}`}
            className={style.ripple}
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </button>
    </div>
  );
}
