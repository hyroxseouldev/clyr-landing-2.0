import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import "./policies.css";

export const contactEmail = "vividxxxxx@gmail.com";
export const privacyPath = "/apps/cloudboard/privacy";
export const deletionPath = "/apps/cloudboard/delete-account";
export const deletionEmail = `mailto:${contactEmail}?subject=${encodeURIComponent("[클라우드보드] 계정 삭제 요청")}&body=${encodeURIComponent("클라우드보드 계정과 연결된 데이터의 삭제를 요청합니다.\n\n가입 이메일:")}`;

function Section({ title, children }) {
  return <section className="policy-section"><h2>{title}</h2>{children}</section>;
}

function EmailActions() {
  const [status, setStatus] = useState("");
  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(contactEmail);
      setStatus("이메일 주소를 복사했습니다.");
    } catch {
      setStatus(`복사하지 못했습니다. 아래 이메일 주소를 길게 누르거나 선택해서 복사해 주세요: ${contactEmail}`);
    }
  }
  return <div className="policy-request">
    <div className="policy-actions">
      <Button asChild><a className="policy-primary" href={deletionEmail}>이메일로 삭제 요청하기</a></Button>
      <Button variant="outline" onClick={copyEmail}>이메일 주소 복사</Button>
    </div>
    <a className="policy-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
    <p className="policy-note">메일 앱을 여는 것만으로 요청이 접수되지는 않습니다. 이메일을 발송해 주세요. 가입 이메일을 사용할 수 없다면 문의해 주세요.</p>
    <p className="policy-feedback" role="status" aria-live="polite">{status}</p>
  </div>;
}

function DeleteAccount() {
  return <>
    <p className="policy-lead">클라우드보드 계정과 연결된 데이터의 삭제를 요청할 수 있습니다. 앱을 삭제했거나 로그인할 수 없는 경우에도 아래 이메일로 문의해 주세요.</p>
    <EmailActions />
    <Section title="1. 삭제되는 정보">
      <ul><li>클라우드보드 인증 계정과 프로필: 사용자 ID, 이메일, 표시 이름, 프로필 이미지</li><li>계정에 연결된 워크아웃, 운동 설명, 업로드 이미지와 매장 설정</li><li>연결 디스플레이의 등록·접근 정보와 계정에 연결된 재생·운영 데이터</li></ul>
      <p>계정 비활성화만으로 처리하지 않고 연결된 데이터와 파일도 삭제 대상으로 확인합니다.</p>
    </Section>
    <Section title="2. 삭제 전 확인해 주세요">
      <p>삭제한 계정과 콘텐츠는 복구할 수 없습니다. 필요한 콘텐츠는 요청 전에 별도로 보관해 주세요. 연결된 디스플레이는 삭제된 계정의 콘텐츠에 더 이상 접근할 수 없으며, 이용을 계속하려면 새 계정으로 다시 연결해야 합니다.</p>
      <p>클라우드보드 계정을 삭제해도 Google 계정 자체나 다른 앱의 계정은 삭제되지 않습니다. 앱을 기기에서 제거하는 것만으로 클라우드보드 계정이 삭제되지는 않습니다.</p>
    </Section>
    <Section title="3. 요청 방법과 본인 확인">
      <p>가입한 Google 계정의 이메일 주소에서 요청을 보내고, 메일 본문에 가입 이메일을 적어 주세요. 해당 이메일을 사용할 수 없다면 먼저 문의해 주세요. 계정 소유 확인이 어려운 경우 확인 가능한 방법을 별도로 안내합니다.</p>
      <p>삭제 사유는 필수가 아닙니다. 비밀번호, 인증번호, 신분증을 보내지 마세요. 삭제 요청을 위해 앱을 다시 설치하거나 로그인할 필요는 없습니다.</p>
    </Section>
    <Section title="4. 처리 절차와 기간">
      <ol><li>이메일 요청 접수</li><li>가입 이메일을 통한 계정 소유 확인</li><li>인증 계정, 연결된 데이터·파일·기기 접근 정보 삭제</li><li>이메일로 처리 완료 안내</li></ol>
      <p>본인 확인이 완료된 날부터 7일 이내에 계정과 연결 데이터의 삭제를 처리하고 이메일로 완료를 안내합니다. 본인 확인에 추가 정보가 필요한 경우 이메일로 안내합니다.</p>
    </Section>
    <Section title="5. 보관 예외와 백업">
      <p>문의 및 삭제 요청 이메일과 처리 기록은 요청 이행 확인과 후속 문의 대응을 위해 처리 완료 후 30일간 보관한 뒤 삭제합니다. 이 기록에는 이메일 주소, 요청 내용, 접수·완료일과 처리 결과가 포함됩니다.</p>
      <p>개별 Firebase 서비스의 삭제 처리와 백업 정리에는 별도 시간이 걸릴 수 있습니다. 계정 삭제가 모든 오류 기록·백업의 즉시 삭제를 의미하지는 않습니다. 서비스별 기준은 <a href={privacyPath}>개인정보처리방침</a>을 확인해 주세요.</p>
    </Section>
  </>;
}

function Privacy() {
  return <>
    <p className="policy-lead">클라우드보드 앱의 계정, 콘텐츠, 연결 디스플레이와 관련된 개인정보 처리 내용을 안내합니다. 이 방침은 클라우드보드 앱에 관한 것으로, 포트폴리오의 다른 서비스에는 적용되지 않습니다.</p>
    <dl className="policy-dates"><div><dt>시행일</dt><dd>2026년 9월 12일</dd></div><div><dt>최종 작성일</dt><dd><time dateTime="2026-09-12">2026년 9월 12일</time></dd></div></dl>
    <Section title="1. 운영자와 문의처">
      <p>앱 이름: 클라우드보드 (CloudBoard)<br />운영자: 클리어데브 (CLYRDEV)<br />개인정보 문의 및 권리 행사: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
    </Section>
    <Section title="2. 처리 목적과 개인정보 항목">
      <dl className="policy-data">
        <div><dt>계정·프로필</dt><dd>Firebase 사용자 ID, 이메일, 표시 이름, 프로필 사진 URL 및 업로드한 프로필 이미지. 로그인, 사용자 식별, 프로필 관리에 사용합니다.</dd></div>
        <div><dt>서비스 이용 설정</dt><dd>파트너 등급, 이용 플랜·상태, 시범 이용 종료일, 디스플레이 한도. 계정의 서비스 이용 범위를 관리합니다.</dd></div>
        <div><dt>사용자 콘텐츠</dt><dd>워크아웃, 운동 설명, 업로드 이미지, 매장 설정과 브랜드 이미지. 콘텐츠 저장·동기화 및 디스플레이 표시를 위해 처리합니다.</dd></div>
        <div><dt>기기 연결·운영</dt><dd>페어링 코드, 기기 식별·연결 정보, 소유 계정 연결 정보, 활성 재생 세션과 운영 이벤트. 디스플레이 연결과 재생 상태 동기화에 사용합니다.</dd></div>
        <div><dt>장애 진단</dt><dd>Firebase Crashlytics가 수집하는 오류 스택, 설치 식별자 및 기기·앱 관련 진단 정보. 오류 분석과 안정성 개선에 사용합니다.</dd></div>
        <div><dt>고객 지원</dt><dd>문의·삭제 요청을 보낸 이메일 주소, 본문과 처리 과정에서 주고받은 내용. 본인 확인, 문의 대응과 요청 처리에 사용합니다.</dd></div>
      </dl>
    </Section>
    <Section title="3. 수집 방법">
      <p>Google 로그인 과정, 사용자의 입력·업로드, 기기 연결과 앱 이용, Firebase SDK의 작동, 사용자가 보낸 이메일을 통해 정보를 처리합니다. Google 계정의 비밀번호를 클라우드보드에 제출할 필요가 없습니다.</p>
    </Section>
    <Section title="4. 보유·이용 기간">
      <p>계정·콘텐츠·연결 정보는 계정 이용 중 서비스 제공에 필요한 동안 보관합니다. 계정 삭제 요청은 본인 확인 완료일부터 7일 이내에 처리합니다. 문의 및 삭제 요청 이메일과 처리 기록(이메일 주소, 요청 내용, 접수·완료일, 처리 결과)은 요청 이행 확인과 후속 문의 대응을 위해 처리 완료 후 30일간 보관한 뒤 삭제합니다.</p>
      <p>업로드 이미지 삭제 후 Storage의 복구용 보관(soft delete)에는 7일의 보관 기간이 적용됩니다. Firestore는 현재 시점 복구(PITR)가 비활성화되어 있고 최근 버전 보관 기간은 1시간입니다. 이 설정은 Google 서비스 내부의 모든 백업·삭제 절차가 같은 시간 안에 끝난다는 뜻은 아닙니다.</p>
      <p>Google의 공식 안내에 따르면 Firebase Authentication의 계정 정보는 운영자가 삭제를 시작한 후 서비스·백업 시스템에서 제거되기까지 최대 180일이 걸릴 수 있습니다. Crashlytics는 오류 기록과 관련 식별자를 90일 동안 보관한 뒤 서비스·백업 시스템에서 제거하는 절차를 시작합니다. 이 기간은 운영자의 삭제 요청 처리 기간과 다릅니다.</p>
    </Section>
    <Section title="5. 외부 서비스 이용">
      <p>클라우드보드는 Google의 Firebase Authentication(로그인·계정), Cloud Firestore(프로필·워크아웃), Realtime Database(기기 연결·재생·운영 상태), Cloud Storage for Firebase(이미지), Crashlytics(장애 진단)를 사용합니다. Google 로그인은 Google 계정 인증에 사용됩니다.</p>
      <p>개인정보 처리 업무에는 Google의 Firebase 서비스를 이용하며, 계정 인증·데이터 저장·파일 보관·오류 분석에 필요한 정보를 전달합니다.</p>
      <p>Firebase는 서비스별 약관과 데이터 처리 조건에 따라 정보를 처리합니다. <a href="https://firebase.google.com/support/privacy">Firebase 개인정보 및 보안 안내</a>와 <a href="https://policies.google.com/privacy?hl=ko">Google 개인정보처리방침</a>에서 관련 내용을 확인할 수 있습니다.</p>
      <p>이 페이지의 삭제 요청은 사용자의 메일 앱에서 직접 발송하는 방식입니다. 포트폴리오 문의 폼의 Resend를 통해 접수하지 않습니다.</p>
    </Section>
    <Section title="6. 국외 이전">
      <p>이전받는 자는 Firebase 서비스 제공자인 Google LLC이며, 관련 문의는 <a href="https://firebase.google.com/support/privacy/dpo">Google 개인정보 문의 창구</a> 또는 클라우드보드 문의 이메일로 접수할 수 있습니다. 로그인·콘텐츠 동기화·기기 연결·오류 보고 시 해당 정보를 네트워크로 전송하며, 처리 목적과 항목은 제2항, 보유 기간은 제4항을 따릅니다.</p>
      <p>Firebase Authentication의 계정 인증 정보는 미국에서 처리되며, 기기 연결·재생·운영 정보는 싱가포르(asia-southeast1)의 Realtime Database에 저장됩니다. Firestore와 이미지 Storage의 저장 리전은 대한민국 서울(asia-northeast3)입니다. Crashlytics 등 글로벌 서비스는 Google의 처리 인프라를 사용하므로 저장 리전과 모든 처리 위치가 동일한 것은 아닙니다.</p>
    </Section>
    <Section title="7. 삭제 요청과 파기 절차">
      <p><a href={deletionPath}>계정 삭제 요청 안내</a>에서 이메일로 요청할 수 있습니다. 계정 소유를 확인한 후 인증 계정뿐 아니라 연결된 DB 데이터, 업로드 파일과 기기 접근 정보를 함께 삭제하고 완료를 안내합니다. 전자 정보는 해당 서비스의 삭제 기능을 사용해 처리하며, 백업·서비스 로그는 제4항의 별도 기준을 확인해야 합니다.</p>
    </Section>
    <Section title="8. 사용자의 권리">
      <p>개인정보 열람·정정·삭제·처리 정지에 관한 요청은 문의 이메일로 보내실 수 있습니다. 요청자 본인 여부를 확인하는 데 필요한 최소한의 정보를 확인할 수 있으며, 처리 결과 또는 제한 사유를 안내합니다. 계정 삭제 사유는 필수가 아니며 비밀번호·인증번호·신분증을 요구하지 않습니다.</p>
    </Section>
    <Section title="9. 개인정보 보호 조치">
      <p>클라우드보드는 Firebase 인증과 소유 계정 기반 데이터 접근 제한을 사용하도록 구성되어 있습니다. 업로드 이미지에는 형식·크기 제한을 적용하며, 개인정보는 처리에 필요한 범위에서만 취급합니다.</p>
    </Section>
    <Section title="10. 변경 안내">
      <p>처리방침을 변경하는 경우 이 페이지의 수정일과 내용을 갱신하고, 중요한 변경은 앱 내 안내 등 이용자가 확인할 수 있는 방법으로 알립니다.</p>
    </Section>
  </>;
}

export default function PolicyPages({ page }) {
  const deletion = page === "delete-account";
  const title = deletion ? "클라우드보드 계정 삭제 요청" : "클라우드보드 개인정보처리방침";
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = title;
    if (description) description.content = `${title}. 문의: ${contactEmail}`;
    return () => {
      document.title = previousTitle;
      if (description) description.content = previousDescription;
    };
  }, [title]);
  return <div className="cloudboard-policy">
    <a className="skip-link" href="#policy-content">본문으로 건너뛰기</a>
    <header className="policy-header"><a href={privacyPath}>클라우드보드 <span>CloudBoard</span></a><a href="/">포트폴리오</a></header>
    <main id="policy-content" className="policy-document" tabIndex={-1}>
      <p className="policy-kicker">CLOUDBOARD / {deletion ? "ACCOUNT DELETION" : "PRIVACY"}</p>
      <h1>{title}</h1>
      {deletion ? <DeleteAccount /> : <Privacy />}
    </main>
    <footer className="policy-footer"><a href={`mailto:${contactEmail}`}>{contactEmail}</a><nav aria-label="클라우드보드 정책"><a href={privacyPath} aria-current={!deletion ? "page" : undefined}>개인정보처리방침</a><a href={deletionPath} aria-current={deletion ? "page" : undefined}>계정 삭제 요청</a><a href="/">포트폴리오로 돌아가기</a></nav></footer>
  </div>;
}
