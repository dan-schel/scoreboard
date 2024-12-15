<script setup lang="ts" generic="GameStateType extends GameState">
import type {
  Announcement,
  AnnouncementSegment,
  EarbudInterface,
} from "@/data/game/earbud-interface";
import type { Action, GameState } from "@/data/game/game";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Howl } from "howler";

const props = defineProps<{
  interface: EarbudInterface<GameStateType>;
  state: GameStateType;
}>();

const emit = defineEmits<{
  (e: "submit-action", action: Action): void;
  (e: "undo"): void;
}>();

const audioRef = ref<HTMLAudioElement | null>(null);
const moreOptionsChosen = ref(false);
const player = ref<Howl | null>(null);

const audioSprite = computed(() => props.interface.getAudioSprite());
const annoucementSegmentQueue = ref<AnnouncementSegment[]>([]);

watch(() => props.state, handleStateUpdate);

function handleStateUpdate(newValue: GameStateType, oldValue: GameStateType) {
  const announcement = props.interface.getStateUpdateAnnouncement(
    newValue,
    oldValue,
  );

  if (announcement != null) {
    playAnnoucement(announcement);
  }
}

function handlePlayPause() {
  if (moreOptionsChosen.value) {
    playAnnoucement(props.interface.getScoreSummaryAnnouncement(props.state));
    moreOptionsChosen.value = false;
  } else {
    // TODO: Cancel the 'more options' state after a timeout?
    moreOptionsChosen.value = true;
  }
}

function handleNextTrack() {
  if (moreOptionsChosen.value) {
    submitActionUnlessNull(props.interface.getFaultAction(props.state));
    moreOptionsChosen.value = false;
  } else {
    submitActionUnlessNull(
      props.interface.getIncrementPlayer1Action(props.state),
    );
  }
}

function handlePreviousTrack() {
  if (moreOptionsChosen.value) {
    emit("undo");
    moreOptionsChosen.value = false;
  } else {
    submitActionUnlessNull(
      props.interface.getIncrementPlayer2Action(props.state),
    );
  }
}

function submitActionUnlessNull(action: Action | null) {
  if (action != null) {
    emit("submit-action", action);
  }
}

function playAnnoucement(annoucement: Announcement) {
  console.log("[Annoucement]", annoucement);
  annoucementSegmentQueue.value.push(...annoucement);
  playNextAnnoucementSegment();
}

function playNextAnnoucementSegment() {
  console.log(player.value?.state());

  const [nextSegment, ...rest] = annoucementSegmentQueue.value;
  annoucementSegmentQueue.value = rest;

  if (nextSegment != null) {
    player.value?.play(nextSegment.clip);
  }
}

function handleAudioLoaded() {
  const activationAnnoucement = props.interface.getActivationAnnoucement(
    props.state,
  );

  if (activationAnnoucement != null) {
    playAnnoucement(activationAnnoucement);
  }
}

onMounted(() => {
  player.value = new Howl({
    src: [audioSprite.value.file],
    sprite: audioSprite.value.toHowlerSpriteDefinition(),
    onload: () => handleAudioLoaded(),
    onloaderror: (id, error) =>
      console.warn("Error loading audio sprite", error),
    onend: () => playNextAnnoucementSegment(),
  });

  audioRef.value?.play();

  // NOTE: Can assume mediaSession is supported in this component, as the enable
  // button is disabled if it's not, so this component would not be rendered.
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Earbud mode controls",
    artist: "scoreboard.danschellekens.com",
    artwork: [
      { src: "/favicon-maskable-512.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon-maskable-192.png", sizes: "192x192", type: "image/png" },
    ],
  });
  navigator.mediaSession.playbackState = "playing";
  navigator.mediaSession.setPositionState({
    duration: 10,
  });
  navigator.mediaSession.setActionHandler("play", handlePlayPause);
  navigator.mediaSession.setActionHandler("pause", handlePlayPause);
  navigator.mediaSession.setActionHandler("nexttrack", handleNextTrack);
  navigator.mediaSession.setActionHandler("previoustrack", handlePreviousTrack);
});

onUnmounted(() => {
  player.value?.unload();
  player.value = null;

  audioRef.value?.pause();
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Earbud mode disabled",
    artist: "Use the on-page menu to re-enable",
    artwork: [
      { src: "/favicon-maskable-512.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon-maskable-192.png", sizes: "192x192", type: "image/png" },
    ],
  });
  navigator.mediaSession.playbackState = "none";
  navigator.mediaSession.setPositionState({
    duration: 0,
  });
  navigator.mediaSession.setActionHandler("play", null);
  navigator.mediaSession.setActionHandler("pause", null);
  navigator.mediaSession.setActionHandler("nexttrack", null);
  navigator.mediaSession.setActionHandler("previoustrack", null);
});
</script>

<template>
  <div class="earbud-mode-controller">
    <audio ref="audioRef" src="/silence.mp3" loop></audio>
  </div>
</template>

<style scoped lang="scss"></style>
