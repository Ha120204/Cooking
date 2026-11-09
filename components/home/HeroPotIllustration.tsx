import styles from "./HeroPotIllustration.module.css";

function Ingredient({ kind, className }: { kind: "leaf" | "chili" | "garlic" | "lime"; className: string }) {
  const drawing = {
    leaf: <><path d="M5 22C5 12 11 5 24 4c-1 13-8 19-19 18Z" /><path d="M6 21c5-5 10-9 16-13" /><path d="M12 16 9 9m8 3 1 6" /></>,
    chili: <><path d="M8 8c2-2 5-2 7 0 3 3 1 11-8 16-2 1-4-1-3-3 5-9 1-10 4-13Z" /><path d="M10 7c1-3 3-4 6-4m-6 4c-2-2-4-2-6-1" /></>,
    garlic: <><path d="M15 7c0-2-1-4-3-5-2 1-3 3-3 5-5 1-7 5-6 10 1 6 5 9 9 9s8-3 9-9c1-5-1-9-6-10Z" /><path d="M9 8c-2 5-2 11 0 16m6-16c2 5 2 11 0 16" /></>,
    lime: <><circle cx="14" cy="14" r="11" /><circle cx="14" cy="14" r="7" /><path d="M14 7v14M7 14h14m-12-5 10 10m0-10L9 19" /></>,
  }[kind];

  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`${styles.ingredient} ${className}`} aria-hidden="true" focusable="false">{drawing}</svg>;
}

export function HeroPotIllustration() {
  return <div className={styles.scene} aria-hidden="true">
    <div className={styles.halo} />
    <div className={styles.potCircle}>
      <svg className={styles.potSvg} viewBox="0 0 228 228" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <g className={`${styles.steam} ${styles.steamOne}`}><path d="M91 79c-5-6 5-9 0-17-3-4-1-7 2-10" /></g>
        <g className={`${styles.steam} ${styles.steamTwo}`}><path d="M118 71c-5-6 5-10 0-18-3-4-1-7 2-10" /></g>
        <g className={`${styles.steam} ${styles.steamThree}`}><path d="M145 75c-5-6 5-9 0-17-3-4-1-7 2-10" /></g>
        <g transform="translate(56 61) scale(4.8)" stroke="#9E3F1D" strokeWidth="1.25">
          <path d="M2 12h20" />
          <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
          <g className={styles.lid} stroke="#C2542D">
            <path d="m4 8 16-4" />
            <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
          </g>
        </g>
      </svg>
    </div>
    <Ingredient kind="leaf" className={styles.leaf} />
    <Ingredient kind="chili" className={styles.chili} />
    <Ingredient kind="garlic" className={styles.garlic} />
    <Ingredient kind="lime" className={styles.lime} />
  </div>;
}
