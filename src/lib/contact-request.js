import { CONTACT_REQUEST_TIMEOUT_MS } from "../../shared/contact.js";

const failureMessage = "전송하지 못했습니다. 잠시 후 다시 시도해주세요.";

export function prepareContactSubmission(values, previous) {
  const fingerprint = JSON.stringify(values);
  return {
    fingerprint,
    payload: {
      ...values,
      submissionId: previous?.fingerprint === fingerprint
        ? previous.payload.submissionId
        : crypto.randomUUID(),
    },
  };
}

export async function sendContact(payload, { signal } = {}) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  if (signal?.aborted) cancel();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    cancel();
  }, CONTACT_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || result?.ok !== true) {
      throw new Error(typeof result?.message === "string" ? result.message : failureMessage);
    }
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timedOut) {
      throw new Error("전송 확인이 지연되고 있습니다. 입력 내용은 유지되니 잠시 후 다시 시도해주세요.");
    }
    if (error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error(failureMessage);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}
