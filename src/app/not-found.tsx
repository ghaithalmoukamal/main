"use client";

// Root-level not-found for non-localized requests (e.g. /unknown.txt).
// Must provide its own <html> since the root layout is a pass-through.
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            background: "#F5F0E8",
            color: "#1C2833",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: 700, color: "#8B4513", marginBottom: "0.5rem" }}>
            404
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#475663", marginBottom: "1.5rem" }}>
            الصفحة التي تبحث عنها غير موجودة.
            <br />
            The page you are looking for does not exist.
          </p>
          <a
            href="/"
            style={{
              padding: "0.625rem 1.5rem",
              background: "#8B4513",
              color: "#F5F0E8",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            العودة للرئيسية / Return Home
          </a>
        </div>
      </body>
    </html>
  );
}
