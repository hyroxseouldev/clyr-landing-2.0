import { useEffect, useRef, useState } from "react";
import { inquiryTypes } from "../../shared/contact.js";
import { prepareContactSubmission, sendContact } from "../lib/contact-request.js";

export function useContactForm() {
  const [inquiry, setInquiry] = useState(inquiryTypes[0]);
  const [formState, setFormState] = useState({ status: "idle", message: "" });
  const submission = useRef(null);
  const request = useRef(null);

  useEffect(() => () => request.current?.abort(), []);

  async function submitContact(event) {
    event.preventDefault();
    if (request.current) return;
    const form = event.currentTarget;
    const values = { ...Object.fromEntries(new FormData(form)), inquiry };
    submission.current = prepareContactSubmission(values, submission.current);
    const controller = new AbortController();
    request.current = controller;
    setFormState({ status: "submitting", message: "" });

    try {
      await sendContact(submission.current.payload, { signal: controller.signal });
      if (controller.signal.aborted) return;
      submission.current = null;
      form.reset();
      setInquiry(inquiryTypes[0]);
      setFormState({ status: "success", message: "제작 문의가 전송되었습니다. 내용을 확인한 뒤 남겨주신 이메일로 답변드릴게요." });
    } catch (error) {
      if (!controller.signal.aborted) {
        setFormState({ status: "error", message: error.message });
      }
    } finally {
      request.current = null;
    }
  }

  return { inquiry, setInquiry, formState, submitContact, isSubmitting: formState.status === "submitting" };
}
