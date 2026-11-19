'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { announceToken } from '@/lib/speech';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Home,
  ShieldCheck,
  Languages,
  Check,
  Stethoscope,
  Clock,
  Calendar,
  ArrowRight,
  Radio,
} from 'lucide-react';

export default function TVDisplayPage() {
  const settings = useClinicStore((state) => state.settings);
  const updateSettings = useClinicStore((state) => state.updateSettings);
  const tokens = useClinicStore((state) => state.tokens);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  // Live Clock
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(1.0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync with token changes across other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clinova_clinic_state_v1') {
        useClinicStore.persist.rehydrate();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Current Serving Token
  const currentlyServing = tokens.find(
    (t) => t.id === currentServingTokenId && (t.status === 'called' || t.status === 'in-consultation')
  );

  // Upcoming Queue: tokens with status 'waiting'
  const upcomingQueue = tokens
    .filter((t) => t.status === 'waiting')
    .slice(0, 5);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleTestAnnouncement = () => {
    const tokenToAnnounce = currentlyServing ? currentlyServing.tokenNumber : 'A-104';
    const roomToAnnounce = currentlyServing ? currentlyServing.room : "Doctor's Room 1";
    announceToken(tokenToAnnounce, roomToAnnounce, {
      lang: settings.activeVoiceLanguage,
      volume: voiceVolume,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A1A1E] text-white flex flex-col justify-between select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="bg-gradient-to-r from-[#0C2227] via-[#123C45] to-[#0C2227] px-8 py-5 border-b border-[#1C7774]/30 shadow-lg flex items-center justify-between">
        {/* Clinic Identity */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C7774] to-[#123C45] flex items-center justify-center border-2 border-[#35A99A]/40 shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-[#35A99A]">
              <path d="M12 4v16m-8-8h16" />
              <circle cx="12" cy="12" r="3.5" fill="#35A99A" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white">{settings.clinicName}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#35A99A]/20 text-[#35A99A] border border-[#35A99A]/40">
                OPD Live Queue
              </span>
            </div>
            <p className="text-xs text-teal-200/80 font-medium mt-0.5">
              Consultation Room 1 • Dr. Haroon Rashid, MD
            </p>
          </div>
        </div>

        {/* Live Date & Time Display */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-xs font-semibold text-teal-200/80 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#35A99A]" />
              <span>{currentDate || 'Loading date...'}</span>
            </div>
            <div className="text-3xl font-mono font-extrabold tracking-tight text-white flex items-center justify-end gap-2 mt-0.5">
              <Clock className="w-5 h-5 text-[#35A99A]" />
              <span>{currentTime || '00:00:00'}</span>
            </div>
          </div>

          {/* Discreet Control Trigger */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-teal-200/80 hover:text-white transition-colors border border-white/10"
            title="TV Settings & Audio Configuration"
          >
            {settings.voiceEnabled ? <Volume2 className="w-5 h-5 text-[#35A99A]" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </header>

      {/* Floating Audio & Display Controls Drawer / Modal */}
      {showControls && (
        <div className="fixed top-24 right-8 z-50 bg-[#123C45]/95 backdrop-blur-md border border-[#35A99A]/40 rounded-2xl p-5 shadow-2xl w-80 text-xs animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <span className="font-bold text-sm text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#35A99A]" /> TV Audio & Settings
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-white/60 hover:text-white px-2 py-1 bg-white/10 rounded"
            >
              Done
            </button>
          </div>

          <div className="space-y-4">
            {/* Voice toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white/90 font-medium">Automated Speech</span>
              <button
                onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  settings.voiceEnabled ? 'bg-[#35A99A] text-white' : 'bg-white/10 text-white/50'
                }`}
              >
                {settings.voiceEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Language Selector */}
            <div>
              <span className="text-white/70 block mb-1.5 font-medium">Voice Language</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['en', 'hi', 'kn'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => updateSettings({ activeVoiceLanguage: lang })}
                    className={`py-1.5 px-2 rounded-lg font-bold uppercase transition-all ${
                      settings.activeVoiceLanguage === lang
                        ? 'bg-[#35A99A] text-white shadow-xs'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume slider */}
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>Volume</span>
                <span>{Math.round(voiceVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                className="w-full accent-[#35A99A] cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleTestAnnouncement}
                className="w-full py-2 bg-[#1C7774] hover:bg-[#186462] text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#35A99A]" />
                <span>Test Audio Announcement</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter 1920x1080 Fullscreen'}</span>
              </button>

              <Link
                href="/"
                className="w-full py-2 text-center text-teal-200/70 hover:text-white transition-colors"
              >
                Return to Clinova Hub
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Screen Area (1920x1080 layout) */}
      <main className="flex-1 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT COLUMN: Currently Serving (Huge readability) */}
        <section className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-b from-[#0F2E35] to-[#0A2227] rounded-3xl p-8 md:p-12 border-2 border-[#1C7774]/50 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#35A99A]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Currently Serving Label */}
          <div className="flex items-center justify-between border-b border-[#1C7774]/40 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#35A99A] animate-ping" />
              <span className="text-xl md:text-2xl font-black tracking-wider uppercase text-teal-200">
                CURRENTLY SERVING
              </span>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#35A99A]/20 text-[#35A99A] border border-[#35A99A]/30">
              Doctor Consultation
            </span>
          </div>

          {/* Huge Token Display with Pulse */}
          <div className="my-auto py-10 flex flex-col items-center justify-center text-center">
            {currentlyServing ? (
              <div className="space-y-4">
                <div className="inline-block p-6 md:p-10 rounded-3xl bg-[#123C45]/80 border-2 border-[#35A99A] shadow-2xl tv-pulse-active">
                  <span className="text-7xl md:text-9xl lg:text-[11rem] font-mono font-black tracking-tight text-white block leading-none drop-shadow-[0_4px_24px_rgba(53,169,154,0.4)]">
                    {currentlyServing.tokenNumber}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    <ArrowRight className="w-4 h-4 text-[#35A99A]" />
                    Please Proceed Inside
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-12">
                <span className="text-5xl md:text-7xl font-mono font-bold text-white/30 block">
                  --
                </span>
                <p className="text-lg font-semibold text-teal-200/60 uppercase tracking-wider">
                  Consultation In Progress • Calling Next Shortly
                </p>
              </div>
            )}
          </div>

          {/* Doctor & Room Location Cards */}
          <div className="grid grid-cols-2 gap-4 border-t border-[#1C7774]/40 pt-6">
            <div className="bg-[#123C45]/50 p-4 rounded-2xl border border-[#1C7774]/30">
              <span className="text-xs uppercase font-bold text-teal-200/70 tracking-wider block mb-1">
                Consultant
              </span>
              <span className="text-lg md:text-xl font-bold text-white block truncate">
                Dr. Haroon Rashid
              </span>
              <span className="text-xs text-[#35A99A] font-medium block">Internal Medicine Specialist</span>
            </div>

            <div className="bg-[#123C45]/50 p-4 rounded-2xl border border-[#1C7774]/30 text-right">
              <span className="text-xs uppercase font-bold text-teal-200/70 tracking-wider block mb-1">
                Location
              </span>
              <span className="text-lg md:text-xl font-bold text-[#35A99A] block">
                Room 1 (Ground Floor)
              </span>
              <span className="text-xs text-white/60 font-medium block">Main OPD Wing</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Next Tokens & Waiting Queue */}
        <section className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#0F2E35] to-[#0A2227] rounded-3xl p-8 border-2 border-[#1C7774]/40 shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C7774]/40 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#35A99A]" />
                <span className="text-xl font-black tracking-wider uppercase text-teal-200">
                  NEXT IN LINE
                </span>
              </div>
              <span className="text-xs font-semibold text-white/60">
                {upcomingQueue.length} upcoming
              </span>
            </div>

            {/* List of Next Tokens */}
            <div className="space-y-3.5">
              {upcomingQueue.length > 0 ? (
                upcomingQueue.map((token, index) => (
                  <div
                    key={token.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-[#1C7774]/40 to-[#123C45]/80 border-[#35A99A] shadow-md'
                        : 'bg-[#123C45]/30 border-[#1C7774]/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-[#35A99A] text-[#0A2227]' : 'bg-white/10 text-white/80'
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <span className="text-3xl font-mono font-extrabold tracking-tight text-white block">
                          {token.tokenNumber}
                        </span>
                        <span className="text-xs text-teal-200/70 font-medium capitalize">
                          {token.category} Patient • Arrived {token.arrivalTime}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {index === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#35A99A]/20 text-[#35A99A] border border-[#35A99A]/40 animate-pulse">
                          Be Ready
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-white/40">
                          Est. ~{index * 12} mins
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-white/40 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-sm font-semibold">Queue is currently clear.</p>
                  <p className="text-xs mt-1">Please collect your token at the reception desk.</p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Reminder Badge */}
          <div className="mt-6 pt-4 border-t border-[#1C7774]/40 bg-white/5 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#35A99A] shrink-0" />
            <p className="text-xs text-teal-100/80 leading-relaxed">
              <strong className="text-white">Patient Privacy Guaranteed:</strong> Token numbers only are displayed. Names and medical records remain confidential.
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Announcement Ticker (Smooth Continuous Banner) */}
      <footer className="bg-[#081518] border-t border-[#1C7774]/30 py-3.5 px-8 flex items-center justify-between text-xs text-teal-200/80">
        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2.5 py-1 rounded-md bg-[#35A99A] text-[#0A2227] font-black uppercase text-[10px] tracking-wider">
            ANNOUNCEMENT
          </span>
        </div>

        {/* Scrolling text marquee */}
        <div className="overflow-hidden whitespace-nowrap mx-6 text-sm text-teal-100/90 font-medium">
          <span className="inline-block animate-marquee">
            📢 Welcome to Dr. Haroon's Medical Center • Please keep your token slip ready before entering the consultation room • Wearing face masks is recommended inside the clinic • Complimentary Clinic Wi-Fi: <strong>Clinova_Guest</strong> • For assistance or emergency consultations, please alert the reception counter immediately • Drinking water is located beside Room 2.
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/40 shrink-0">
          <span>Powered by Clinova ClinicOS</span>
        </div>
      </footer>
    </div>
  );
}
