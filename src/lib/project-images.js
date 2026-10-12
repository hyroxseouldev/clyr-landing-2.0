import images from "./project-images.json";

export function getProjectImageProps(src) {
  const optimized = images[src];
  // Only replace known local originals; CMS uploads keep their own URL.
  return optimized
    ? {
        ...optimized,
        sizes: "(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(50vw - 46px), (max-width: 1279px) calc(50vw - 62px), 578px",
      }
    : { src };
}
