import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import memberVerification from '../data/memberVerification.json';

function getMemberById(id) {
  if (!id) return null;
  return memberVerification[id.toUpperCase()] || null;
}

export default function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = (searchParams.get('id') || '').trim();
  const [inputId, setInputId] = useState(queryId);

  useEffect(() => {
    setInputId(queryId);
  }, [queryId]);

  const normalizedId = useMemo(() => queryId.toUpperCase(), [queryId]);
  const member = useMemo(() => getMemberById(normalizedId), [normalizedId]);

  const onSubmit = (event) => {
    event.preventDefault();
    const nextId = inputId.trim().toUpperCase();

    if (!nextId) {
      setSearchParams({});
      return;
    }

    setSearchParams({ id: nextId });
  };

  const hasQuery = normalizedId.length > 0;
  const isValid = !!member;

  return (
    <section className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden bg-[#020617] sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-[var(--color-primary)]/10 blur-[100px]" />
        <div className="absolute -bottom-24 right-[-12%] w-[22rem] h-[22rem] rounded-full bg-[var(--color-accent)]/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md md:max-w-2xl animate-fade-in">
        <div className="text-center mb-5 md:mb-7">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] tracking-[0.18em] uppercase text-gray-300">
            Member Verification
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight text-white leading-tight">
            Verify AWS Cloud Club ID
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-400 max-w-lg mx-auto">
            Scan QR or enter a member ID. Built for quick checks on mobile and event desk.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#0f172acc] to-[#020617f2] shadow-2xl shadow-black/35 p-3 sm:p-4 md:p-5">
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-[#0a1222]/85 p-3 sm:p-4">
            <label htmlFor="member-id" className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2 tracking-wide uppercase">
              Member ID
            </label>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                id="member-id"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="AWS-GEU-001"
                className="w-full rounded-xl bg-[#050b17] border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm sm:text-base"
              />
              <button
                type="submit"
                className="rounded-xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-white hover:bg-[#e68a00] transition-colors text-sm sm:text-base"
              >
                Verify
              </button>
            </div>
          </form>

          <div className="mt-3 rounded-2xl border border-white/10 bg-[#040914]/75 p-4 sm:p-5 min-h-[290px]">
            {!hasQuery && (
              <div className="h-full grid place-items-center text-center text-gray-400 animate-slide-up">
                <div>
                  <p className="text-white text-lg font-semibold">Verification Ready</p>
                  <p className="mt-1.5 text-sm text-gray-400">Type an ID like AWS-GEU-001 to continue.</p>
                </div>
              </div>
            )}

            {hasQuery && isValid && (
              <div className="animate-slide-up">
                <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  VERIFIED ACTIVE ID
                </p>

                <div className="mt-4 flex items-start gap-3 sm:gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10 shrink-0"
                  />

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{member.name}</h2>
                    <p className="text-[var(--color-primary)] font-semibold text-sm sm:text-base mt-1">{member.role}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{member.subRole}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Member ID</p>
                    <p className="text-white font-semibold mt-0.5 break-all">{normalizedId}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Valid Till</p>
                    <p className="text-white font-semibold mt-0.5">{member.validTill}</p>
                  </div>
                </div>
              </div>
            )}

            {hasQuery && !isValid && (
              <div className="h-full grid place-items-center text-center animate-slide-up">
                <div>
                  <p className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-red-500/15 text-red-300 border border-red-400/30">
                    INVALID ID
                  </p>
                  <h2 className="mt-3 text-xl sm:text-2xl font-bold text-white">No verified member found</h2>
                  <p className="mt-1.5 text-sm text-gray-400">
                    ID <span className="text-gray-200 font-semibold">{normalizedId}</span> is not available in core team records.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
