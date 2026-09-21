import { z } from "zod";
const text = z.string().trim().min(1).max(300);
const paragraph = z.string().trim().min(1).max(3000);
const https = z
  .string()
  .max(2048)
  .url()
  .refine((v) => {
    try {
      return new URL(v).protocol === "https:";
    } catch {
      return false;
    }
  }, "HTTPS 링크를 입력해주세요.");
const image = z.union([
  z.literal(""),
  https,
  z.string().regex(/^\/assets\/[a-zA-Z0-9/_.,@ -]+$/),
]);
const base = { id: z.string().min(1).max(80), visible: z.boolean() };
const list = (schema) =>
  z
    .array(schema)
    .max(60)
    .refine(
      (items) => new Set(items.map((x) => x.id)).size === items.length,
      "중복된 항목 ID입니다.",
    );
const heading = z
  .object({ title: text, description: z.string().trim().max(500) })
  .strict();
export const contentSchemas = {
  settings: z
    .object({
      brand: text,
      contactEmail: z.email(),
      githubUrl: https,
      heroEyebrow: text,
      heroTitle: paragraph,
      heroDescription: paragraph,
      contactDescription: paragraph,
      copyright: text,
      sections: z
        .object({
          work: heading,
          numbers: heading,
          services: heading,
          projects: heading,
          contact: heading,
        })
        .strict(),
    })
    .strict(),
  projects: list(
    z
      .object({
        ...base,
        name: text,
        image,
        alt: z.string().max(300),
        description: paragraph,
        role: text,
        tech: z.array(text).max(20),
        development: z.boolean(),
        links: z
          .array(
            z
              .object({
                label: text,
                href: https,
                icon: z.enum(["apple", "play", "web"]),
              })
              .strict(),
          )
          .max(8),
      })
      .strict(),
  ),
  partners: list(z.object({ ...base, name: text, image }).strict()),
  services: list(
    z
      .object({
        ...base,
        title: text,
        eyebrow: text,
        detail: paragraph,
        icon: z.enum(["code", "product", "automation"]),
      })
      .strict(),
  ),
  stats: list(
    z
      .object({
        ...base,
        label: text,
        value: z
          .string()
          .regex(/^\d{1,7}\+?$/, "숫자 또는 300+ 형식으로 입력해주세요."),
        style: z.enum(["students", "subscribers", "brands", "books"]),
      })
      .strict(),
  ),
};
export function publicContent(rows) {
  return Object.fromEntries(
    rows
      .filter((row) => Object.hasOwn(contentSchemas, row.key))
      .map(({ key, data }) => [
        key,
        Array.isArray(data)
          ? data
              .filter((item) => item.visible)
              .map(({ visible, ...item }) => item)
          : data,
      ]),
  );
}
