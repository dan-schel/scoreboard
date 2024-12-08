<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

// NOTE: Can assume mediaSession is supported in this component, as the enable
// button is disabled if it's not, so this component would not be rendered.

const audioRef = ref<HTMLAudioElement | null>(null);

function handlePlayPause() {
  console.log("play/pause");
}
function handleNextTrack() {
  console.log("next");
}
function handlePreviousTrack() {
  console.log("previous");
}

onMounted(() => {
  audioRef.value?.play();
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
