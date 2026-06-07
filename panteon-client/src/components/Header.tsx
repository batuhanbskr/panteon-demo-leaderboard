function getWeekRange(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const MedalCard = ({
  icon,
  title,
  subtitle,
  colorClass,
}: {
  icon: string;
  title: string;
  subtitle: string;
  colorClass: string;
}) => (
  <div
    className={`bg-gradient-to-b border rounded-xl py-2 sm:py-2.5 flex flex-col items-center justify-center transform transition-transform hover:scale-105 cursor-default ${colorClass}`}
  >
    <span className="text-2xl sm:text-3xl drop-shadow-lg mb-1">{icon}</span>
    <span
      className={`text-[11px] font-black uppercase tracking-wide ${colorClass.split(" ")[0].replace("from-", "text-").replace("/20", "")}`}
    >
      {title}
    </span>
    <span className="text-[10px] opacity-80 font-mono mt-0.5 text-inherit">
      {subtitle}
    </span>
  </div>
);

const ActionButton = ({
  onClick,
  icon,
  label,
  variant = "indigo",
}: {
  onClick: () => void;
  icon: string;
  label: string;
  variant?: "amber" | "indigo";
}) => {
  const variants = {
    amber:
      "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40",
    indigo:
      "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40",
  };

  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium shadow-sm ${variants[variant]}`}
    >
      <span className="text-sm">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

export interface HeaderProps {
  prizePool: number;
  isLive: boolean;
  currentUserId: string;
  onUserChange: (id: string) => void;
  topPlayerId?: string;
  lastPlayerId?: string;
}

export function Header({
  prizePool,
  isLive,
  currentUserId,
  onUserChange,
  topPlayerId,
  lastPlayerId,
}: HeaderProps) {
  const weekRange = getWeekRange();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-1">
            panteon.games
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-none">
            Haftalık <span className="text-amber-400">Liderlik</span> Tablosu
          </h1>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest">
              LIVE
            </span>
          </div>
        )}
      </div>

      <div className="border-y border-slate-700/60 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono text-amber-400/90 uppercase tracking-widest font-extrabold flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              Aktif Ödül Havuzu
            </p>
            <p className="text-[12px] text-slate-300 flex items-center gap-1.5">
              ⏱️ {weekRange}
            </p>
            <p className="text-[11px] text-red-400 font-medium animate-pulse">
              Pazar 23:59'da Sıfırlanır!
            </p>
          </div>

          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 tabular-nums leading-none shrink-0 font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            {prizePool.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            <span className="text-xl sm:text-2xl md:text-3xl text-amber-400 ml-1">
              ₺
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <MedalCard
            icon="🥇"
            title="Şampiyon"
            subtitle="Havuzun %20'si"
            colorClass="from-yellow-500/20 to-yellow-500/5 border-yellow-500/40 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:bg-yellow-500/20"
          />
          <MedalCard
            icon="🥈"
            title="2. Sıra"
            subtitle="Havuzun %15'i"
            colorClass="from-slate-300/20 to-slate-300/5 border-slate-300/40 text-slate-300 hover:bg-slate-300/20"
          />
          <MedalCard
            icon="🥉"
            title="3. Sıra"
            subtitle="Havuzun %10'u"
            colorClass="from-orange-400/20 to-orange-400/5 border-orange-400/40 text-orange-300 hover:bg-orange-400/20"
          />
        </div>

        <div className="text-center">
          <p className="text-[11px] text-indigo-300/80 font-medium flex items-center justify-center gap-1.5">
            <span>✨</span> Kalan ödül{" "}
            <strong className="text-indigo-200">İlk 100'e</strong> sıralamasına
            göre dağıtılır!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 mt-1 min-w-0">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0 pb-0.5 scrollbar-none">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/60 text-slate-400 text-[10px] font-mono px-3 py-1.5 rounded-lg tracking-widest shadow-inner select-none shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="hidden sm:inline">DEMO MODU</span>
          </div>

          {topPlayerId && topPlayerId !== currentUserId && (
            <ActionButton
              onClick={() => onUserChange(topPlayerId)}
              icon="👑"
              label="Şampiyonu İzle"
              variant="amber"
            />
          )}
          {currentUserId !== "player_3665" && (
            <ActionButton
              onClick={() => onUserChange("player_3665")}
              icon="🕵️"
              label="Ortalama Kullanıcı"
            />
          )}
          {lastPlayerId && lastPlayerId !== currentUserId && (
            <ActionButton
              onClick={() => onUserChange(lastPlayerId)}
              icon="🕵️"
              label="Son Kullanıcı"
            />
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:inline-block font-medium">
            Aktif Oturum:
          </span>
          <span className="bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs px-3 py-1.5 rounded-lg shadow-inner flex items-center gap-1.5">
            <span className="text-emerald-500/50">/</span>
            {currentUserId}
          </span>
        </div>
      </div>
    </div>
  );
}
