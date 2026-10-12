import { mkdir, writeFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../server/db/index.js";
import { contentSection } from "../server/db/schema.js";
import { contentSchemas } from "../shared/content-schema.js";
import { blueprintHeroDefaults } from "../shared/blueprint-content.js";

// A scoped CMS content update, not a reseed. Preview by default; --apply saves
// only these three sections, with a backup and the CMS's version check.
const apply = process.argv.includes("--apply");
const db = getDb();
try {
  const rows = await db.select().from(contentSection);
  const originals = ["settings", "services", "projects"].map((key) => {
    const row = rows.find((item) => item.key === key);
    if (!row) throw new Error(`Missing CMS section: ${key}`);
    return row;
  });
  const content = Object.fromEntries(
    originals.map(({ key, data }) => [key, structuredClone(data)]),
  );

  Object.assign(content.settings, {
    heroEyebrow: "WEBSITES · SPORTS EVENTS",
    heroTitle: blueprintHeroDefaults.title,
    heroBlueprint: { ...blueprintHeroDefaults },
    heroDescription:
      "참가 신청을 받고, 명단을 확인하는 관리 화면까지.\n필요한 기능을 정해 작은 범위부터 시작합니다.",
    contactDescription:
      "참고 사이트나 행사 일정, 필요한 기능을 알려주세요. 자료를 확인한 뒤 작업 범위와 일정, 고정 견적을 안내합니다. 기존 사이트의 작은 수정도 문의해주세요.",
    copyright: "© 2026 CLYRDEV. WEBSITES, EVENTS & EVERYDAY TOOLS.",
  });
  Object.assign(content.settings.sections, {
    services: {
      title: "이런 페이지를 만듭니다",
      description: "소규모 홈페이지, 러닝·스포츠 이벤트, 신청과 운영에 필요한 관리 화면까지",
    },
    projects: {
      title: "실제로 만든 웹사이트와 서비스",
      description: "스포츠 모임의 참가 신청부터 브랜드 홈페이지, 회원관리와 앱까지",
    },
    contact: {
      title: "어떤 페이지가 필요하세요?",
      description: "홈페이지 한 개, 이벤트 한 번부터 이야기해주세요. 제작사의 부분 개발 의뢰도 가능합니다.",
    },
  });

  const serviceCopy = {
    "service-0": {
      title: "소규모 홈페이지",
      eyebrow: "BRAND · SPACE · WEBSITE",
      detail: "브랜드·매장·스튜디오를 소개하고 문의를 받는 반응형 홈페이지를 만듭니다. 기존 사이트의 문의 폼과 모바일 화면 수정도 함께합니다.",
      icon: "code",
    },
    "service-1": {
      title: "러닝·스포츠 이벤트",
      eyebrow: "RUNNING · SPORTS · EVENT",
      detail: "러닝 모임, 운동 클래스, 스포츠 행사의 일정·장소·참가 안내와 신청 페이지를 만듭니다.",
      icon: "product",
    },
    "service-2": {
      title: "신청·운영 관리",
      eyebrow: "APPLICATION · MEMBER · ADMIN",
      detail: "신청 내용을 저장하고 참가자 명단·회원 정보를 확인하는 관리 화면을 만듭니다. 운영에 필요한 기능부터 연결합니다.",
      icon: "automation",
    },
  };
  for (const id of Object.keys(serviceCopy)) {
    if (!content.services.some((item) => item.id === id)) {
      throw new Error(`Missing expected service: ${id}`);
    }
  }
  content.services = content.services.map((item) => ({
    ...item,
    ...serviceCopy[item.id],
  }));

  const projectOrder = ["project-5", "project-3", "project-4", "project-0", "project-1", "project-2"];
  for (const id of projectOrder) {
    if (!content.projects.some((item) => item.id === id)) {
      throw new Error(`Missing expected project: ${id}`);
    }
  }
  content.projects.sort((a, b) => {
    const aRank = projectOrder.indexOf(a.id);
    const bRank = projectOrder.indexOf(b.id);
    return (aRank < 0 ? projectOrder.length : aRank) -
      (bRank < 0 ? projectOrder.length : bRank);
  });

  const planned = originals.map((row) => ({
    ...row,
    data: contentSchemas[row.key].parse(content[row.key]),
  }));
  const changes = planned.filter((row) =>
    !isDeepStrictEqual(row.data, originals.find((item) => item.key === row.key).data),
  );
  console.log(JSON.stringify({
    mode: apply ? "apply" : "preview",
    sections: changes.map(({ key, version }) => ({ key, version })),
    headline: content.settings.heroBlueprint.title,
    services: content.services.map(({ title }) => title),
    projects: content.projects.map(({ name }) => name),
  }, null, 2));

  if (apply && changes.length) {
    const backupDir = new URL("../output/content-backups/", import.meta.url);
    await mkdir(backupDir, { recursive: true });
    const backup = new URL(`website-positioning-${Date.now()}.json`, backupDir);
    await writeFile(backup, JSON.stringify(originals, null, 2) + "\n", { flag: "wx", mode: 0o600 });
    await db.transaction(async (tx) => {
      for (const { key, data, version } of changes) {
        const saved = await tx.update(contentSection)
          .set({ data, version: sql`${contentSection.version} + 1`, updatedAt: new Date() })
          .where(and(eq(contentSection.key, key), eq(contentSection.version, version)))
          .returning({ key: contentSection.key });
        if (!saved.length) throw new Error(`CMS section changed during update: ${key}`);
      }
    });
    console.log(`Updated ${changes.length} CMS sections. Backup: ${backup.pathname}`);
  }
} finally {
  await db.$client.end();
}
