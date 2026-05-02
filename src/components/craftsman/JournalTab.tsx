"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMode } from "@/components/layout/ModeProvider";
import type { WorkJournalPost } from "@/lib/types";

export default function JournalTab({ posts }: { posts: WorkJournalPost[] }) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("profile");
  const { mode } = useMode();

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
        {t("noJournal")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-clay-100 rounded-xl overflow-hidden"
        >
          {/* Photos — only auto-loaded in normal mode */}
          {post.photos.length > 0 && mode === "normal" && (
            <div className="flex gap-1 overflow-x-auto p-2 bg-cream-50">
              {post.photos.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={post.title}
                  className="h-32 w-auto rounded-lg object-cover shrink-0"
                  loading="lazy"
                />
              ))}
            </div>
          )}
          {post.photos.length > 0 && mode === "lite" && (
            <div className="p-3 bg-cream-50 text-xs text-charcoal-400">
              {post.photos.length} {locale === "ar" ? "صور" : "photos"} —{" "}
              {locale === "ar" ? "وضع خفيف" : "lite mode"}
            </div>
          )}

          <div className="p-4">
            <div className="font-semibold text-charcoal mb-1">{post.title}</div>
            {post.description && (
              <p className="text-sm text-charcoal-500">{post.description}</p>
            )}
            <div className="text-xs text-charcoal-400 mt-2">
              {new Date(post.created_at).toLocaleDateString(
                locale === "ar" ? "ar-SY" : "en-GB"
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
