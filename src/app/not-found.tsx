"use client";

import Error from "next/error";

// Handles non-localized requests that don't match the middleware
// (e.g. /unknown.txt). Provides its own <html> since the root
// layout is a pass-through.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
