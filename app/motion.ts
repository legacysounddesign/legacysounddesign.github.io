export const motionTimings = {
  fast: 0.14,
  standard: 0.22,
  page: 0.32,
  settle: 0.48,
};

export const motionEase = [0.2, 0.8, 0.2, 1] as const;

export const navSpring = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.8,
} as const;

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: motionTimings.page, ease: motionEase },
} as const;

export const revealTransition = (index = 0) => ({
  duration: motionTimings.standard,
  ease: motionEase,
  delay: index * 0.12,
});

export const writeTimings = {
  line: 0.3,
  stagger: 0.08,
  section: 0.14,
};
