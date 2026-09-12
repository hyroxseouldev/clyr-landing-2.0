# 클라우드보드 정책 페이지 공개 점검

## 2026-09-12 최신 변경 — 아래 초기 점검보다 우선

- 사용자 승인: 본인 확인 완료 후 7일 이내 삭제, 문의·삭제 처리 기록은 완료 후 30일 보관 뒤 삭제.
- 사용자 화면의 검토본 배너·검토 메모 및 noindex 제거. 시행일/수정일 2026-09-12 반영. 아직 원격 배포하지 않음.
- 인증된 Firebase CLI로 확인: Firestore `asia-northeast3`, PITR 비활성, versionRetentionPeriod `3600s`; Realtime Database `asia-southeast1`.
- 인증된 Storage 메타데이터 조회로 확인: 버킷 `cloud-board-stationd.firebasestorage.app`, `ASIA-NORTHEAST3`, softDeletePolicy `604800`초(7일).
- 읽기 전용 조회만 수행했으며 서비스 설정이나 사용자 데이터는 변경하지 않음.
- 아래 미확인 목록 중 처리 기한·문의 기록 보관 기간·DB/Storage 리전·PITR/soft-delete는 위 결과로 해소됨.
- 별도 예약 백업·내보내기, 실제 배포된 보안 규칙, 국외 이전 법적 근거/고지·동의 요건, 앱 내부 삭제 진입점과 실제 수동 삭제 절차는 별도로 검증해야 함. 화면에서 검토 문구를 제거한 것이 해당 검증 완료나 심사 통과를 의미하지 않음.

## 초기 점검 기록 (위 최신 변경 이전)

- `/apps/cloudboard/privacy`, `/apps/cloudboard/delete-account` 구현.
- 대상은 클라우드보드 앱이며 포트폴리오 전체의 정책이 아님.
- 이메일 링크와 주소 복사만 사용. DB, Resend, 자동 계정 삭제 기능 없음.
- 실제 서비스 사실을 추정해 공표하지 않도록 검토본 배너와 noindex 적용. Vercel 배포·앱 스토어 제출은 아직 하지 않음.

## 2026-09-12 소스 확인 근거

읽기 전용으로 `/Users/sunmkim/Dev2026/cloud_board` 확인. 앱 코드·서버 설정은 변경하지 않음.

- `pubspec.yaml`: Firebase Auth, Firestore, Realtime Database, Storage, Crashlytics, Google 로그인 사용.
- `lib/main.dart`: Crashlytics 오류 처리 연결.
- `lib/src/app/feature/profile/data/models/user_profile_model.dart`: UID, 이메일, 표시 이름, 사진 URL, 등급·플랜·상태·시범 종료일·디스플레이 한도.
- 데이터 소스: Firestore 사용자 문서 및 workouts 하위 컬렉션, Storage 프로필·브랜드·워크아웃 이미지, Realtime Database users/operations/activeSession/devices 및 pairingCodes/displayAccess.
- `firestore.rules`, `storage.rules`: 소유 계정 접근 통제와 이미지 크기·형식 제한. 운영 환경에 배포됐는지는 확인하지 않음.
- 소스에서 프로젝트별 Firestore·Storage·Realtime Database 리전, 백업·PITR·soft-delete 설정은 확인하지 못함.

## 공개 전 확정해야 하는 정보

1. 실제 운영자/개인정보 보호책임자 표기. 기존 브랜드 `클리어데브`는 법적 운영자 확인을 대체하지 않음.
2. 본인 확인 이후 보장 가능한 최대 삭제 처리 기간. 일반 MVP라는 이유로 7일·30일 등을 사실로 기재하지 않음.
3. 문의·삭제 요청 이메일 보관 기간, 법정 보관 예외 유무와 항목·근거·기간.
4. 서비스별 리전과 국외 이전의 수신자·연락처·국가·항목·시점·방법·목적·기간·근거·거부 방법 및 영향.
5. 실제 백업·PITR·Storage soft-delete·로그 보관 정책 및 삭제 복원 방지 절차.
6. 스토어 데이터 보안 답변, 배포된 보안 규칙과 실제 앱 수집 항목의 일치.

## 삭제 운영 체크리스트

- 테스트 계정으로 요청 접수부터 완료 안내까지 검증한다. 실제 사용자 데이터로 시험하지 않는다.
- 가입 이메일의 소유를 확인한다. 삭제 사유, 비밀번호, 인증번호, 신분증은 요구하지 않는다.
- 먼저 계정 UID와 연결 디스플레이 UID, 페어링 코드, 파일 경로를 확인한다.
- 디스플레이 접근 및 활성 세션을 해제하고 관련 Realtime Database 정보를 삭제한다.
- Firestore 사용자 문서만 지우지 말고 workouts 등 하위 컬렉션도 확인해 삭제한다.
- Storage의 프로필·브랜드·워크아웃 이미지와 관련 파일을 삭제한다.
- Firebase 인증 계정을 삭제하고 연결된 디스플레이용 계정의 처리 범위도 검토한다.
- 백업·오류 로그·문의 기록에 남는 데이터와 정리 시점을 확인해 안내한다.
- 완료 안내 후 정해진 문의 기록 보관 정책을 적용한다.

## 출시 작업

- 확정된 사실로 공개 문구를 완성하고 검토본 배너/검토 메모/noindex를 제거한다.
- 시행일을 실제 정책 공개일로 확정한다.
- 두 경로의 직접 접속·새로고침, 모바일, 이메일 작성, 복사 실패/성공, 페이지 간 이동을 재검증한다.
- Vercel에 배포하고 실제 도메인에서 확인한다. 현재 catch-all rewrite가 두 경로를 지원한다.
- 앱 로그인/설정에 정책 링크, 설정에 계정 삭제 요청 링크를 추가한다. 이 저장소에서는 앱 내부 링크는 구현하지 않았다.
- Google Play Console에 실제 정책/삭제 경로를 입력하고 데이터 보안 내용을 대조한다.

## 참고 자료

- [Google Play 계정 삭제 요구사항](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- [Google Play 사용자 데이터 정책](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- [Firebase 개인정보 및 보안](https://firebase.google.com/support/privacy): Auth 미국 처리, Auth 삭제 후 최대 180일, Crashlytics 90일 후 삭제 절차 시작. 프로젝트 전체의 백업 기간으로 일반화하지 않는다.
