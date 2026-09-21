import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  FileText,
  Layers3,
  LogOut,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "./auth-client";
import UploadField from "./UploadField";
import "./admin.css";
const tabs = [
  ["projects", "프로젝트", BriefcaseBusiness],
  ["partners", "협업 브랜드", Users],
  ["stats", "실적 숫자", BarChart3],
  ["services", "제공 서비스", Layers3],
  ["settings", "사이트 문구", FileText],
  ["account", "계정 설정", Settings2],
];
const sectionNames = {
  work: "협업 브랜드",
  numbers: "실적",
  services: "제공 서비스",
  projects: "프로젝트",
  contact: "문의",
};
const templates = {
  projects: {
    name: "새 프로젝트",
    description: "프로젝트를 소개해주세요.",
    role: "기획 · 개발",
    tech: [],
    image: "",
    alt: "",
    links: [],
    development: true,
  },
  partners: { name: "새 브랜드", image: "" },
  stats: { label: "NEW METRIC", value: "0", style: "students" },
  services: {
    title: "새 서비스",
    eyebrow: "NEW SERVICE",
    detail: "서비스를 소개해주세요.",
    icon: "code",
  },
};
async function api(path, options = {}) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.issues
        ? data.issues.map((i) => `${i.path}: ${i.message}`).join("\n")
        : data.message || "요청에 실패했습니다.",
    );
  return data;
}
function Field({ label, value, onChange, multiline = false, ...props }) {
  const Component = multiline ? Textarea : Input;
  return (
    <label className="admin-field">
      <span>{label}</span>
      <Component
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option value={v} key={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
function Login({ onSuccess }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const result = await authClient.signIn.email(values);
      if (result.error) throw new Error("이메일과 비밀번호를 확인해주세요.");
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-login">
      <a href="/" className="admin-wordmark">
        클리어데브 <span>STUDIO</span>
      </a>
      <Card className="admin-login-card">
        <div className="admin-lock">
          <ShieldCheck size={24} />
        </div>
        <p className="eyebrow">YOUR WORK, IN ONE PLACE</p>
        <h1>다음 빌드를 준비하세요.</h1>
        <p>포트폴리오 콘텐츠를 관리하는 나만의 공간.</p>
        <form onSubmit={submit}>
          <label className="admin-field">
            <span>이메일</span>
            <Input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="관리자 이메일"
            />
          </label>
          <label className="admin-field">
            <span>비밀번호</span>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="비밀번호를 입력하세요"
            />
          </label>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <Button className="admin-primary" disabled={busy}>
            {busy ? "로그인 중…" : "관리자 로그인"}
            <ChevronRight size={17} />
          </Button>
        </form>
        <small>초대된 관리자만 접근할 수 있습니다.</small>
      </Card>
      <a href="/" className="admin-back">
        포트폴리오로 돌아가기 <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
function Account({ user }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (values.newPassword !== values.confirmPassword) {
      setMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    setBusy(true);
    try {
      const r = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });
      if (r.error) throw new Error(r.error.message);
      setMessage("비밀번호를 변경했습니다.");
      form.reset();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="admin-editor">
      <h2>계정 보안</h2>
      <p className="admin-muted">{user.email}</p>
      <form onSubmit={submit} className="admin-account-form">
        <label className="admin-field">
          <span>현재 비밀번호</span>
          <Input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label className="admin-field">
          <span>새 비밀번호 · 8자 이상</span>
          <Input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
        </label>
        <label className="admin-field">
          <span>새 비밀번호 확인</span>
          <Input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
        </label>
        <Button className="admin-primary" disabled={busy}>
          {busy ? "변경 중…" : "비밀번호 변경"}
        </Button>
        {message && <p role="status">{message}</p>}
      </form>
    </Card>
  );
}
function SettingsEditor({ value, onChange }) {
  const set = (key, v) => onChange({ ...value, [key]: v });
  return (
    <Card className="admin-editor">
      <div className="admin-editor-title">
        <FileText size={19} />
        <h2>사이트 문구</h2>
      </div>
      <p className="admin-muted">소개와 연락처, 각 섹션의 제목을 편집합니다.</p>
      <div className="admin-fields two">
        <Field
          label="브랜드 이름"
          value={value.brand}
          onChange={(v) => set("brand", v)}
        />
        <Field
          label="연락 이메일"
          type="email"
          value={value.contactEmail}
          onChange={(v) => set("contactEmail", v)}
        />
      </div>
      <Field
        label="GitHub 링크"
        value={value.githubUrl}
        onChange={(v) => set("githubUrl", v)}
      />
      <Field
        label="메인 상단 문구"
        value={value.heroEyebrow}
        onChange={(v) => set("heroEyebrow", v)}
      />
      <Field
        label="메인 제목"
        multiline
        rows={3}
        value={value.heroTitle}
        onChange={(v) => set("heroTitle", v)}
      />
      <Field
        label="메인 소개"
        multiline
        rows={3}
        value={value.heroDescription}
        onChange={(v) => set("heroDescription", v)}
      />
      <Field
        label="문의 안내 문구"
        multiline
        value={value.contactDescription}
        onChange={(v) => set("contactDescription", v)}
      />
      <Field
        label="푸터 문구"
        value={value.copyright}
        onChange={(v) => set("copyright", v)}
      />
      <h3>섹션 제목과 설명</h3>
      {Object.entries(sectionNames).map(([key, label]) => (
        <div className="admin-section-fields" key={key}>
          <h4>{label}</h4>
          <Field
            label={`${label} 제목`}
            value={value.sections[key].title}
            onChange={(v) =>
              set("sections", {
                ...value.sections,
                [key]: { ...value.sections[key], title: v },
              })
            }
          />
          <Field
            label={`${label} 설명`}
            value={value.sections[key].description}
            onChange={(v) =>
              set("sections", {
                ...value.sections,
                [key]: { ...value.sections[key], description: v },
              })
            }
          />
        </div>
      ))}
    </Card>
  );
}
function ItemEditor({ type, item, onChange, uploadsEnabled, onBusy }) {
  const set = (key, v) => onChange({ ...item, [key]: v });
  return (
    <>
      <div className="admin-editor-title">
        <h2>{item.name || item.title || item.label}</h2>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={item.visible}
            onChange={(e) => set("visible", e.target.checked)}
          />
          <span>{item.visible ? "공개" : "숨김"}</span>
        </label>
      </div>
      {["projects", "partners"].includes(type) && (
        <>
          <UploadField
            value={item.image}
            onChange={(v) => set("image", v)}
            enabled={uploadsEnabled}
            onBusy={onBusy}
          />
          <Field
            label={type === "projects" ? "프로젝트 이름" : "브랜드 이름"}
            value={item.name}
            onChange={(v) => set("name", v)}
          />
        </>
      )}
      {type === "projects" && (
        <>
          <Field
            label="이미지 설명"
            value={item.alt}
            onChange={(v) => set("alt", v)}
          />
          <Field
            label="프로젝트 소개"
            value={item.description}
            onChange={(v) => set("description", v)}
            multiline
            rows={4}
          />
          <Field
            label="담당 역할"
            value={item.role}
            onChange={(v) => set("role", v)}
          />
          <Field
            label="기술 스택 · 쉼표로 구분"
            value={item.tech.join(", ")}
            onChange={(v) =>
              set("tech", v ? v.split(",").map((s) => s.trim()) : [])
            }
          />
          <Select
            label="진행 상태"
            value={item.development ? "building" : "live"}
            onChange={(v) => set("development", v === "building")}
            options={[
              ["live", "운영 중"],
              ["building", "개발 중"],
            ]}
          />
          <div className="admin-links-heading">
            <h3>서비스 링크</h3>
            <Button
              type="button"
              className="admin-secondary"
              onClick={() =>
                set("links", [
                  ...item.links,
                  { label: "Website", href: "", icon: "web" },
                ])
              }
            >
              <Plus size={14} />
              링크 추가
            </Button>
          </div>
          {item.links.map((link, i) => (
            <div className="admin-link-row" key={i}>
              <Field
                label={`링크 ${i + 1} 이름`}
                value={link.label}
                onChange={(v) =>
                  set(
                    "links",
                    item.links.map((l, j) =>
                      j === i ? { ...l, label: v } : l,
                    ),
                  )
                }
              />
              <Field
                label={`링크 ${i + 1} URL`}
                value={link.href}
                onChange={(v) =>
                  set(
                    "links",
                    item.links.map((l, j) => (j === i ? { ...l, href: v } : l)),
                  )
                }
              />
              <Select
                label="링크 아이콘"
                value={link.icon}
                onChange={(v) =>
                  set(
                    "links",
                    item.links.map((l, j) => (j === i ? { ...l, icon: v } : l)),
                  )
                }
                options={[
                  ["web", "웹사이트"],
                  ["apple", "App Store"],
                  ["play", "Google Play"],
                ]}
              />
              <Button
                type="button"
                className="admin-icon-button"
                aria-label={`링크 ${i + 1} 삭제`}
                onClick={() =>
                  set(
                    "links",
                    item.links.filter((_, j) => i !== j),
                  )
                }
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </>
      )}
      {type === "services" && (
        <>
          <Field
            label="서비스 이름"
            value={item.title}
            onChange={(v) => set("title", v)}
          />
          <Field
            label="영문 분류"
            value={item.eyebrow}
            onChange={(v) => set("eyebrow", v)}
          />
          <Field
            label="서비스 설명"
            value={item.detail}
            onChange={(v) => set("detail", v)}
            multiline
          />
          <Select
            label="아이콘"
            value={item.icon}
            onChange={(v) => set("icon", v)}
            options={[
              ["code", "코드"],
              ["product", "서비스"],
              ["automation", "자동화"],
            ]}
          />
        </>
      )}
      {type === "stats" && (
        <>
          <Field
            label="항목 이름"
            value={item.label}
            onChange={(v) => set("label", v)}
          />
          <Field
            label="숫자 · 예: 300+"
            value={item.value}
            onChange={(v) => set("value", v)}
          />
          <Select
            label="막대 스타일"
            value={item.style}
            onChange={(v) => set("style", v)}
            options={[
              ["students", "블루"],
              ["subscribers", "퍼플"],
              ["brands", "시안"],
              ["books", "그린"],
            ]}
          />
        </>
      )}
    </>
  );
}
export default function Admin() {
  const {
    data: session,
    isPending: sessionPending,
    refetch,
  } = authClient.useSession();
  const [loaded, setLoaded] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [tab, setTab] = useState("projects");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!session) {
      setLoaded(null);
      setDrafts({});
      return;
    }
    let active = true;
    setLoadError("");
    api("/api/admin/content")
      .then((data) => {
        if (active) {
          setLoaded(data);
          setDrafts(
            Object.fromEntries(data.sections.map((s) => [s.key, s.data])),
          );
        }
      })
      .catch((err) => {
        if (active) setLoadError(err.message);
      });
    return () => {
      active = false;
    };
  }, [session?.user?.id, retry]);
  const sections = Object.fromEntries(
    (loaded?.sections || []).map((s) => [s.key, s]),
  );
  const dirty =
    loaded &&
    Object.keys(drafts).some(
      (key) =>
        JSON.stringify(drafts[key]) !== JSON.stringify(sections[key]?.data),
    );
  const currentDirty =
    tab !== "account" &&
    JSON.stringify(drafts[tab]) !== JSON.stringify(sections[tab]?.data);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  if (sessionPending)
    return (
      <div className="admin-loading" role="status">
        관리자 세션 확인 중…
      </div>
    );
  if (!session) return <Login onSuccess={() => refetch()} />;
  if (loadError)
    return (
      <div className="admin-loading">
        <p role="alert">{loadError}</p>
        <Button
          className="admin-primary"
          onClick={() => setRetry((r) => r + 1)}
        >
          다시 시도
        </Button>
        <Button onClick={() => authClient.signOut()}>로그아웃</Button>
      </div>
    );
  if (!loaded)
    return (
      <div className="admin-loading" role="status">
        콘텐츠를 불러오는 중…
      </div>
    );
  const value = drafts[tab];
  const items = Array.isArray(value) ? value : [];
  const item = items.find((x) => x.id === selected) || items[0];
  const change = (value) => {
    setDrafts((d) => ({ ...d, [tab]: value }));
    setMessage("");
  };
  const updateItem = (next) =>
    change(items.map((x) => (x.id === next.id ? next : x)));
  const switchTab = (key) => {
    setTab(key);
    setSelected(null);
    setMessage("");
    setDeleteId(null);
  };
  async function logout() {
    if (
      dirty &&
      !window.confirm("저장하지 않은 변경이 있습니다. 로그아웃할까요?")
    )
      return;
    await authClient.signOut();
    setLoaded(null);
  }
  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const data = await api("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: tab,
          data: value,
          version: sections[tab].version,
        }),
      });
      setLoaded((l) => ({
        ...l,
        sections: l.sections.map((s) => (s.key === tab ? data : s)),
      }));
      setDrafts((d) => ({ ...d, [tab]: data.data }));
      setMessage("저장했습니다. 랜딩페이지에 반영됩니다.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }
  function move(direction) {
    const index = items.findIndex((x) => x.id === item.id),
      next = index + direction;
    if (next < 0 || next >= items.length) return;
    const list = [...items];
    [list[index], list[next]] = [list[next], list[index]];
    setSelected(item.id);
    change(list);
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-wordmark">
          클리어데브 <span>STUDIO</span>
        </a>
        <p className="admin-nav-caption">WORKSPACE</p>
        <nav aria-label="관리자 메뉴">
          {tabs.map(([key, label, Icon]) => (
            <Button
              className={`admin-nav-item ${tab === key ? "active" : ""}`}
              key={key}
              disabled={saving || uploading}
              onClick={() => switchTab(key)}
              aria-current={tab === key ? "page" : undefined}
            >
              <Icon size={18} />
              {label}
              {Array.isArray(drafts[key]) && <span>{drafts[key].length}</span>}
              {drafts[key] &&
                JSON.stringify(drafts[key]) !==
                  JSON.stringify(sections[key]?.data) && (
                  <i
                    className="admin-dirty-dot"
                    aria-label="저장하지 않은 변경"
                  />
                )}
            </Button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-avatar">C</div>
          <div>
            <strong>클리어데브</strong>
            <small>Administrator</small>
          </div>
          <Button
            aria-label="로그아웃"
            className="admin-icon-button"
            disabled={uploading || saving}
            onClick={logout}
          >
            <LogOut size={16} />
          </Button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>
            Workspace <ChevronRight size={14} />{" "}
            {tabs.find((t) => t[0] === tab)[1]}
          </span>
          <a href="/" target="_blank" rel="noreferrer">
            사이트 보기 <ArrowUpRight size={15} />
          </a>
          <Button
            className="admin-icon-button admin-mobile-logout"
            aria-label="로그아웃"
            disabled={uploading || saving}
            onClick={logout}
          >
            <LogOut size={16} />
          </Button>
        </header>
        <main className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="eyebrow">PORTFOLIO MANAGEMENT</p>
              <h1>{tabs.find((t) => t[0] === tab)[1]}</h1>
              <p>만든 것들을 정리하고, 새로운 이야기를 더하세요.</p>
            </div>
            {tab !== "account" && (
              <Button
                className="admin-primary"
                disabled={saving || uploading || !currentDirty}
                onClick={save}
              >
                <Save size={16} />
                {saving ? "저장 중…" : "변경사항 저장"}
              </Button>
            )}
          </div>
          {message && (
            <div role="status" className="admin-notice">
              {message}
            </div>
          )}
          {tab === "account" ? (
            <Account user={loaded.user} />
          ) : tab === "settings" ? (
            <fieldset disabled={saving || uploading} className="admin-fieldset">
              <SettingsEditor value={value} onChange={change} />
            </fieldset>
          ) : (
            <>
              <div className="admin-summary">
                <div>
                  <span>전체 항목</span>
                  <strong>{items.length.toString().padStart(2, "0")}</strong>
                </div>
                <div>
                  <span>공개 중</span>
                  <strong>
                    {items
                      .filter((x) => x.visible)
                      .length.toString()
                      .padStart(2, "0")}
                    <i />
                  </strong>
                </div>
                <div>
                  <span>마지막 저장</span>
                  <p>
                    {new Date(sections[tab].updatedAt).toLocaleString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <fieldset
                className="admin-fieldset"
                disabled={saving || uploading}
              >
                <div className="admin-workspace">
                  <Card className="admin-item-panel">
                    <div className="admin-list-heading">
                      <h2>
                        콘텐츠 목록 <span>{items.length}</span>
                      </h2>
                      <Button
                        className="admin-icon-button"
                        aria-label="항목 추가"
                        onClick={() => {
                          const next = {
                            ...structuredClone(templates[tab]),
                            id: crypto.randomUUID(),
                            visible: false,
                          };
                          change([...items, next]);
                          setSelected(next.id);
                        }}
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <p className="admin-list-help">
                      항목을 선택해 내용을 편집하세요.
                    </p>
                    <div className="admin-item-list">
                      {items.map((entry, index) => (
                        <button
                          type="button"
                          className={`admin-item ${item?.id === entry.id ? "selected" : ""}`}
                          key={entry.id}
                          onClick={() => {
                            setSelected(entry.id);
                            setDeleteId(null);
                          }}
                        >
                          <span className="admin-item-number">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {entry.image && <img src={entry.image} alt="" />}
                          <span className="admin-item-name">
                            <strong>
                              {entry.name || entry.title || entry.label}
                            </strong>
                            <small>
                              {entry.visible ? "공개 중" : "숨김"}
                              {entry.development ? " · 개발 중" : ""}
                            </small>
                          </span>
                          <ChevronRight size={14} />
                        </button>
                      ))}
                    </div>
                    {items.length === 0 && (
                      <p className="admin-empty">
                        아직 항목이 없습니다. + 버튼으로 추가하세요.
                      </p>
                    )}
                    <div className="admin-list-footer">
                      <span className="admin-dirty-dot" />
                      변경사항을 저장하면 사이트에 반영됩니다.
                    </div>
                  </Card>
                  <Card className="admin-editor">
                    {item ? (
                      <>
                        <ItemEditor
                          key={item.id}
                          type={tab}
                          item={item}
                          onChange={updateItem}
                          uploadsEnabled={loaded.uploadsEnabled}
                          onBusy={setUploading}
                        />
                        <div className="admin-editor-footer">
                          <div className="admin-reorder">
                            <Button
                              className="admin-secondary"
                              disabled={items[0].id === item.id}
                              onClick={() => move(-1)}
                            >
                              <ArrowUp size={14} />
                              위로
                            </Button>
                            <Button
                              className="admin-secondary"
                              disabled={items.at(-1).id === item.id}
                              onClick={() => move(1)}
                            >
                              <ArrowDown size={14} />
                              아래로
                            </Button>
                          </div>
                          <Button
                            className="admin-danger"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 size={14} />
                            삭제
                          </Button>
                        </div>
                        {deleteId === item.id && (
                          <div className="admin-delete-confirm" role="alert">
                            <p>
                              이 항목을 목록에서 삭제할까요? 저장 전에는 되돌릴
                              수 있습니다.
                            </p>
                            <Button
                              className="admin-danger"
                              onClick={() => {
                                change(items.filter((x) => x.id !== item.id));
                                setSelected(null);
                                setDeleteId(null);
                              }}
                            >
                              목록에서 삭제
                            </Button>
                            <Button
                              className="admin-secondary"
                              onClick={() => setDeleteId(null)}
                            >
                              취소
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="admin-empty">
                        <Layers3 size={30} />
                        <p>첫 번째 콘텐츠를 추가해보세요.</p>
                      </div>
                    )}
                  </Card>
                </div>
              </fieldset>
            </>
          )}
          {tab !== "account" && currentDirty && (
            <div className="admin-unsaved">
              <span>저장하지 않은 변경사항이 있습니다.</span>
              <Button
                className="admin-secondary"
                disabled={saving || uploading}
                onClick={() => {
                  if (window.confirm("이 섹션의 변경사항을 되돌릴까요?")) {
                    change(structuredClone(sections[tab].data));
                    setDeleteId(null);
                  }
                }}
              >
                변경 취소
              </Button>
            </div>
          )}
          <footer className="admin-bottom">
            <span>CLYRDEV STUDIO</span>
            <span>
              <ShieldCheck size={13} /> 관리자 전용 공간
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
