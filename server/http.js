export const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const handle = (fn) => async (request) => {
  try {
    return await fn(request);
  } catch (error) {
    if (error instanceof HttpError)
      return json({ message: error.message }, error.status);
    console.error("Portfolio API failed:", error.name);
    return json(
      { message: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요." },
      503,
    );
  }
};
export async function readJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "내용이 필요합니다.");
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 200000) {
      await reader.cancel();
      throw new HttpError(413, "내용이 너무 큽니다.");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw new HttpError(400, "올바른 JSON이 필요합니다.");
  }
}
