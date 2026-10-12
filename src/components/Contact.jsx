import { useContent } from "../lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Check, Copy, LoaderCircle, Mail, Send, X } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { SectionIntro } from "./SectionIntro";
import { inquiryTypes } from "../../shared/contact.js";
import { useContactForm } from "../hooks/useContactForm";
import { useClipboard } from "../hooks/useClipboard";

export function Contact() {
  const { settings } = useContent();
  const { contactEmail, githubUrl } = settings;
  const { inquiry, setInquiry, formState, submitContact, isSubmitting } = useContactForm();
  const { copy, copyState } = useClipboard();
  const copied = copyState === "copied";
  return (
    <section id="contact" className="contact-section">
      <div className="contact-orb" />
      <div className="shell contact-shell">
        <div className="contact-heading">
          <SectionIntro
            number="05"
            label="LET'S BUILD"
            title={settings.sections.contact.title}
            description={settings.sections.contact.description}
          />
        </div>
        <div className="contact-grid">
          <form className="contact-form" onSubmit={submitContact} aria-busy={isSubmitting}>
            <div className="form-honeypot" aria-hidden="true">
              <label>
                WEBSITE
                <input name="website" tabIndex="-1" autoComplete="off" />
              </label>
            </div>
            <div className="form-row">
              <label>
                이름 · 담당자
                <Input
                  disabled={isSubmitting}
                  className="contact-input"
                  name="name"
                  autoComplete="name"
                  placeholder="성함 또는 회사·팀의 담당자명"
                  required
                  maxLength="80"
                />
              </label>
              <label>
                회신받을 이메일
                <Input
                  disabled={isSubmitting}
                  className="contact-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="you@company.com"
                  required
                  maxLength="254"
                />
              </label>
            </div>
            <label>
              페이지 · 행사 이름
              <Input
                disabled={isSubmitting}
                className="contact-input"
                name="project"
                placeholder="브랜드·공간·행사 이름 (선택)"
                maxLength="120"
              />
            </label>
            <fieldset disabled={isSubmitting}>
              <legend>필요한 작업</legend>
              <div className="inquiry-pills">
                {inquiryTypes.map((type) => (
                  <Button
                    type="button"
                    className={`inquiry-pill ${inquiry === type ? "selected" : ""}`}
                    aria-pressed={inquiry === type}
                    onClick={() => setInquiry(type)}
                    key={type}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </fieldset>
            <label>
              제작 문의 내용
              <Textarea
                disabled={isSubmitting}
                className="contact-textarea"
                name="message"
                rows="5"
                placeholder="참고할 사이트 주소, 필요한 페이지·기능, 희망 일정을 알려주세요. 행사 페이지라면 일정·장소와 참가 신청 필요 여부를, 기존 사이트 수정이라면 주소와 불편한 점을 적어주세요."
                required
                minLength="10"
                maxLength="3000"
              />
            </label>
            <Button
              className="submit-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                <Send size={16} />
              )}{" "}
              {isSubmitting ? "전송 중..." : "제작 문의 보내기"}
            </Button>
            {formState.message ? (
              <Alert
                className={`form-status ${formState.status === "success" ? "is-success" : "is-error"}`}
                role="alert"
              >
                {formState.status === "success" ? (
                  <Check size={17} />
                ) : (
                  <X size={17} />
                )}
                <span>{formState.message}</span>
              </Alert>
            ) : null}
          </form>
          <aside className="direct-card">
            <p className="eyebrow">SAY HELLO</p>
            <Button className="email-copy" onClick={() => copy(contactEmail)}>
              {contactEmail} {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
            <p className="copy-caption" role="status">
              {copied ? "COPIED" : copyState === "error" ? "복사하지 못했어요. 아래 EMAIL 링크를 이용해주세요." : "CLICK TO COPY"}
            </p>
            <p>{settings.contactDescription}</p>
            <p className="eyebrow channel-title">FIND ME ONLINE</p>
            <div className="channel-links">
              <a href={githubUrl} target="_blank" rel="noreferrer">
                <FaGithub />
                GITHUB
              </a>
              <a href={`mailto:${contactEmail}`}>
                <Mail />
                EMAIL
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
