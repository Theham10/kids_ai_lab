import { Metadata } from "next";

export const metadata: Metadata = {
    title: "개인정보 처리방침 - KidGenius AI",
    description: "KidGenius AI의 개인정보 처리방침",
};

export default function PrivacyPolicy() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #FFF9F0 0%, #FFF3E6 100%)",
            padding: "3rem 1.5rem"
        }}>
            <div style={{
                maxWidth: "800px",
                margin: "0 auto",
                background: "white",
                borderRadius: "32px",
                padding: "3rem",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{ fontSize: "2.5rem", color: "#6C5CE7", marginBottom: "1rem" }}>
                    🛡️ 개인정보 처리방침
                </h1>
                <p style={{ color: "#666", marginBottom: "3rem", fontSize: "1.1rem" }}>
                    KidGenius AI (스텔라의 마법 연구소)는 어린이의 안전과 프라이버시를 최우선으로 합니다.
                </p>

                <section style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem", borderBottom: "3px solid #A29BFE", paddingBottom: "0.5rem" }}>
                        1. 수집하는 정보
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#636e72" }}>
                        <h3 style={{ fontSize: "1.3rem", color: "#6C5CE7", marginTop: "1.5rem" }}>📝 필수 수집 정보</h3>
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                            <li><strong>이름</strong>: 서비스 개인화 및 식별용</li>
                            <li><strong>이메일 (부모님)</strong>: 보호자 연락 및 계정 관리용</li>
                            <li><strong>나이</strong>: 연령별 콘텐츠 필터링 및 안전 설정용</li>
                        </ul>

                        <h3 style={{ fontSize: "1.3rem", color: "#6C5CE7", marginTop: "1.5rem" }}>🎨 선택 수집 정보</h3>
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                            <li><strong>성별</strong>: 캐릭터 추천용 (선택사항)</li>
                            <li><strong>단짝 친구 이름</strong>: 서비스 개인화용</li>
                        </ul>

                        <h3 style={{ fontSize: "1.3rem", color: "#6C5CE7", marginTop: "1.5rem" }}>🤖 자동 수집 정보</h3>
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                            <li><strong>생성한 콘텐츠</strong>: 갤러리 저장용 (브라우저 내 로컬 저장만)</li>
                            <li><strong>사용 기록</strong>: 크레딧 관리용 (서버 저장 없음)</li>
                        </ul>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem", background: "#f9f9ff", padding: "2rem", borderRadius: "20px", border: "2px solid #A29BFE" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem" }}>
                        2. AI 사용 및 데이터 처리
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#636e72" }}>
                        <p style={{ marginBottom: "1rem" }}>
                            <strong style={{ color: "#6C5CE7" }}>✨ AI는 도구입니다</strong><br />
                            Google Gemini AI를 사용하여 스토리와 이미지 프롬프트를 생성합니다.
                        </p>
                        <p style={{ marginBottom: "1rem" }}>
                            <strong style={{ color: "#6C5CE7" }}>🛡️ 안전 보장</strong><br />
                            AI는 <strong>어린이의 개인정보를 학습하거나 저장하지 않습니다</strong>.
                            모든 생성 결과는 일회성이며, AI 학습에 사용되지 않습니다.
                        </p>
                        <p style={{ marginBottom: "0" }}>
                            <strong style={{ color: "#6C5CE7" }}>🚫 콘텐츠 필터링</strong><br />
                            폭력, 성인 콘텐츠, 혐오 표현 등 부적절한 내용은 자동으로 차단됩니다.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem", borderBottom: "3px solid #A29BFE", paddingBottom: "0.5rem" }}>
                        3. 정보 사용 목적
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#636e72" }}>
                        <ul style={{ paddingLeft: "1.5rem" }}>
                            <li>서비스 제공 및 개인화 (이름, 캐릭터 표시 등)</li>
                            <li>연령별 안전 콘텐츠 필터링</li>
                            <li>부모님께 서비스 관련 안내 (이메일)</li>
                            <li>크레딧 및 사용량 관리</li>
                            <li>서비스 개선 (익명 통계만 사용)</li>
                        </ul>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem", background: "#fff4e5", padding: "2rem", borderRadius: "20px", border: "2px solid #FFAD33" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem" }}>
                        4. 정보 보관 및 삭제
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#663C00" }}>
                        <p style={{ marginBottom: "1rem" }}>
                            <strong>📦 보관 기간</strong>: 회원 탈퇴 시까지
                        </p>
                        <p style={{ marginBottom: "1rem" }}>
                            <strong>🗑️ 삭제 방법</strong>: 부모님이 설정 메뉴에서 "모든 데이터 삭제" 선택
                        </p>
                        <p style={{ marginBottom: "0" }}>
                            <strong>✅ 삭제 범위</strong>: 이름, 이메일, 나이, 성별, 생성 기록 (모든 정보 즉시 삭제)
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem", borderBottom: "3px solid #A29BFE", paddingBottom: "0.5rem" }}>
                        5. 제3자 제공
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#636e72" }}>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#6C5CE7" }}>
                            ❌ 절대 제공하지 않습니다
                        </p>
                        <p>
                            KidGenius AI는 어린이의 정보를 다른 회사나 제3자에게 <strong>절대 판매하거나 공유하지 않습니다</strong>.
                        </p>
                        <p style={{ marginTop: "1rem" }}>
                            <strong>단, 다음의 경우 예외:</strong>
                        </p>
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                            <li>부모님의 명시적 동의가 있는 경우</li>
                            <li>법적 의무 이행 (법원 명령 등)</li>
                        </ul>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem", background: "#e8f5e9", padding: "2rem", borderRadius: "20px", border: "2px solid #6BCB77" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem" }}>
                        6. 부모님의 권리
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#2d5016" }}>
                        <p>부모님은 언제든지 다음 권리를 행사하실 수 있습니다:</p>
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                            <li>✅ 자녀 정보 열람 및 확인</li>
                            <li>✅ 정보 수정 및 삭제 요청</li>
                            <li>✅ 서비스 이용 정지</li>
                            <li>✅ 개인정보 처리 정지 요청</li>
                        </ul>
                        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
                            📧 문의: support@kidgenius.ai (예시)
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem", borderBottom: "3px solid #A29BFE", paddingBottom: "0.5rem" }}>
                        7. 쿠키 및 로컬 스토리지
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#636e72" }}>
                        <p>
                            KidGenius AI는 서비스 제공을 위해 브라우저의 <strong>로컬 스토리지</strong>를 사용합니다.
                        </p>
                        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                            <li>사용자 정보 (이름, 캐릭터 설정)</li>
                            <li>생성한 이미지 갤러리</li>
                            <li>크레딧 잔액</li>
                        </ul>
                        <p style={{ marginTop: "1rem" }}>
                            ⚠️ 브라우저 데이터를 삭제하면 저장된 정보가 모두 사라집니다.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "1rem", borderBottom: "3px solid #A29BFE", paddingBottom: "0.5rem" }}>
                        8. 정책 변경
                    </h2>
                    <div style={{ lineHeight: "1.8", color: "#636e72" }}>
                        <p>
                            개인정보 처리방침이 변경될 경우, 앱 내 공지 및 부모님 이메일로 사전 안내드립니다.
                        </p>
                        <p style={{ marginTop: "1rem" }}>
                            <strong>최종 수정일</strong>: 2026년 2월 1일
                        </p>
                    </div>
                </section>

                <div style={{
                    background: "linear-gradient(45deg, #6C5CE7, #A29BFE)",
                    color: "white",
                    padding: "2rem",
                    borderRadius: "20px",
                    textAlign: "center",
                    marginTop: "3rem"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛡️✨</div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>우리의 약속</h3>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                        KidGenius AI는 어린이의 안전과 프라이버시를 최우선으로 합니다.<br />
                        궁금하신 점이 있으시면 언제든지 문의해 주세요.
                    </p>
                </div>

                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <a
                        href="/"
                        style={{
                            display: "inline-block",
                            padding: "1rem 2rem",
                            background: "white",
                            border: "2px solid #6C5CE7",
                            color: "#6C5CE7",
                            borderRadius: "16px",
                            textDecoration: "none",
                            fontSize: "1.1rem",
                            fontWeight: "bold"
                        }}
                    >
                        ← 연구소로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    );
}
