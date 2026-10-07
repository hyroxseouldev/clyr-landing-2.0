import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useContent } from "../lib/content";
import { getBlueprintHero } from "../../shared/blueprint-content.js";
import { BuildingScene } from "./BuildingScene";

export function BlueprintHero() {
  const { settings, services } = useContent();
  const hero = getBlueprintHero(settings);

  return (
    <section id="top" className="blueprint-hero" aria-labelledby="hero-heading">
      <div className="shell blueprint-stage">
        <div className="blueprint-intro">
          <p className="eyebrow hero-eyebrow">
            <span className="cyan-dot" aria-hidden="true" />
            {settings.heroEyebrow}
          </p>
          <h1 id="hero-heading" className="blueprint-title">
            {hero.title.split("\n").map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </h1>
          <p className="blueprint-lead">{hero.introduction}</p>
        </div>

        <BuildingScene />

        <div className="blueprint-aside">
          <p className="blueprint-studio" aria-hidden="true">
            CLYRDEV /<br />BUILD WHAT<br />MATTERS
          </p>
          <div className="blueprint-aside-copy">
            <h2>{hero.asideTitle}</h2>
            <p>{settings.heroDescription}</p>
          </div>
        </div>

        <div className="blueprint-actions">
          <Button asChild>
            <a href="#books" className="primary-btn">
              만든 것들 보기 <ArrowUpRight size={17} />
            </a>
          </Button>
          <a href={settings.githubUrl} className="blueprint-github"
            target="_blank" rel="noreferrer">
            <FaGithub size={21} /> GitHub
          </a>
        </div>
      </div>

      <div className="shell blueprint-baseline" aria-hidden="true">
        <span>ALWAYS BUILDING</span>
        <hr />
        <span className="blueprint-process">
          IDEA <ArrowRight size={12} /> BUILD <ArrowRight size={12} /> LAUNCH
        </span>
      </div>

      {services.length > 0 ? (
        <nav className="blueprint-services" aria-label="제공 서비스 바로가기">
          <div className="shell blueprint-services-inner">
            {services.map(({ id, title, detail }, index) => (
              <a href="#services" key={id}>
                <span className="blueprint-service-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{title}</h2>
                <p>{detail}</p>
                <ArrowUpRight className="blueprint-service-arrow" size={17} />
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </section>
  );
}
