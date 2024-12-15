<script
  setup
  lang="ts"
  generic="GameStateType extends GameState, AvailableClipType extends string"
>
import type {
  Announcement,
  EarbudInterface,
} from "@/data/game/earbud-interface";
import type { Action, GameState } from "@/data/game/game";
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { Howl } from "howler";

const props = defineProps<{
  interface: EarbudInterface<GameStateType, AvailableClipType>;
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
const announcementSegmentQueue = ref([]) as Ref<
  Announcement<AvailableClipType>
>;
const nonCancellableAnnouncementSegmentsRemaining = ref(-1);

watch(
  () => props.interface,
  (newValue, oldValue) => {
    newValue?.addAnnouncementListener(handleAnnouncement);
    oldValue?.removeAnnouncementListener(handleAnnouncement);
  },
  { immediate: true },
);

function handleAnnouncement(announcement: Announcement<AvailableClipType>) {
  playAnnouncement(announcement);
}

function handlePlayPause() {
  if (moreOptionsChosen.value) {
    playAnnouncement(props.interface.getScoreSummaryAnnouncement(props.state));
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
    playUndoAnnouncement();
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

function playAnnouncement(
  announcement: Announcement<AvailableClipType>,
  { cancellable = true } = {},
) {
  const announcementText = announcement
    .map((x) => audioSprite.value.clips.get(x)?.text)
    .join(" ");
  console.log("[Announcement]", announcementText);

  // 0 = currently playing clip is non-cancellable, -1 = no non-cancellable clips
  const resetting = nonCancellableAnnouncementSegmentsRemaining.value < 0;

  if (resetting) {
    player.value?.stop();
  }

  const currentNonCancellableClips = announcementSegmentQueue.value.slice(
    0,
    nonCancellableAnnouncementSegmentsRemaining.value,
  );
  announcementSegmentQueue.value = [
    ...currentNonCancellableClips,
    ...announcement,
  ];

  if (!cancellable) {
    nonCancellableAnnouncementSegmentsRemaining.value =
      announcementSegmentQueue.value.length;
  }

  if (resetting) {
    playNextAnnouncementSegment();
  }
}

function playNextAnnouncementSegment() {
  const [nextSegment, ...rest] = announcementSegmentQueue.value;
  announcementSegmentQueue.value = rest;

  if (nonCancellableAnnouncementSegmentsRemaining.value >= 0) {
    nonCancellableAnnouncementSegmentsRemaining.value--;
  }

  if (nextSegment != null) {
    player.value?.play(nextSegment);
  }
}

function handleAudioLoaded() {
  const activationAnnouncement = props.interface.getActivationAnnouncement(
    props.state,
  );

  if (activationAnnouncement != null) {
    playAnnouncement(activationAnnouncement);
  }
}

function playUndoAnnouncement() {
  const undoAnnouncement = props.interface.getUndoAnnouncement();

  if (undoAnnouncement != null) {
    playAnnouncement(undoAnnouncement, { cancellable: false });
  }
}

onMounted(() => {
  player.value = new Howl({
    src: [audioSprite.value.file],
    sprite: audioSprite.value.toHowlerSpriteDefinition(),
    onload: () => handleAudioLoaded(),
    onloaderror: (id, error) =>
      console.warn("Error loading audio sprite", error),
    onend: () => playNextAnnouncementSegment(),
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
