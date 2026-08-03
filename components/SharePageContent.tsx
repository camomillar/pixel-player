"use client";
import { useEffect, useRef, useState } from "react";
import { ValentinesPlaylist } from "@/lib/encode";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import JewelCase from "@/components/JewelCase";
import posthog from "posthog-js";

const T = {
  en: {
    clickToOpen: "Tap to open",
    shareToStory: "Share",
    noPreview: "no preview available",
    createOwn: "Create your playlist here",
  },
  pt: {
    clickToOpen: "Toque para abrir",
    shareToStory: "Compartilhar",
    noPreview: "prévia não disponível",
    createOwn: "Crie sua playlist aqui",
  },
};

function JewelCaseWrapper({ playlist, playlistId, lang }: { playlist: ValentinesPlaylist; playlistId?: string; lang: "en" | "pt" }) {
  const songs = playlist.songs;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const next = () => {
    const ni = (currentIndexRef.current + 1) % songs.length;
    setCurrentIndex(ni);
    loadTrack(songs[ni].previewUrl);
    posthog.capture("song_skipped", { direction: "next", from: currentIndexRef.current, to: ni, total_songs: songs.length });
  };

  const prev = () => {
    const pi = (currentIndexRef.current - 1 + songs.length) % songs.length;
    setCurrentIndex(pi);
    loadTrack(songs[pi].previewUrl);
    posthog.capture("song_skipped", { direction: "prev", from: currentIndexRef.current, to: pi, total_songs: songs.length });
  };

  const { isPlaying, ready, loadTrack, silentLoad, togglePlay } = useAudioPlayer(songs[0].previewUrl, next);

  // When fresh URLs arrive (after Deezer refresh), silently reload the current track's src
  const prevSongs0UrlRef = useRef(songs[0].previewUrl);
  useEffect(() => {
    const newUrl = songs[currentIndex]?.previewUrl;
    if (newUrl && newUrl !== prevSongs0UrlRef.current) {
      prevSongs0UrlRef.current = newUrl;
      silentLoad(newUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      posthog.capture("song_played", { song_index: currentIndexRef.current, song_title: songs[currentIndexRef.current]?.title, song_artist: songs[currentIndexRef.current]?.artist, total_songs: songs.length });
    }
    togglePlay();
  };
  const song = songs[currentIndex];
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const t = {
    ...T[lang],
    clickToOpen: isTouch
      ? T[lang].clickToOpen
      : lang === "pt" ? "Clique para abrir" : "Click to open",
  };

  return (
    <JewelCase
      to={playlist.to}
      from={playlist.from}
      title={playlist.title}
      message={playlist.message}
      bgColor={playlist.bgColor}
      coverImage={playlist.coverImage}
      isPlaying={isPlaying}
      ready={ready}
      onTogglePlay={handleTogglePlay}
      onNext={next}
      onPrev={prev}
      song={song}
      songs={songs}
      total={songs.length}
      onBack={() => window.history.back()}
      playlistId={playlistId}
      particles={playlist.particles}
      stickers={playlist.stickers}
      i18n={t}
      lang={lang}
    />
  );
}

export default function SharePageContent({ playlist, playlistId }: { playlist: ValentinesPlaylist; playlistId?: string }) {
  // The site is English-only; kept as a constant for the props that still take a language.
  const lang = "en";
  const [freshPlaylist, setFreshPlaylist] = useState(playlist);

  // Always re-fetch preview URLs on mount — Deezer CDN URLs expire after a few hours
  useEffect(() => {
    const ids = playlist.songs.map(s => s.id).filter(Boolean);
    if (!ids.length) return;
    fetch(`/api/preview-urls?ids=${ids.join(",")}`)
      .then(r => r.json())
      .then((urlMap: Record<string, string | null>) => {
        setFreshPlaylist(prev => ({
          ...prev,
          songs: prev.songs.map(s => ({
            ...s,
            previewUrl: urlMap[s.id] ?? s.previewUrl,
          })),
        }));
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const color = playlist.bgColor || "#fff";
    document.documentElement.style.background = color;
    document.body.style.background = color;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, [playlist.bgColor]);

  useEffect(() => {
    posthog.capture("playlist_opened", { songs_count: playlist.songs.length, has_cover: !!playlist.coverImage, has_message: !!playlist.message, bg_color: playlist.bgColor });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <JewelCaseWrapper playlist={freshPlaylist} playlistId={playlistId} lang={lang} />
    </>
  );
}
