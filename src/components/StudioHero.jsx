import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "../lib/content";
import { getProjectImageProps } from "../lib/project-images";
import { getBlueprintHero } from "../../shared/blueprint-content.js";

function StudioWork({ project, className, caption }) {
  if (!project?.image) return null;
  const link = project.links.find(({ icon }) => icon === "web") ?? project.links[0];
  const contents = <>
    <div className="studio-work-print">
      <img {...getProjectImageProps(project.image)}
        sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1440px) 55vw, 720px"
        alt={project.alt} width="1000" height="1000" decoding="async"
        fetchPriority={className === "studio-work-brn" ? "high" : "auto"} />
    </div>
    <div className="studio-work-caption">
      <strong>{project.name}</strong>
      <span>{caption}{link ? <ArrowUpRight size={15} aria-hidden="true" /> : null}</span>
    </div>
  </>;
  return link ? (
    <a className={`studio-work ${className}`} href={link.href} target="_blank" rel="noreferrer"
      aria-label={`${project.name} · ${caption} 웹사이트 열기`}>{contents}</a>
  ) : <div className={`studio-work ${className}`}>{contents}</div>;
}

export function StudioHero() {
  const { settings, projects } = useContent();
  const hero = getBlueprintHero(settings);
  const featured = [
    { project: projects.find(({ id }) => id === "project-5"), className: "studio-work-brn", caption: "모임 신청 · 회원 관리" },
    { project: projects.find(({ id }) => id === "project-3"), className: "studio-work-kkol", caption: "스튜디오 홈페이지" },
  ].filter(({ project }) => project?.image);
  return (
    <section id="top" className="studio-hero" aria-labelledby="hero-heading">
      <div className="shell studio-hero-inner">
        <div className="studio-masthead">
          <p className="studio-display" aria-label="Small websites. Big energy.">
            <span>SMALL WEBSITES.</span><span>BIG ENERGY.</span>
          </p>
          <div className="studio-note">
            <p>CLYRDEV<br /><span>{settings.heroEyebrow}</span></p>
          </div>
        </div>
        <div className="studio-introduction">
          <div>
            <h1 id="hero-heading">{hero.title.split("\n").map((line, index) => <span key={index}>{line}</span>)}</h1>
          </div>
          <div className="studio-introduction-detail">
            <p>{hero.introduction}</p>
            <div className="studio-actions">
              <Button asChild><a href="#contact" className="primary-btn">제작 문의하기 <ArrowUpRight size={18} /></a></Button>
              <a className="studio-work-link" href="#books">제작 사례 보기 <ArrowRight size={18} /></a>
            </div>
          </div>
        </div>
        {featured.length > 0 ? <div className="studio-exhibition" aria-label="직접 만든 웹사이트" data-count={featured.length}>
          {featured.map(item => <StudioWork key={item.project.id} {...item} />)}
        </div> : null}
      </div>
    </section>
  );
}

export function StudioInvitation() {
  const { settings } = useContent();
  const hero = getBlueprintHero(settings);
  return (
    <div className="shell studio-invitation">
      <span className="studio-signature">CLYRDEV<br />WEB STUDIO</span>
      <a className="studio-invitation-title" href="#contact">{hero.asideTitle}</a>
      <div>
        <a className="studio-invitation-email" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
        <p>{settings.heroDescription}</p>
      </div>
    </div>
  );
}
