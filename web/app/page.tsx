"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 64,
          borderBottom: "1px solid var(--line)",
          background: "rgba(11,12,15,0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/consultflow.png"
            alt="ConsultFlow"
            style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8 }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "var(--fg)",
              letterSpacing: "-0.02em",
            }}
          >
            ConsultFlow
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/app"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0b0c0f",
              textDecoration: "none",
              padding: "8px 18px",
              borderRadius: 6,
              background: "var(--fg)",
              letterSpacing: "0.01em",
            }}
          >
            Open app
          </Link>
        </div>
      </nav>

      <section
        style={{
          paddingTop: 160,
          paddingBottom: 120,
          paddingLeft: 48,
          paddingRight: 48,
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 340,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(124,122,255,0.22) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 99,
              border: "1px solid var(--line-2)",
              background: "var(--bg-2)",
              fontSize: 11,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--fg-dim)",
              marginBottom: 32,
              letterSpacing: "0.06em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--ok)",
                boxShadow: "0 0 10px var(--ok)",
                flexShrink: 0,
              }}
            />
            Built for consulting teams
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 36,
            }}
          >
            <img
              src="/consultflow.png"
              alt="ConsultFlow"
              style={{ width: 80, height: 80, objectFit: "contain" }}
            />
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 72px)",
              fontWeight: 800,
              color: "var(--fg)",
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              margin: "0 0 24px",
              textAlign: "center",
            }}
          >
            Turn any conversation into action
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "var(--fg-dim)",
              lineHeight: 1.65,
              margin: "0 0 44px",
              maxWidth: 540,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            Paste a transcript, email, or notes. ConsultFlow extracts action
            items, flags blockers and risks, and generates a client digest you
            can send directly.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <Link
              href="/app"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 8,
                background: "var(--fg)",
                color: "#0b0c0f",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Start now
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background: "var(--line)",
          margin: "0 48px",
        }}
      />

      <section
        style={{
          padding: "80px 48px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--line)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {[
            {
              label: "Extract commitments",
              desc: "You paste the transcript. We pull out every action item, owner, and due date.",
              accent: "var(--accent)",
            },
            {
              label: "Surface blockers",
              desc: "Risks, waiting-on-client items, and blockers get classified and grouped automatically.",
              accent: "var(--warn)",
            },
            {
              label: "Client digest",
              desc: "A structured summary: what's next from the client, what's next from us, what needs attention.",
              accent: "var(--ok)",
            },
          ].map((feature, i) => (
            <div
              key={feature.label}
              style={{
                background: "var(--bg-1)",
                padding: "36px 32px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: feature.accent,
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  color: feature.accent,
                  fontWeight: 700,
                  marginBottom: 16,
                  letterSpacing: "0.08em",
                  opacity: 0.8,
                }}
              >
                0{i + 1}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--fg)",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--fg-dim)",
                  lineHeight: 1.65,
                }}
              >
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "40px 48px 100px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 14,
              }}
            >
              How it works
            </div>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "var(--fg)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                margin: "0 0 18px",
              }}
            >
              Transcript in. Digest out.
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--fg-dim)",
                lineHeight: 1.75,
                margin: "0 0 40px",
              }}
            >
              Drop a transcript, email chain, or whiteboard notes. We pull out
              commitments, classify blockers and risks, and generate a digest
              your client can act on.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { step: "01", title: "Paste your source" },
                { step: "02", title: "Review the board" },
                { step: "03", title: "Send the digest" },
              ].map((item, i, arr) => (
                <div key={item.step} style={{ display: "flex", gap: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 10,
                        color: "var(--accent)",
                        fontWeight: 700,
                        width: 28,
                        textAlign: "right",
                      }}
                    >
                      {item.step}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          width: 1,
                          flex: 1,
                          background: "var(--line)",
                          margin: "6px 0",
                          minHeight: 32,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--fg)",
                        marginTop: 4,
                      }}
                    >
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-1)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow:
                "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,122,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                background: "var(--bg-2)",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {["var(--danger)", "var(--warn)", "var(--ok)"].map((color) => (
                  <div
                    key={color}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: color,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 5,
                  background: "var(--bg-3)",
                  border: "1px solid var(--line)",
                }}
              />
            </div>

            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[
                  { label: "Transcript", count: 3, active: true },
                  { label: "Email", count: 4, active: false },
                  { label: "Notes", count: 2, active: false },
                ].map((tab) => (
                  <div
                    key={tab.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: 5,
                      fontSize: 11,
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      background: tab.active ? "var(--bg-3)" : "transparent",
                      color: tab.active ? "var(--fg)" : "var(--fg-faint)",
                      border: tab.active
                        ? "1px solid var(--line-2)"
                        : "1px solid transparent",
                    }}
                  >
                    {tab.label}
                    <span style={{ color: "var(--fg-faint)", fontSize: 10 }}>
                      {tab.count}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { kind: "task", label: "ACM-001", width: "75%" },
                  { kind: "blocker", label: "ACM-002", width: "60%" },
                  { kind: "risk", label: "ACM-003", width: "82%" },
                  { kind: "waiting", label: "ACM-004", width: "50%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 8,
                      background: "var(--bg-2)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background:
                          item.kind === "task"
                            ? "var(--accent)"
                            : item.kind === "blocker"
                              ? "var(--danger)"
                              : item.kind === "risk"
                                ? "var(--warn)"
                                : "var(--info)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        color: "var(--fg-faint)",
                        flexShrink: 0,
                      }}
                    >
                      {item.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 7,
                        borderRadius: 4,
                        background: "var(--bg-3)",
                        width: item.width,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--bg-2)",
                  border: "1px solid var(--line)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--accent)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                  }}
                >
                  EXECUTIVE SUMMARY
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[85, 65, 90].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: "var(--bg-3)",
                        width: `${w}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "80px 48px",
          borderTop: "1px solid var(--line)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "var(--fg)",
              letterSpacing: "-0.03em",
              margin: "0 0 14px",
            }}
          >
            Ready to try it?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--fg-dim)",
              margin: "0 0 32px",
              lineHeight: 1.65,
            }}
          >
            Open the app and paste your next source document.
          </p>
          <Link
            href="/app"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 8,
              background: "var(--fg)",
              color: "#0b0c0f",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Launch app
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/consultflow.png"
            alt="ConsultFlow"
            style={{
              width: 22,
              height: 22,
              objectFit: "contain",
              borderRadius: 5,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--fg-faint)",
            }}
          >
            ConsultFlow
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: "var(--fg-faint)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          consultflow.ai
        </span>
      </footer>
    </div>
  );
}