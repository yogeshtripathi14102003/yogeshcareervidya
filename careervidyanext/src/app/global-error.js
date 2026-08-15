"use client";

export default function GlobalError({ reset }) {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</h1>
            <p style={{ color: "#64748b", marginTop: 8 }}>Please refresh the page.</p>
            <button
              onClick={reset}
              style={{ marginTop: 16, background: "#4f46e5", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
