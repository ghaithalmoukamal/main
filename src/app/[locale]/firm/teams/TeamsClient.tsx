"use client";

import { useState } from "react";
import { pickLocalized } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Craftsman, Trade, City } from "@/lib/types";

interface Props {
  craftsmen: Array<Craftsman & { trade?: Trade | null; city?: City }>;
  locale: "ar" | "en";
}

interface Team {
  id: string;
  name: string;
  craftsmanIds: string[];
}

export default function TeamsClient({ craftsmen, locale }: Props) {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team-1",
      name: locale === "ar" ? "فريق التشطيبات" : "Finishing Team",
      craftsmanIds: ["demo-1", "demo-5", "demo-6"],
    },
  ]);
  const [newTeamName, setNewTeamName] = useState("");
  const [activeTeamId, setActiveTeamId] = useState<string | null>("team-1");

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  const createTeam = () => {
    if (!newTeamName.trim()) return;
    const id = `team-${Date.now()}`;
    setTeams((prev) => [
      ...prev,
      { id, name: newTeamName.trim(), craftsmanIds: [] },
    ]);
    setNewTeamName("");
    setActiveTeamId(id);
  };

  const toggleInTeam = (craftsmanId: string) => {
    if (!activeTeamId) return;
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== activeTeamId) return t;
        const has = t.craftsmanIds.includes(craftsmanId);
        return {
          ...t,
          craftsmanIds: has
            ? t.craftsmanIds.filter((id) => id !== craftsmanId)
            : [...t.craftsmanIds, craftsmanId],
        };
      })
    );
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      {/* Team list */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-charcoal-500 mb-2">
          {locale === "ar" ? "فرقي" : "My Teams"}
        </div>
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setActiveTeamId(team.id)}
            className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${
              team.id === activeTeamId
                ? "bg-clay text-cream"
                : "hover:bg-cream-100 text-charcoal"
            }`}
          >
            {team.name}
            <span className="ms-2 opacity-70">({team.craftsmanIds.length})</span>
          </button>
        ))}

        <div className="pt-2 space-y-2">
          <Input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder={locale === "ar" ? "اسم فريق جديد" : "New team name"}
            onKeyDown={(e) => e.key === "Enter" && createTeam()}
          />
          <Button variant="outline" size="sm" fullWidth onClick={createTeam}>
            + {locale === "ar" ? "إنشاء فريق" : "Create Team"}
          </Button>
        </div>
      </div>

      {/* Craftsman grid */}
      <div>
        {activeTeam && (
          <div className="mb-3 text-sm text-charcoal-500">
            {locale === "ar"
              ? `تحديد المعلمين للفريق: ${activeTeam.name}`
              : `Select craftsmen for: ${activeTeam.name}`}
          </div>
        )}
        <div className="space-y-2">
          {craftsmen.map((c) => {
            const inTeam = activeTeam?.craftsmanIds.includes(c.id) ?? false;
            const tradeName = c.trade
              ? pickLocalized(c.trade, "name", locale)
              : "";
            return (
              <div
                key={c.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  inTeam
                    ? "border-clay bg-clay/5"
                    : "border-clay-100 hover:border-clay-200"
                }`}
                onClick={() => activeTeamId && toggleInTeam(c.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-lg shrink-0">
                  🛠️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-charcoal text-sm">{c.name}</div>
                  <div className="text-xs text-charcoal-400">{tradeName}</div>
                </div>
                {inTeam && <Badge variant="approved">✓</Badge>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
