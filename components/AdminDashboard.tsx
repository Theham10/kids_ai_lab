"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUsers: 0, totalCredits: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setUsers(data);
                const credits = data.reduce((acc, curr) => acc + (curr.credits || 0), 0);
                setStats({
                    totalUsers: data.length,
                    totalCredits: credits
                });
            }
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <button onClick={onBack} className="button" style={{ background: "none", boxShadow: "none", color: "#666", padding: 0 }}>
                    ← 연구소로 돌아가기
                </button>
                <h2 style={{ color: "var(--primary)", margin: 0 }}>중앙 사령부 대시보드 🚀</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ background: "rgba(108, 92, 231, 0.1)", padding: "1.5rem", borderRadius: "24px", textAlign: "center", border: "2px solid var(--secondary)" }}>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>총 가입 히어로</div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--secondary)" }}>{stats.totalUsers} 명</div>
                </div>
                <div style={{ background: "rgba(255, 140, 66, 0.1)", padding: "1.5rem", borderRadius: "24px", textAlign: "center", border: "2px solid #FF8C42" }}>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>남은 총 마법 에너지</div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#FF8C42" }}>{stats.totalCredits} ✨</div>
                </div>
            </div>

            <div style={{ background: "white", borderRadius: "24px", border: "2px solid #f1f2f6", overflow: "hidden" }}>
                <div style={{ padding: "1.5rem", borderBottom: "2px solid #f1f2f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>히어로 명단 📋</h3>
                    <button onClick={fetchData} className="button" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>새로고침 🔄</button>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f9f9ff" }}>
                                <th style={{ padding: "1rem" }}>이름</th>
                                <th style={{ padding: "1rem" }}>이메일</th>
                                <th style={{ padding: "1rem" }}>나이/성별</th>
                                <th style={{ padding: "1rem" }}>등급</th>
                                <th style={{ padding: "1rem" }}>에너지</th>
                                <th style={{ padding: "1rem" }}>가입일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center" }}>데이터를 불러오는 중... 🪄</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center" }}>아직 가입한 히어로가 없어요. 🏜️</td></tr>
                            ) : users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: "1px solid #f1f2f6" }}>
                                    <td style={{ padding: "1rem", fontWeight: "bold" }}>{u.name}</td>
                                    <td style={{ padding: "1rem", color: "#666", fontSize: "0.9rem" }}>{u.email || "-"}</td>
                                    <td style={{ padding: "1rem" }}>{u.age}세 / {u.gender === "boy" ? "남" : "여"}</td>
                                    <td style={{ padding: "1rem" }}>
                                        <span style={{
                                            padding: "4px 10px", borderRadius: "99px", fontSize: "0.8rem",
                                            background: u.tier === "Pro" ? "var(--secondary)" : "#eee",
                                            color: u.tier === "Pro" ? "white" : "#666"
                                        }}>
                                            {u.tier}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1rem", fontWeight: "bold" }}>{u.credits} ✨</td>
                                    <td style={{ padding: "1rem", color: "#999", fontSize: "0.8rem" }}>
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
