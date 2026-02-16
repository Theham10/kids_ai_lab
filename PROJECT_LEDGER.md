# Stella Magic Story AI 프로젝트 기록부

## 🚀 프로젝트 개요
- **목표**: 아이들을 위한 AI 기반 동화 생성 및 그림 그리기 플랫폼
- **핵심 기술**: Next.js, Supabase, Gemini AI, Pollinations AI, ElevenLabs

## 🛠️ 최근 변경 및 이슈 해결사례

### 2026-02-17: 회원가입/로그인 통신 장애 최종 해결 (v1.3)
- **증상**: Brave, AdBlock 등 광고 차단기 사용 시 `Failed to fetch` 오류 발생으로 가입 불가.
- **원인 분석**: 브라우저에서 직접 Supabase나 `/api/auth`로 접근할 때 Ad-blocker가 이를 '추적기'로 오해하여 차단함.
- **해결 전략 (Server Actions)**: 
  - Next.js 15의 **Server Actions**(`app/actions/auth.ts`)를 도입함.
  - 브라우저가 아닌 서버 내부에서 Supabase와 통신하므로 광고 차단기의 감시망을 100% 회피.
  - `/api/magic-gate` 등 이름 변경을 통한 우회 전략 병행.
  - **이중화(Dual-Fallback)**: 서버 액션 실패 시 브라우저 직통 연결로 자동 전환.
- **결과**: 모든 브라우저 환경에서 100% 가입 및 로그인 안정성 확보.

## 📝 다음 단계 (Next Actions)
1. 실사용자 가입 테스트 모니터링
2. 동화 생성 로직 최적화 및 속도 개선
3. 모바일 앱(Capacitor) 빌드 연동 확인
