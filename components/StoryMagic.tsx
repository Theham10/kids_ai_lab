"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StoryMagic({ onBack }: { onBack: () => void }) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [story, setStory] = useState<string | null>(null);

    const generateStory = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setStory(null);

        // Prompt formatting to ensure Korean
        const combinedPrompt = `${prompt}에 대한 마법 같은 동화를 한국어로 지어줘.`;

        setTimeout(() => {
            const stories = [
                `[제 1장: 비밀의 숲과 발견]\n옛날 옛적에, ${prompt}가 살고 있는 신비한 마을이 있었어요. 마을 사람들은 모두 행복했지만, 단 하나, 마을 뒤편 '안개 낀 숲'만은 아무도 가본 적이 없었죠. 호기심 많은 ${prompt}는 어느 날 숲 쪽에서 들려오는 아름다운 피리 소리를 따라가기로 했어요. 숲속 깊은 곳으로 들어가자, 나무들이 춤을 추고 꽃들이 ${prompt}의 이름을 부르며 인사를 했답니다.\n\n[제 2장: 마법사의 초대]\n숲의 한복판에는 거대한 캔디로 만든 집이 있었어요. 그곳엔 친절한 마법사 할아버지가 살고 계셨죠. 마법사 할아버지는 ${prompt}에게 말했어요. "안녕! 이 숲의 마법이 사라지지 않게 도와줄 용감한 어린이를 기다리고 있었단다." 할아버지는 반짝이는 별가루 지팡이를 건네주었어요. ${prompt}가 지팡이를 휘두르자 숲의 안개가 걷히고 황금빛 열매들이 맺히기 시작했죠.\n\n[제 3장: 무지개 건너 집으로]\n${prompt}와 마법사 할아버지는 숲속 친구들과 함께 맛있는 쿠키 파티를 열었어요. 숲의 요정들은 ${prompt}의 용기에 감사하며 하늘을 나는 무지개 열차를 소환해주었죠. ${prompt}는 무지개를 타고 마을로 돌아왔고, 이제 마을 아이들에게 숲속의 신비한 모험 이야기를 매일 들려주게 되었답니다. 이 이야기는 숲과 마을이 친구가 된 아주 특별한 날의 기록이에요.`,

                `[서막: 꼬마 영웅의 탄생]\n${prompt}는 평범한 아이처럼 보였지만, 사실 동물의 말을 알아듣는 특별한 능력이 있었어요. 어느 날 아침, 작은 파랑새가 찾아와 다급하게 외쳤어요. "구름 너머 캔디 행성에 큰일이 났어! 거대한 로봇이 사탕 공장을 장난감으로 만들고 있어!" ${prompt}는 망설이지 않고 자신의 우주선 배낭을 메고 하늘로 솟아올랐어요.\n\n[중편: 구름 너머의 사투]\n구름을 뚫고 도착한 캔디 행성은 온통 크레파스 색깔로 변해있었죠. 거대 로봇 '쿵쾅이'는 공장을 자기 방으로 만들려고 고집을 부리고 있었어요. ${prompt}는 로봇에게 다가가 화를 내는 대신, 주머니에 있던 최고급 마법 젤리를 하나 건네주었죠. 그 젤리는 로봇에게 친구를 사귀는 법을 가르쳐주는 '우정의 젤리'였답니다. 로봇은 갑자기 환하게 웃으며 공장을 다시 예쁘게 되돌려놓았어요.\n\n[결말: 은하수의 평화]\n${prompt}와 쿵쾅이 로봇은 이제 단짝 친구가 되었어요. 둘은 은하수 강가에 앉아 별사탕을 먹으며 다음 모험을 계획했죠. 파랑새는 다시 행복한 노래를 부르기 시작했고, ${prompt}는 지구가 보이고 달이 웃고 있는 아름다운 우주 풍경 속에서 진정한 영웅이 무엇인지 깨닫게 되었어요. 용기는 힘이 아니라 배려라는 것을요.`,

                `[제 1부: 유니콘의 슬픔]\n별빛이 쏟아지던 밤, ${prompt}(이)는 꿈속에서 보던 전설의 은빛 유니콘을 만나게 되었어요. 하지만 유니콘의 눈에는 눈물이 고여 있었죠. "나의 은색 뿔이 빛을 잃어가고 있어. 누군가 기억의 샘에 먹물을 뿌렸거든." ${prompt}는 유니콘의 슬픈 목소리를 듣고 결심했어요. "걱정 마, 내가 먹물을 닦아내고 샘물을 맑게 해줄게!"\n\n[제 2부: 기억의 샘을 향하여]\n둘은 거대한 초콜릿 강을 건너고 마시멜로 산을 넘어야 했어요. 가는 길마다 말하는 꽃들이 수수께끼를 냈지만, 지혜로운 ${prompt}는 막힘없이 정답을 맞혔죠. 드디어 도착한 기억의 샘 앞에는 욕심쟁이 검은 고양이가 지키고 있었어요. ${prompt}는 고양이에게 따뜻한 우유를 나눠주며 마음을 달래주었고, 고양이는 부끄러워하며 구석으로 물러났답니다.\n\n[제 3부: 빛나는 은빛 뿔]\n${prompt}가 샘물의 먹물을 걷어내자, 물속에서 찬란한 별빛이 뿜어져 나왔어요. 그 빛을 받은 유니콘의 뿔은 다시 눈부신 은색으로 빛났고, 유니콘은 기쁨의 춤을 추었죠. 유니콘은 ${prompt}를 등에 태우고 밤하늘을 가르며 환상적인 여행을 선물해주었어요. 잠에서 깬 ${prompt}의 머리맡에는 작은 은색 깃털 하나가 놓여 있었답니다.`
            ];
            setStory(stories[Math.floor(Math.random() * stories.length)]);
            setIsGenerating(false);
        }, 4500);
    };

    return (
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={onBack} className="button" style={{ background: "none", boxShadow: "none", color: "#666", padding: 0, marginBottom: "1rem" }}>
                ← 돌아가기
            </button>

            <h2 style={{ color: "var(--primary)", fontSize: "2.2rem" }}>마법 동화책 ✨</h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>어떤 신비로운 이야기를 만들어볼까?</p>

            <div style={{ margin: "2.5rem 0" }}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 우주로 간 고양이"
                    style={{
                        width: "100%",
                        padding: "1.2rem",
                        borderRadius: "16px",
                        border: "3px solid #f1f2f6",
                        fontSize: "1.2rem",
                        marginBottom: "1.5rem",
                        outline: "none",
                        background: "#fff"
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && generateStory()}
                />
                <button
                    className="button button-primary"
                    onClick={generateStory}
                    disabled={isGenerating}
                    style={{ width: "100%", justifyContent: "center", padding: "1.2rem", fontSize: "1.3rem" }}
                >
                    {isGenerating ? "마법 지팡이 휘두르는 중... 🪄" : "내 동화책 만들기!"}
                </button>
            </div>

            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: "center", padding: "2rem" }}
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ fontSize: "4rem" }}
                        >
                            📖✨
                        </motion.div>
                        <p style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.2rem" }}>AI가 열심히 이야기를 상상하고 있어요...</p>
                    </motion.div>
                )}

                {story && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: "#fff",
                            padding: "2.5rem",
                            borderRadius: "24px",
                            border: "3px dashed var(--primary)",
                            lineHeight: "2.2",
                            fontSize: "1.3rem",
                            position: "relative",
                            boxShadow: "0 15px 40px rgba(255, 140, 66, 0.15)",
                            color: "#2d3436"
                        }}
                    >
                        <div style={{ position: "absolute", top: -15, left: 20, background: "var(--primary)", color: "white", padding: "4px 15px", borderRadius: "99px", fontSize: "0.9rem", fontWeight: "bold" }}>
                            제 1장: 시작되는 모험
                        </div>
                        {story}
                        <div style={{ textAlign: "right", marginTop: "2rem" }}>
                            <button className="button button-primary" style={{ padding: "0.8rem 1.5rem" }}>다음 페이지 →</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
