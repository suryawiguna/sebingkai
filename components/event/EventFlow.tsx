"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDeviceGate } from "../demo/useDeviceGate";
import { DesktopGate } from "../demo/DesktopGate";
import { DemoCamera } from "../demo/DemoCamera";
import { EventJoin } from "./EventJoin";
import { EventGallery } from "./EventGallery";
import { SharedAlbum } from "./SharedAlbum";
import { useEventStore, type EventInfo } from "./useEventStore";

type Step = "join" | "camera" | "gallery";

export type EventForFlow = EventInfo & {
  status: string;
  reveal_at: string | null;
  revealed: boolean;
};

/**
 * EventFlow — the real guest state machine. join → camera → own roll, with a
 * live reveal watch: when the host reveals (Realtime) or the scheduled time
 * passes (timer), the shared album takes over for everyone at once.
 */
export function EventFlow({ event }: { event: EventForFlow }) {
  const gate = useDeviceGate();
  const store = useEventStore(event);
  const [step, setStep] = useState<Step>("join");
  const [revealed, setRevealed] = useState(event.revealed);

  // Live reveal: host flips status → revealed via Realtime.
  useEffect(() => {
    if (revealed) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`event-${event.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events", filter: `id=eq.${event.id}` },
        (payload) => {
          const e = payload.new as { status?: string };
          if (e.status === "revealed") setRevealed(true);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id, revealed]);

  // Scheduled reveal: flip when reveal_at arrives.
  useEffect(() => {
    if (revealed || !event.reveal_at) return;
    const ms = new Date(event.reveal_at).getTime() - Date.now();
    if (ms <= 0) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), ms);
    return () => clearTimeout(t);
  }, [event.reveal_at, revealed]);

  if (gate === "checking") return <div className="min-h-dvh bg-base" />;
  if (gate === "blocked") return <DesktopGate />;
  if (revealed) return <SharedAlbum eventId={event.id} eventName={event.name} />;

  if (step === "camera") {
    return (
      <DemoCamera
        count={store.photos.length}
        limit={store.limit}
        lastPhoto={store.photos[store.photos.length - 1]}
        onCapture={store.addPhoto}
        onDone={() => setStep("gallery")}
      />
    );
  }

  if (step === "gallery") {
    return (
      <EventGallery
        eventName={event.name}
        photos={store.photos}
        limit={store.limit}
        revealAt={event.reveal_at}
        onOpenCamera={() => setStep("camera")}
      />
    );
  }

  return (
    <EventJoin
      eventName={event.name}
      photoLimit={event.photo_limit_per_guest}
      joining={store.joining}
      error={store.error}
      onJoin={async (name) => {
        const ok = await store.join(name);
        if (ok) setStep("camera");
      }}
    />
  );
}
