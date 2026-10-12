import { m, useReducedMotion } from "framer-motion";

export function Reveal({ children, className, delay = 0, immediate = false }) {
  const reducedMotion = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reducedMotion || immediate ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
export function SectionIntro({ number, label, title, description }) {
  return (
    <Reveal className="section-intro">
      <p className="eyebrow">
        <span className="section-number">{number}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
    </Reveal>
  );
}
