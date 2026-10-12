// A versioned presentation keeps existing CMS documents valid. The editor and
// public page share these defaults until the new hero copy is saved in the CMS.
export const blueprintHeroDefaults = {
  title: "작은 홈페이지부터,\n러닝·스포츠\n이벤트 페이지까지.",
  introduction:
    "브랜드와 공간을 소개하는 홈페이지,\n러닝·스포츠 이벤트의 참가 신청 페이지를 만듭니다.",
  asideTitle: "소개부터 신청·관리까지.",
};

export function getBlueprintHero(settings) {
  return settings.heroBlueprint ?? blueprintHeroDefaults;
}
