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

export interface HeaderProps {
  prizePool: number;
  isLive: boolean;
  currentUserId: string;
  onUserChange: (id: string) => void;
  topPlayerId?: string;
}

export function Header({
  prizePool,
  isLive,
  currentUserId,
  onUserChange,
  topPlayerId,
}: HeaderProps) {
  const weekRange = getWeekRange();

  const lastPlayerId = "player_150";

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-1">
            panteon.games
          </p>
          <h1 className="text-2xl font-bold text-white leading-none">
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

      <div className="border-y border-slate-700/60 py-5 flex flex-col gap-5">
        {/* Üst Kısım: Havuz Bilgisi ve Canlı Bakiye */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono text-amber-400/90 uppercase tracking-widest font-extrabold flex items-center gap-2">
              {/* Canlı/Aktif olduğunu hissettiren yanıp sönen nokta */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              Aktif Ödül Havuzu
            </p>
            <p className="text-[12px] text-slate-300 flex items-center gap-1.5">
              ⏱️ {weekRange}
            </p>
            {/* Sıfırlanma süresini vurgulayan animasyonlu metin */}
            <p className="text-[11px] text-red-400 font-medium animate-pulse">
              Pazar 23:59'da Sıfırlanır!
            </p>
          </div>

          {/* Daha devasa, gradyanlı ve parlayan bir para miktarı */}
          <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 tabular-nums leading-none shrink-0 font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            {prizePool.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            <span className="text-2xl md:text-3xl text-amber-400 ml-1">₺</span>
          </p>
        </div>

        {/* Alt Kısım: İştah Kabartan Madalya Dağılım Kartları */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {/* 1. Sıra - Altın Kart */}
          <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 border border-yellow-500/40 rounded-xl py-2.5 flex flex-col items-center justify-center transform transition-transform hover:scale-105 hover:bg-yellow-500/20 cursor-default shadow-[0_0_15px_rgba(234,179,8,0.15)]">
            <span className="text-3xl drop-shadow-lg mb-1">🥇</span>
            <span className="text-[11px] font-black text-yellow-400 uppercase tracking-wide">
              Şampiyon
            </span>
            <span className="text-[10px] text-yellow-200/80 font-mono mt-0.5">
              Havuzun %20'si
            </span>
          </div>

          {/* 2. Sıra - Gümüş Kart */}
          <div className="bg-gradient-to-b from-slate-300/20 to-slate-300/5 border border-slate-300/40 rounded-xl py-2.5 flex flex-col items-center justify-center transform transition-transform hover:scale-105 hover:bg-slate-300/20 cursor-default">
            <span className="text-3xl drop-shadow-lg mb-1">🥈</span>
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-wide">
              2. Sıra
            </span>
            <span className="text-[10px] text-slate-300/80 font-mono mt-0.5">
              Havuzun %15'i
            </span>
          </div>

          {/* 3. Sıra - Bronz Kart */}
          <div className="bg-gradient-to-b from-orange-400/20 to-orange-400/5 border border-orange-400/40 rounded-xl py-2.5 flex flex-col items-center justify-center transform transition-transform hover:scale-105 hover:bg-orange-400/20 cursor-default">
            <span className="text-3xl drop-shadow-lg mb-1">🥉</span>
            <span className="text-[11px] font-black text-orange-400 uppercase tracking-wide">
              3. Sıra
            </span>
            <span className="text-[10px] text-orange-300/80 font-mono mt-0.5">
              Havuzun %10'u
            </span>
          </div>
        </div>

        {/* Kalan oyuncuları motive eden dipnot */}
        <div className="text-center mt-1">
          <p className="text-[11px] text-indigo-300/80 font-medium flex items-center justify-center gap-1.5">
            <span>✨</span> Kalan ödül{" "}
            <strong className="text-indigo-200">İlk 100'e</strong> sıralamasına
            göre dağıtılır!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-5 mt-2 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/60 text-slate-400 text-[10px] font-mono px-3 py-1.5 rounded-lg tracking-widest shadow-inner select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          DEMO MODU
        </div>

        {topPlayerId && topPlayerId !== currentUserId && (
          <button
            onClick={() => onUserChange(topPlayerId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all text-xs font-medium shadow-sm"
          >
            <span className="text-sm">👑</span> Şampiyonu İzle
          </button>
        )}

        {currentUserId !== "player_3665" && (
          <button
            onClick={() => onUserChange("player_3665")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all text-xs font-medium shadow-sm"
          >
            <span className="text-sm">🕵️</span> Ortalama Kullanici
          </button>
        )}

        {lastPlayerId && lastPlayerId !== currentUserId && (
          <button
            onClick={() => onUserChange(lastPlayerId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all text-xs font-medium shadow-sm"
          >
            <span className="text-sm">🕵️</span> Son kullanici
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
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
