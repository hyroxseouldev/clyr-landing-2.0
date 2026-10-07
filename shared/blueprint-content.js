// A versioned presentation keeps existing CMS documents valid. The editor and
// public page share these defaults until the new hero copy is saved in the CMS.
export const blueprintHeroDefaults = {
  title: "생각을 짓고,\n서비스를 만듭니다.",
  introduction:
    "코드를 넘어, 아이디어가 실제로 작동하는 경험까지.\nAI와 함께 더 빠르게 만들고 매일 새롭게 배웁니다.",
  asideTitle: "아이디어에서 런칭까지.",
};

export function getBlueprintHero(settings) {
  return settings.heroBlueprint ?? blueprintHeroDefaults;
}
