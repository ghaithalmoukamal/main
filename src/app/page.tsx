import { redirect } from "next/navigation";

// The middleware handles locale redirection (/ → /ar), but Next.js
// still needs a root page component to exist so it doesn't immediately
// render the not-found page. This is a fallback safety net.
export default function RootPage() {
  redirect("/ar");
}
