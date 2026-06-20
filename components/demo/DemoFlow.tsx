"use client";

import { useState } from "react";
import { useDeviceGate } from "./useDeviceGate";
import { useDemoStore } from "./useDemoStore";
import { DesktopGate } from "./DesktopGate";
import { DemoJoin } from "./DemoJoin";
import { DemoCamera } from "./DemoCamera";
import { DemoGallery } from "./DemoGallery";

type Step = "join" | "camera" | "gallery";

/**
 * DemoFlow — orchestrates the client-only demo: device gate, then the
 * join → camera → gallery state machine backed by localStorage.
 */
export function DemoFlow() {
  const gate = useDeviceGate();
  const store = useDemoStore();
  const [step, setStep] = useState<Step>("join");

  if (gate === "checking" || !store.hydrated) {
    return <div className="min-h-dvh bg-base" />;
  }
  if (gate === "blocked") {
    return <DesktopGate />;
  }

  if (step === "camera") {
    return (
      <DemoCamera
        count={store.photos.length}
        limit={store.limit}
        onCapture={store.addPhoto}
        onDone={() => setStep("gallery")}
      />
    );
  }

  if (step === "gallery") {
    return (
      <DemoGallery
        guestName={store.guestName}
        photos={store.photos}
        limit={store.limit}
        onOpenCamera={() => setStep("camera")}
        onReset={() => {
          store.reset();
          setStep("join");
        }}
      />
    );
  }

  return (
    <DemoJoin
      initialName={store.guestName}
      onJoin={(name) => {
        store.setName(name);
        setStep("camera");
      }}
    />
  );
}
