import { ContentProvider, useContent } from "./lib/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  animate,
  domAnimation,
  m,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  LoaderCircle,
  Globe2,
  GraduationCap,
  Mail,
  Menu,
  Send,
  Video,
  X,
} from "lucide-react";
import { FaApple, FaGithub, FaGooglePlay } from "react-icons/fa6";

const navItems = [
  ["TOOLS", "work"],
  ["VIBE", "numbers"],
  ["BUILD", "services"],
  ["PROJECTS", "books"],
  ["CONTACT", "contact"],
];
const serviceIcons = { code: Code2, product: GraduationCap, automation: Video };
const linkIcons = { apple: FaApple, play: FaGooglePlay, web: Globe2 };
function ProjectIcon({ name, ...props }) {
  const Icon = linkIcons[name] || Globe2;
  return <Icon {...props} />;
}
function ServiceIcon({ name, ...props }) {
  const Icon = serviceIcons[name] || Code2;
  return <Icon {...props} />;
}
function Reveal({ children, className, delay = 0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
function SectionIntro({ number, label, title, description }) {
  return (
    <Reveal className="section-intro">
      <p className="eyebrow">
        <span className="section-glyph">⌑</span>
        {number} / {label}
      </p>
      <h2>{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
    </Reveal>
  );
}
function Logo() {
  const { settings } = useContent();
  return <span className="brand-lockup">{settings.brand}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector(".menu-button")?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <div className="header-brand">
          <a href="#top" aria-label="클리어데브" onClick={() => setOpen(false)}>
            <Logo />
          </a>
        </div>
        <nav className="desktop-nav" aria-label="메인 메뉴">
          {navItems.slice(0, -1).map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a className="contact-pill" href="#contact">
            CONTACT
          </a>
        </nav>
        <div className="mobile-actions">
          <a
            className="contact-pill"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            CONTACT
          </a>
          <Button
            className="menu-button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-navigation"
          className="mobile-menu"
          aria-label="모바일 메뉴"
        >
          {navItems.slice(0, -1).map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function Hero() {
  const { settings } = useContent();
  const { githubUrl } = settings;
  return (
    <section id="top" className="hero-section">
      <div className="grid-overlay" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="shell hero-inner">
        <Reveal className="hero-reveal">
          <p className="eyebrow hero-eyebrow">
            <span className="cyan-dot" /> {settings.heroEyebrow}
          </p>
          <h1 style={{ whiteSpace: "pre-line" }}>{settings.heroTitle}</h1>
          <p className="hero-copy" style={{ whiteSpace: "pre-line" }}>
            {settings.heroDescription}
          </p>
          <div className="hero-actions">
            <Button asChild>
              <a href="#contact" className="primary-btn">
                문의하기 <ArrowRight size={17} />
              </a>
            </Button>
            <Button asChild>
              <a
                href={githubUrl}
                className="ghost-btn"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={17} /> GitHub
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Work() {
  const { partners, settings } = useContent();
  return (
    <section id="work" className="work-section">
      <div className="shell">
        <SectionIntro
          number="01"
          label="COLLABORATIONS"
          title={settings.sections.work.title}
          description={settings.sections.work.description}
        />
      </div>
      <div className="marquee-wrap" aria-label="협업 브랜드 목록">
        <div className="marquee-track">
          {partners.map(({ image, name, id }) => (
            <div className="partner" key={id}>
              <img src={image} alt={name} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const target = Number.parseInt(value, 10);
  const suffix = value.endsWith("+") ? "+" : "";
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.floor(latest)),
      onComplete: () => setDisplay(target),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, target]);

  return (
    <strong ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {reducedMotion ? target : display}
        {suffix}
      </span>
    </strong>
  );
}

function Numbers() {
  const { stats, settings } = useContent();
  return (
    <section id="numbers" className="content-section shell">
      <SectionIntro
        number="02"
        label="BY THE NUMBERS"
        title={settings.sections.numbers.title}
        description={settings.sections.numbers.description}
      />
      <div className="stats-list">
        {stats.map(({ label, value, style: cls, id }) => (
          <div className={`stat-row ${cls}`} key={id}>
            <div className="stat-head">
              <span>{label}</span>
              <CountUp value={value} />
            </div>
            <div className="stat-line">
              <i />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const { services, settings } = useContent();
  return (
    <section id="services" className="content-section shell services-layout">
      <div className="services-summary">
        <SectionIntro
          number="03"
          label="WHAT I BUILD"
          title={settings.sections.services.title}
          description={settings.sections.services.description}
        />
        <Button asChild>
          <a href="#contact" className="ghost-btn compact">
            <Mail size={16} /> 같이 만들어보기
          </a>
        </Button>
      </div>
      <div className="service-list">
        {services.map(({ id, icon, eyebrow, title, detail }, index) => (
          <a className="service-item" href="#contact" key={id}>
            <div className="service-index">
              <span>0{index + 1}</span>
              <ServiceIcon name={icon} size={19} strokeWidth={1.5} />
            </div>
            <div>
              <p className="service-eyebrow">— &nbsp; {eyebrow}</p>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
            <ArrowUpRight className="service-arrow" size={17} />
          </a>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const { projects, settings } = useContent();
  return (
    <section id="books" className="content-section shell">
      <SectionIntro
        number="04"
        label="SELECTED PROJECTS"
        title={settings.sections.projects.title}
        description={settings.sections.projects.description}
      />
      <div className="project-grid">
        {projects.map((project, index) => (
          <Reveal
            className="project-entry"
            delay={index * 0.06}
            key={project.id}
          >
            <Card
              className={`project-card ${project.development ? "is-development" : ""}`}
              key={project.id}
            >
              <figure className="project-visual">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    decoding="async"
                  />
                ) : project.id === "project-2" ? (
                  <div
                    className="cloudboard-visual"
                    aria-label="CloudBoard StationD 개발 중"
                  >
                    <span className="cloudboard-index">0{index + 1}</span>
                    <div className="cloudboard-mark">
                      <span>CLOUD</span>
                      <strong>BOARD</strong>
                    </div>
                    <p>STATION D</p>
                    <small>WOD BOARD SYSTEM</small>
                  </div>
                ) : (
                  <div
                    className="cloudboard-visual"
                    aria-label={`${project.name} 이미지 준비 중`}
                  >
                    <p>{project.name}</p>
                    <small>이미지 준비 중</small>
                  </div>
                )}
              </figure>
              <CardContent className="project-body">
                <div className="project-heading">
                  <p>
                    {project.development
                      ? "PRODUCT IN PROGRESS"
                      : "LIVE PRODUCT"}
                  </p>
                  <span
                    className={`project-status ${project.development ? "building" : "live"}`}
                  >
                    <i />
                    {project.development ? "IN DEVELOPMENT" : "LIVE"}
                  </span>
                </div>
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <dl className="project-meta">
                  <div>
                    <dt>ROLE</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>STACK</dt>
                    <dd className="tech-list">
                      {project.tech.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </dd>
                  </div>
                </dl>
                <CardFooter className="project-actions">
                  {project.links.map(({ label, href, icon }, linkIndex) => (
                    <Button asChild key={linkIndex}>
                      <a
                        className="store-link"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ProjectIcon name={icon} size={15} />
                        {label}
                        <ArrowUpRight size={14} />
                      </a>
                    </Button>
                  ))}
                  {project.development ? (
                    <span className="store-upcoming development-link">
                      서비스 링크 준비 중
                    </span>
                  ) : null}
                </CardFooter>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const inquiryTypes = [
  "아이디어 프로토타입",
  "웹·앱 만들기",
  "AI 자동화",
  "사이드 프로젝트",
  "커피챗·기타",
];
function Contact() {
  const { settings } = useContent();
  const { contactEmail, githubUrl } = settings;
  const [inquiry, setInquiry] = useState(inquiryTypes[0]);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ status: "idle", message: "" });
  const copyEmail = async () => {
    await navigator.clipboard?.writeText(contactEmail);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const submitContact = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setFormState({ status: "submitting", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          inquiry,
          submissionId: crypto.randomUUID(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          result.message || "전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
        );

      form.reset();
      setInquiry(inquiryTypes[0]);
      setFormState({
        status: "success",
        message: "문의가 전송되었습니다. 곧 확인할게요!",
      });
    } catch (error) {
      setFormState({ status: "error", message: error.message });
    }
  };

  const isSubmitting = formState.status === "submitting";
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
          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-honeypot" aria-hidden="true">
              <label>
                WEBSITE
                <input name="website" tabIndex="-1" autoComplete="off" />
              </label>
            </div>
            <div className="form-row">
              <label>
                NAME
                <Input
                  className="contact-input"
                  name="name"
                  autoComplete="name"
                  placeholder="어떻게 불러드릴까요?"
                  required
                  maxLength="80"
                />
              </label>
              <label>
                EMAIL
                <Input
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
              PROJECT
              <Input
                className="contact-input"
                name="project"
                placeholder="만들고 싶은 프로젝트 이름"
                maxLength="120"
              />
            </label>
            <fieldset>
              <legend>BUILD TYPE</legend>
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
              YOUR IDEA
              <Textarea
                className="contact-textarea"
                name="message"
                rows="5"
                placeholder="아직 선명하지 않아도 괜찮아요. 만들고 싶은 것을 편하게 들려주세요."
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
              {isSubmitting ? "전송 중..." : "아이디어 보내기"}
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
            <Button className="email-copy" onClick={copyEmail}>
              {contactEmail} {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
            <p className="copy-caption">
              {copied ? "COPIED" : "CLICK TO COPY"}
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

function Footer() {
  const { settings } = useContent();
  const { contactEmail, githubUrl } = settings;
  return (
    <footer className="site-footer">
      <div className="shell footer-layout">
        <div className="footer-brand">
          <Logo />
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
        <nav>
          <h3>EXPLORE</h3>
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <nav>
          <h3>FIND ME ONLINE</h3>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GITHUB
          </a>
          <a href={`mailto:${contactEmail}`}>EMAIL</a>
        </nav>
        <p className="copyright">{settings.copyright}</p>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <ContentProvider>
      <LazyMotion features={domAnimation}>
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Work />
          <Numbers />
          <Services />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </LazyMotion>
    </ContentProvider>
  );
}
