# MaryTour2 Handoff

## 필수 확인 문서

- PROJECT_CONTEXT.md
- CODING_CONVENTION.md
- DESIGN_GUIDE.md
- STYLE_ARCHITECTURE.md
- ASSET_MANIFEST.md
- CHANGELOG.md
- TASKS.md

## 확인된 작업

- 신규 프로젝트 초기 환경 구축.
- GitHub Actions 최초 배포 성공.
- 전역 SCSS 적용.
- 기본 화면 및 라우팅 정상 작동.

## 현재 작업

- 리소스 로딩 시스템.
- GSAP 페이지 전환.
- Low Data 모드 기반 구조.

## 검증 필요

- 신규 코드 프로덕션 빌드.
- 페이지 전환 테스트.
- 실제 이미지 로딩 및 오류 대응 테스트.

## 다음 작업

- 공통 UI 컴포넌트 확장.
- 이미지 리소스 및 디자인 시스템 확정.
- 스플래시 및 메인 화면 구현.

## 고정 원칙

- 스토리와 핵심 기능 분리.
- 역할별 공통 SCSS 우선.
- 기존 작업 임의 삭제 및 원복 금지.
- 수정 파일 전체 코드 제공.
- 작업 단계별 인수인계 문서 갱신.
- 검증하지 않은 기능을 완료 처리하지 않음.
- 비밀번호 및 서버 비밀키 문서 저장 금지.
## 2026-11-26 작업 갱신

- 로딩 화면 구현 및 렌더링 확인.
- 초기 다운로드 최적화 코드 적용 단계.
- 필수 이미지와 후속 이미지 그룹 분리.
- 공통 AssetImage 컴포넌트 추가.
- 다음 작업: 성능 재측정 및 스플래시 화면 구현.
- 신규 코드 빌드 및 브라우저 검증 필요.

## STEP 30 작업 갱신

- 로딩 최적화 1차 검증 완료.
- 스플래시 화면 구현 코드 작성.
- images(5).zip 리소스 기준 유지.
- 스토리 설정과 화면 기능 분리 유지.
- 다음 작업: 스플래시 렌더링 검증 및 배치 보정.
- 이후 메인 인형공방 화면 구현.

## STEP 31 작업 갱신

- 스플래시 화면 디테일 개선 코드 작성.
- 기존 이미지 리소스 유지.
- 공통 파티클 및 인터랙션 스타일 추가.
- 동화책 스토리 기능은 미확정.
- 신규 모션 및 모바일 레이아웃 검증 필요.
- 다음 작업: 메인 인형공방 화면 구현.

## STEP 32 작업 갱신

- 스플래시 디테일 개선 적용 완료.
- 메인 인형공방 화면 구현 코드 작성.
- 공통 단추 수집 컴포넌트 추가.
- 인증 장소 데이터: src/data/stamps.js.
- 현재 수집 상태는 빈 배열을 사용하는 초기 UI.
- 실제 인증 기록 및 특전 수령 권한은 추후 서버에서 검증.
- 다음 작업: 메인 화면 렌더링 및 배치 보정.
- 이후 QR 및 GPS 인증 기능 구현.

## STEP 33 작업 갱신

- 최신 원본 이미지 34종 기준.
- 메인 화면 전면 재설계 코드 작성.
- 이미지 기반 공통 버튼 컴포넌트 추가.
- 공방 배경 00~03 단계별 적용 구조.
- 수집 데이터는 아직 빈 배열 상태.
- 실제 모바일 배치와 슬롯 위치 검증 필요.
- 다음 작업: 메인 화면 검수 및 QR/GPS 인증.

## STEP 34 작업 갱신

- STEP 33 메인 화면 레이아웃 폐기.
- STEP 34 게임형 메인 화면 코드 작성.
- 기존 이미지 리소스 유지.
- 메인 화면 전용 높이 대응 스케일 도입.
- 수집 현황 상세 모달 추가.
- 대화창 문구는 기존 story.js 참조.
- 수집 데이터는 아직 빈 배열 상태.
- 다음 작업: 모바일 화면 검수 및 인증 기능 구현.

## STEP 35 작업 갱신

- STEP 34 기반 메인 화면 시각적 개선 코드 작성.
- 추가 이미지 제작 및 패키지 설치 없음.
- 기존 스플래시 및 로딩 화면 유지.
- 현재 인형공방 제목은 임시 문구.
- 실제 인증 데이터 연동 전 상태.
- 다음 작업: 모바일 UI 최종 검수.
- 이후 QR/GPS 인증 및 Supabase 연동.

## STEP 36 작업 갱신

- STEP 35 메인 화면 디자인 유지.
- SceneEffects 공통 컴포넌트 추가.
- ImageButton 인터랙션 개선.
- StampCollection 반사광 및 수집 효과 추가.
- Modal GSAP 등장 및 종료 모션 적용.
- 추가 이미지 다운로드 없음.
- 추가 패키지 설치 없음.
- 실제 수집 데이터는 아직 미연동 상태.
- 수집 단계별 배경 전환은 데이터 연동 후 구현.
- 다음 작업: QR 스캐너 및 위치 인증 화면.

## STEP 36-1 작업 갱신

- 단추 수집 현황 팝업 디자인 재설계 코드 작성.
- Modal의 기존 default variant 유지.
- collection variant 추가.
- 기존 이미지 리소스 재활용.
- HomePage.jsx 및 _home.scss 변경 없음.
- 추가 이미지 및 패키지 설치 없음.
- 실제 인증 데이터는 아직 미연동.
- 다음 작업: 팝업 검수 후 STEP 37 QR 스캐너.

## STEP 37 작업 갱신

- QR 스캐너 화면 및 카메라 기능 구현 코드 작성.
- QR 스캐너 라이브러리: html5-qrcode.
- QR URL 검증: src/utils/qr_validator.js.
- 카메라 관리: src/services/qr_scanner.js.
- QR 스캔 성공 시 /check/:token 이동.
- 운영 QR 주소 형식:
  https://dnsgk4983.github.io/MaryTour2/#/check/{token}
- 토큰은 영문, 숫자, 언더바, 하이픈 16~128자로 임시 제한.
- 실제 유효 토큰 목록은 아직 서버와 연동되지 않음.
- GPS 및 서버 인증은 미구현.
- 실제 특전 수령 권한 검증은 미구현.
- 다음 작업: STEP 38 GPS 위치 인증 화면.

## STEP 38 작업 갱신

- 현재 GPS 현장 테스트 모드 사용.
- 기존 QR 코드 카메라 기능 보존.
- 설정 파일: src/data/gps_test.js
- 위치 인증: src/services/gps_location.js
- 테스트 저장: src/services/gps_test_storage.js
- 테스트 화면: src/pages/GpsTestPage.jsx
- 기존 QR 화면: src/pages/QrCameraPage.jsx
- 테스트 기록 키: marytour2_gps_test_v1
- 운영 기록과 테스트 기록 분리.
- 산곡역은 부평구청역의 임시 테스트 대체 장소.
- 운영 전 gps_test_config.enabled를 false로 변경.
- GPS 단독 인증은 실제 운영에 사용하지 않음.
- 클라이언트 기록은 특전 수령 권한으로 사용 금지.
- 다음 작업: 실제 GPS 및 메인 진행률 검수.

## STEP 39 작업 갱신

- 획득 화면: src/components/common/ButtonDiscovery.jsx
- 미리보기: src/pages/DiscoveryPreviewPage.jsx
- 개발 전용 주소:
  /#/scanner?preview=discovery&slot=0
- slot=0: 산곡역
- slot=1: 대림역
- slot=2: 구로디지털단지역
- 미리보기는 Vite 개발 환경에서만 활성화.
- GPS 인증 성공 시 기존 테스트 기록 저장 후 획득 연출 시작.
- 기존 QR 카메라 및 GPS 인증 로직 유지.
- 실제 현장 GPS 검수 대기.
- 다음 작업: STEP 40 전체 단추 수집 완료 화면.

## STEP 40 작업 갱신

- 완주 화면: src/components/common/JourneyComplete.jsx
- 미리보기: src/pages/JourneyCompletePreviewPage.jsx
- 개발 주소: /#/scanner?preview=complete
- GPS 인증 없이 완주 화면 확인 가능.
- 미리보기에서 특전 수령 상태 변경 없음.
- 실제 테스트 수집 기록 3개 달성 시 완주 화면 표시.
- 다음 작업: STEP 41 특전 수령 화면.
- GPS 현장 검수는 별도로 진행.

## STEP 41 작업 갱신

- 특전 화면: src/pages/RewardPage.jsx
- 공통 컴포넌트: src/components/common/RewardReveal.jsx
- 특전 문구: src/data/reward_story.js
- 미리보기: /#/scanner?preview=reward
- STEP 40 완주 화면에서 특전 미리보기 접근 가능.
- 미리보기는 개발 환경에서만 활성화.
- GPS 테스트 기록은 실제 수령 권한이 아님.
- 특전 카드 공개는 수령 완료 처리가 아님.
- 서버 인증 및 운영진 수령 처리 미연동.
- 다음 작업: STEP 42 특전 수령 완료 화면.

## STEP 41-1 작업 갱신

- RewardReveal.jsx 카드 내부 구성 개선.
- reward_story.js 특전 카드 문구 관리.
- _reward_readability.scss 가독성 개선 스타일.
- 미리보기: /#/scanner?preview=reward
- 기존 특전 이미지 변경 없음.
- 실제 특전 수령 처리 미연동.
- 다음 작업: STEP 42 특전 수령 완료 화면.

## STEP 42 작업 갱신

- 엔딩 컴포넌트: src/components/common/JourneyEnding.jsx
- 엔딩 문구: src/data/ending_story.js
- 엔딩 미리보기: src/pages/EndingPreviewPage.jsx
- 개발 주소: /#/scanner?preview=ending
- 실제 특전 수령 완료 화면은 서버 인증 이후 연결.
- 개발 미리보기에서 수집 및 수령 기록 변경 없음.
- STEP 41-4 특전 화면 유지.
- 다음 작업: STEP 43 예외 상태 안내 화면.
- 실제 모바일 렌더링 및 모션 검수 필요.

## STEP 44 작업 갱신

### 관리자 구조

- 설정: src/data/admin_config.js
- 인증 서비스: src/services/admin_auth.js
- 로그인: src/components/common/AdminLogin.jsx
- 입력 필드: src/components/common/AdminField.jsx
- 아이콘: src/components/common/AdminIcon.jsx
- 관리자 페이지: src/pages/AdminPage.jsx
- 관리자 미리보기: src/pages/AdminLoginPreviewPage.jsx

### 미리보기

- /#/scanner?preview=admin_login
- 테스트 이메일: admin@example.com
- 테스트 비밀번호: preview1234
- 테스트 성공은 실제 인증 성공이 아님.
- 관리자 세션 생성 및 저장 없음.

### 추후 인증 연동

- sign_in_admin을 Supabase Auth와 연결.
- get_admin_session을 실제 세션 조회로 변경.
- sign_out_admin을 실제 로그아웃으로 변경.
- 서버에서 관리자 권한 검증.
- RLS 및 서버 측 특전 지급 권한 적용.
- 클라이언트에 service_role 키 저장 금지.
- 실제 관리자 라우팅 및 접근 권한 검수 필요.

### 스타일

- 참여자용 vw 기반 디자인과 관리자 UI 분리.
- 관리자 화면은 실무형 반응형 px 기반 사용.
- 키보드 표시 및 작은 화면 대응을 위해 스크롤 허용.

### 다음 작업

- STEP 45 관리자 특전 수령 처리 UI.
- STEP 46 관리자 운영 대시보드.
- 실제 브라우저 렌더링 검수 필요.

## STEP 44-1 - 관리자 디자인 및 인증 입력 변경

- 기존 MaryTour2 디자인 테마 계승.
- 인형공방 배경 및 리본 이미지 재사용.
- 크림 아이보리 및 샴페인 골드 관리자 테마 적용.
- 이메일 입력을 아이디 입력으로 변경.
- 개발용 테스트 계정 admin / test 적용.
- 잘못된 테스트 계정 로그인 차단.
- 로그인 결과 표시 영역 확보.
- 실제 관리자 세션 및 권한 생성 없음.
- 운영 환경 인증 미연동 상태에서 로그인 차단.
- 기존 참여자 화면 및 라우팅 유지.
- Supabase 연동 시 아이디와 실제 인증 계정의 매핑 필요.

## STEP 45 - 관리자 특전 지급 관리

### 구현 사항

- STEP 44-1 관리자 디자인 계승.
- admin/test 개발용 로그인 이후 지급 관리 화면 연결.
- 관리자 재고 현황 컴포넌트 추가.
- 참여자 식별번호 조회.
- 역별 단추 수집 현황 표시.
- 미완주 및 중복 수령 지급 차단.
- 재고 소진 시 지급 차단.
- 지급 확인 공통 Dialog 추가.
- 지급 완료 및 다음 참여자 조회 기능.
- 테스트 지급 시 재고 1개 차감.
- 테스트 수령 기록 중복 지급 방지.
- 테스트 재고 소진 및 초기화 기능.
- 로그아웃 확인 Dialog 추가.
- 모바일 및 데스크톱 반응형 레이아웃.
- 빌드 실패 시 기존 파일 자동 복구.

### 테스트 정보

- 로그인: admin / test
- MARY-0001: 완주 및 미수령.
- MARY-0002: 수집 미완료.
- MARY-0003: 수령 완료.
- MARY-0004: 미참여.
- 전체 재고 300개.
- 기존 지급 128개.
- 초기 남은 재고 172개.
- 모든 수량과 참여자 정보는 임시 테스트 데이터.

### 개발 경로

- /#/scanner?preview=admin_login

### 데이터 처리

- src/data/admin_reward.js
- src/services/admin_reward.js
- React reducer 기반 테스트 상태 관리.
- 새로고침 및 로그아웃 시 테스트 기록 초기화.
- 실제 참여자 데이터 및 DB 변경 없음.
- 운영 환경에서 테스트 지급 기능 차단.

### 추후 연동

- 참여자 식별번호 발급 및 조회 API.
- Supabase Auth 관리자 권한 검증.
- 서버 측 완주 여부 검증.
- 원자적 특전 지급 및 재고 차감 처리.
- DB 고유 제약을 통한 중복 지급 방지.
- 운영진별 지급 기록 및 감사 로그.
- 실제 행사 역 이름으로 설정 변경.

### 다음 작업

- STEP 46 관리자 운영 대시보드.
- 실제 브라우저 및 모바일 화면 검수.

## STEP 46 - 관리자 운영 대시보드

### 구현 사항

- STEP 44-1 빈티지 인형공방 관리자 디자인 유지.
- 로그인 이후 운영 대시보드 기본 진입.
- 운영 대시보드 및 특전 지급 관리 메뉴 연결.
- STEP 45 reducer 상태를 공통 데이터로 사용.
- 메뉴 전환 시 테스트 지급 기록 유지.
- 전체 등록 참여자 및 완주 참여자 집계.
- 역별 인증 인원 및 인증률 집계.
- 완주율 및 완주자 특전 수령률 표시.
- 특전 재고 및 재고 소진율 표시.
- 특전 수령 대기 인원 집계.
- 최근 지급 기록 최신순 정렬.
- 테스트 이상 인증 기록 및 유형별 필터.
- 모바일 및 데스크톱 반응형 디자인.
- 공통 컴포넌트 및 역할별 SCSS 분리.
- 빌드 실패 시 변경 파일 자동 복구.

### 데이터 공유

- AdminRewardPreviewPage의 기존 inventory 상태 사용.
- 별도의 관리자 데이터 복제 및 저장 없음.
- 특전 지급 후 대시보드 통계 즉시 반영.
- 테스트 초기화 후 대시보드 통계 초기화.
- 새로고침 및 로그아웃 시 테스트 상태 초기화.

### 통계 기준

- 전체 참여자: 테스트 등록 레코드 수.
- 완주율: 완주 참여자 / 전체 등록 참여자.
- 특전 수령률: 수령한 완주자 / 전체 완주자.
- 재고 소진율: 지급 수량 / 전체 재고.
- 기존 가상 지급 수량은 재고 통계에만 포함.
- 이상 인증 기록은 고정 테스트 예시.
- 실제 이상 인증 탐지 및 차단 기능은 미연동.

### 신규 주요 파일

- src/data/admin_dashboard.js
- src/services/admin_dashboard.js
- src/components/common/AdminDashboard.jsx
- src/components/common/AdminNavigation.jsx
- src/components/common/AdminMetric.jsx
- src/components/common/AdminRate.jsx
- src/components/common/AdminStationStats.jsx
- src/components/common/AdminRewardRecords.jsx
- src/components/common/AdminAnomalyRecords.jsx

### 개발 경로

- /#/scanner?preview=admin_login
- ID: admin
- PW: test

### 다음 작업

- STEP 47 전체 디자인 및 문구 통합 검수.
- STEP 48 모바일 성능 최적화.
- STEP 49 Supabase DB 연동.
- 실제 운영 통계 및 감사 로그 서버 연동 필요.
- 실제 브라우저 렌더링 검수 필요.

## STEP 47-3 - 배포용 시연 모드

- /demo/:page? 독립 라우팅 추가.
- 참여자, 예외 상황, 관리자 시연 목록 제공.
- 기존 단추 발견, 완주, 특전, 엔딩 컴포넌트 재사용.
- 관리자 대시보드 컴포넌트 재사용.
- QR 및 GPS 가상 인증.
- 시연 전용 React 상태 사용.
- 실제 관리자 인증 서비스 호출 없음.
- 실제 지급 서비스 호출 없음.
- 실제 GPS 수집 저장 서비스 호출 없음.
- 기존 DEV 제한 유지.
- 시연 데이터 초기화 지원.
- 기존 운영 라우팅 유지.
- 스플래시, 홈, QR, GPS, 예외, 로그인 및 지급 화면은 시연용 재구성.
- 기존 화면과 완전히 동일한 렌더링은 추가 검수 필요.
- 공개 시연용 로그인은 실제 보안 인증이 아님.

공유 경로:
https://dnsgk4983.github.io/MaryTour2/#/demo
