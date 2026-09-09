import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Code2, Copy, GraduationCap, Mail, Menu, Send, Video, X } from "lucide-react";
import { FaApple, FaGithub, FaGooglePlay } from "react-icons/fa6";

const navItems = [
  ["TOOLS", "work"], ["VIBE", "numbers"], ["BUILD", "services"],
  ["PROJECTS", "books"], ["CONTACT", "contact"],
];
const contactEmail = "vividxxxxx@gmail.com";
const githubUrl = "https://github.com/hyroxseouldev";
const partners = [
  ["xon-training.png", "XON TRAINING"], ["amor-lab.png", "AMOR LAB"],
];
const services = [
  { Icon: Code2, eyebrow: "PROMPT · PROTOTYPE", title: "AI 프로토타입", detail: "아이디어를 대화로 풀어내고, 작동하는 화면까지 빠르게 만듭니다." },
  { Icon: GraduationCap, eyebrow: "WEB · APP · PRODUCT", title: "서비스 빌드", detail: "웹사이트부터 앱까지, 필요한 기능을 붙여 실제 제품으로 완성합니다." },
  { Icon: Video, eyebrow: "AUTOMATION · WORKFLOW", title: "AI 자동화", detail: "반복되는 일을 AI 워크플로우로 연결해 더 가볍게 일합니다." },
];
const projects = [
  {
    name: "XON Training",
    image: "/assets/projects/xon-training-app.png",
    alt: "XON Training 모바일 앱 화면",
    description: "운동 프로그램과 클래스 일정, 참여 기록을 한곳에서 관리하는 XON 회원 전용 트레이닝 앱입니다.",
    role: "기획 · UX/UI · 앱 개발 · 백엔드 · 스토어 배포",
    tech: ["Flutter", "Supabase", "Riverpod", "Firebase"],
    links: [
      { label: "App Store", href: "https://apps.apple.com/us/app/xon-training/id6760121153", Icon: FaApple },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.sunmkim.xontraining", Icon: FaGooglePlay },
    ],
  },
  {
    name: "Amor Lab",
    image: "/assets/projects/amor-lab-app.png",
    alt: "Amor Lab 모바일 앱 화면",
    description: "참여자와 코치를 연결해 프로그램, 세션, 운동 후기와 피드백을 관리하는 트레이닝 앱입니다.",
    role: "기획 · UX/UI · 앱 개발 · 백엔드 · 스토어 배포",
    tech: ["Flutter", "Supabase", "Riverpod", "Firebase"],
    links: [
      { label: "App Store", href: "https://apps.apple.com/kr/app/amor-lab/id6765614780", Icon: FaApple },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.sunmkim.amortraining", Icon: FaGooglePlay },
    ],
  },
  {
    name: "CloudBoard StationD",
    description: "오늘의 WOD와 운동 일정을 한 화면에 보여주고 운영 콘텐츠까지 관리하는 디지털 트레이닝 보드입니다.",
    role: "기획 · 프로덕트 디자인 · 풀스택 개발",
    tech: ["Next.js", "Neon", "Drizzle", "Better Auth"],
    links: [],
    development: true,
  },
];
function SectionIntro({ number, label, title, description }) {
  return <div className="section-intro reveal"><p className="eyebrow"><span className="section-glyph">⌑</span>{number} / {label}</p><h2>{title}</h2>{description ? <p className="section-copy">{description}</p> : null}</div>;
}
function Logo() { return <span className="brand-lockup">클리어데브</span>; }

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="navbar shell header-inner"><div className="navbar-start"><a href="#top" aria-label="클리어데브" onClick={() => setOpen(false)}><Logo /></a></div><nav className="navbar-end desktop-nav" aria-label="메인 메뉴">{navItems.slice(0, -1).map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}<a className="contact-pill" href="#contact">CONTACT</a></nav><div className="navbar-end mobile-actions"><a className="contact-pill" href="#contact" onClick={() => setOpen(false)}>CONTACT</a><button className="btn btn-circle menu-button" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? <X size={17} /> : <Menu size={17} />}</button></div></div>{open ? <nav className="mobile-menu" aria-label="모바일 메뉴">{navItems.slice(0, -1).map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav> : null}</header>;
}

function Hero() {
  return <section id="top" className="hero-section"><div className="grid-overlay" /><div className="orb orb-a" /><div className="orb orb-b" /><div className="shell hero-inner"><p className="eyebrow hero-eyebrow"><span className="cyan-dot" /> VIBE CODER &amp; AI PRODUCT BUILDER</p><h1 className="reveal visible">아이디어를 실제 서비스로 만드는<br />바이브 코더, 클리어데브</h1><p className="hero-copy">프롬프트로 시작해, 작동하는 제품으로 끝냅니다.<br />AI와 함께 더 빠르게 만들고 매일 새롭게 배웁니다.</p><div className="hero-actions"><a href="#contact" className="btn primary-btn">문의하기 <ArrowRight size={17} /></a><a href={githubUrl} className="btn ghost-btn" target="_blank" rel="noreferrer"><FaGithub size={17} /> GitHub</a></div></div></section>;
}

function Work() {
  return <section id="work" className="work-section"><div className="shell"><SectionIntro number="01" label="COLLABORATIONS" title="협업 브랜드" description="프로덕트 개발, 교육과 콘텐츠 협업으로 함께한 브랜드" /></div><div className="marquee-wrap" aria-label="협업 브랜드 목록"><div className="marquee-track">{partners.map(([asset, name]) => <div className="partner" key={name}><img src={`/assets/logos/${asset}`} alt={name} /><span>{name}</span></div>)}</div></div></section>;
}

function Numbers() {
  const stats = [["ACTIVE MEMBERS", "200+", "students"], ["LIVE SERVICES", "5", "subscribers"], ["PUBLISHED APPS", "3", "brands"], ["MONTHLY UPDATES", "10+", "books"]];
  return <section id="numbers" className="content-section shell"><SectionIntro number="02" label="BY THE NUMBERS" title="실제로 만들고 운영하는 것들" /><div className="stats-list">{stats.map(([label, value, cls]) => <div className={`stat-row ${cls}`} key={label}><div className="stat-head"><span>{label}</span><strong>{value}</strong></div><div className="stat-line"><i /></div></div>)}</div></section>;
}

function Services() {
  return <section id="services" className="content-section shell services-layout"><div className="services-summary"><SectionIntro number="03" label="WHAT I BUILD" title="만드는 것들" description="프로토타입, 서비스 그리고 자동화" /><a href="#contact" className="btn ghost-btn compact"><Mail size={16} /> 같이 만들어보기</a></div><div className="service-list">{services.map(({ Icon, eyebrow, title, detail }, index) => <a className="service-item" href="#contact" key={title}><div className="service-index"><span>0{index + 1}</span><Icon size={19} strokeWidth={1.5} /></div><div><p className="service-eyebrow">— &nbsp; {eyebrow}</p><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight className="service-arrow" size={17} /></a>)}</div></section>;
}

function Projects() {
  return <section id="books" className="content-section shell"><SectionIntro number="04" label="SELECTED PROJECTS" title="직접 만든 서비스" description="아이디어부터 운영까지, 실제 사용자와 만나고 있는 제품들" /><div className="project-grid">{projects.map((project, index) => <article className={`card project-card ${project.development ? "is-development" : ""}`} key={project.name}><figure className="project-visual">{project.image ? <img src={project.image} alt={project.alt} /> : <div className="cloudboard-visual" aria-label="CloudBoard StationD 개발 중"><span className="cloudboard-index">0{index + 1}</span><div className="cloudboard-mark"><span>CLOUD</span><strong>BOARD</strong></div><p>STATION D</p><small>WOD BOARD SYSTEM</small></div>}</figure><div className="card-body project-body"><div className="project-heading"><p>{project.development ? "PRODUCT IN PROGRESS" : "LIVE PRODUCT"}</p><span className={`project-status ${project.development ? "building" : "live"}`}><i />{project.development ? "IN DEVELOPMENT" : "LIVE"}</span></div><h3 className="card-title">{project.name}</h3><p className="project-description">{project.description}</p><dl className="project-meta"><div><dt>ROLE</dt><dd>{project.role}</dd></div><div><dt>STACK</dt><dd className="tech-list">{project.tech.map((item) => <span key={item}>{item}</span>)}</dd></div></dl><div className="card-actions project-actions">{project.links.map(({ label, href, Icon }) => <a className="btn store-link" href={href} target="_blank" rel="noreferrer" key={label}><Icon size={15} />{label}<ArrowUpRight size={14} /></a>)}{project.development ? <span className="store-upcoming development-link">서비스 링크 준비 중</span> : null}</div></div></article>)}</div></section>;
}

const inquiryTypes = ["아이디어 프로토타입", "웹·앱 만들기", "AI 자동화", "사이드 프로젝트", "커피챗·기타"];
function Contact() {
  const [inquiry, setInquiry] = useState(inquiryTypes[0]);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ status: "idle", message: "" });
  const copyEmail = async () => { await navigator.clipboard?.writeText(contactEmail); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const submitContact = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setFormState({ status: "submitting", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, inquiry, submissionId: crypto.randomUUID() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "전송하지 못했습니다. 잠시 후 다시 시도해주세요.");

      form.reset();
      setInquiry(inquiryTypes[0]);
      setFormState({ status: "success", message: "문의가 전송되었습니다. 곧 확인할게요!" });
    } catch (error) {
      setFormState({ status: "error", message: error.message });
    }
  };

  const isSubmitting = formState.status === "submitting";
  return <section id="contact" className="contact-section"><div className="contact-orb" /><div className="shell contact-shell"><div className="contact-heading"><SectionIntro number="05" label="LET'S BUILD" title="같이 만들어볼까요?" /></div><div className="contact-grid"><form className="contact-form" onSubmit={submitContact}><div className="form-honeypot" aria-hidden="true"><label>WEBSITE<input name="website" tabIndex="-1" autoComplete="off" /></label></div><div className="form-row"><label>NAME<input className="input" name="name" placeholder="어떻게 불러드릴까요?" required maxLength="80" /></label><label>EMAIL<input className="input" name="email" type="email" placeholder="you@company.com" required maxLength="254" /></label></div><label>PROJECT<input className="input" name="project" placeholder="만들고 싶은 프로젝트 이름" maxLength="120" /></label><fieldset><legend>BUILD TYPE</legend><div className="inquiry-pills">{inquiryTypes.map((type) => <button type="button" className={`btn inquiry-pill ${inquiry === type ? "selected" : ""}`} aria-pressed={inquiry === type} onClick={() => setInquiry(type)} key={type}>{type}</button>)}</div></fieldset><label>YOUR IDEA<textarea className="textarea" name="message" rows="5" placeholder="아직 선명하지 않아도 괜찮아요. 만들고 싶은 것을 편하게 들려주세요." required minLength="10" maxLength="3000" /></label><button className="btn submit-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? <span className="loading loading-spinner loading-sm" aria-hidden="true" /> : <Send size={16} />} {isSubmitting ? "전송 중..." : "아이디어 보내기"}</button>{formState.message ? <div className={`alert alert-soft form-status ${formState.status === "success" ? "alert-success" : "alert-error"}`} role="alert">{formState.status === "success" ? <Check size={17} /> : <X size={17} />}<span>{formState.message}</span></div> : null}</form><aside className="direct-card"><p className="eyebrow">SAY HELLO</p><button className="email-copy" onClick={copyEmail}>{contactEmail} {copied ? <Check size={18} /> : <Copy size={18} />}</button><p className="copy-caption">{copied ? "COPIED" : "CLICK TO COPY"}</p><p>완성된 기획도, 한 줄짜리 아이디어도 좋습니다. 클리어데브와 첫 번째 빌드를 시작해보세요.</p><p className="eyebrow channel-title">FIND ME ONLINE</p><div className="channel-links"><a href={githubUrl} target="_blank" rel="noreferrer"><FaGithub />GITHUB</a><a href={`mailto:${contactEmail}`}><Mail />EMAIL</a></div></aside></div></div></section>;
}

function Footer() {
  return <footer className="footer site-footer"><div className="shell footer-layout"><div className="footer-brand"><Logo /><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div><nav><h3>EXPLORE</h3>{navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><nav><h3>FIND ME ONLINE</h3><a href={githubUrl} target="_blank" rel="noreferrer">GITHUB</a><a href={`mailto:${contactEmail}`}>EMAIL</a></nav><p className="copyright">© 2026 CLYRDEV. BUILT WITH AI, CURIOSITY & GOOD VIBES.</p></div></footer>;
}

export function App() {
  useEffect(() => { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }), { threshold: .12 }); document.querySelectorAll(".reveal").forEach((el) => observer.observe(el)); return () => observer.disconnect(); }, []);
  return <><Header /><main><Hero /><Work /><Numbers /><Services /><Projects /><Contact /></main><Footer /></>;
}
