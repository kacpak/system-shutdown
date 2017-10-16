<template>
  <v-progress-circular v-bind:size="200" v-bind:width="8" v-bind:rotate="-90" v-bind:value="progress" color="teal">
    {{ progressText }}</v-progress-circular>
</template>

<script>
import * as notifier from 'node-notifier';

export default {
  props: ['shutdownTime', 'startTime', 'on'],
  data() {
    return {
      interval: {},
      progress: 0,
      progressText: '',
      lastNotification: null
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    on(isBeingShutdown) {
      clearInterval(this.interval);

      if (!isBeingShutdown) {
        this.progress = 0;
        this.progressText = '';
        return;
      }

      this.updateClock();
      this.interval = setInterval(() => this.updateClock(), 1000);
    }
  },
  methods: {
    updateClock() {
      if (this.startTime === null) {
        this.progress = 0;
        this.progressText = '';
        return;
      }

      const totalDuration = this.shutdownTime.unix() - this.startTime.unix();
      const timeToShutdown = this.shutdownTime.unix() - this.$moment().unix();
      this.progress = (totalDuration - timeToShutdown) / totalDuration * 100;
      this.progressText = this.shutdownTime.fromNow();

      const minutesToShutdown = Math.round(this.progress / 60);
      if ([1, 2, 5, 15, 30, 60, 90, 120].includes(minutesToShutdown)) {
        if (this.lastNotification !== minutesToShutdown) {
          this.lastNotification = minutesToShutdown;
          notifier.notify({
            title: `Komputer wyłączy się ${this.progressText}`,
            message: this.shutdownTime.format('HH:mm'),
            sound: true
          });
        }
      }

      if (this.progress >= 100) {
        clearInterval(this.interval);
        this.progressText = 'Shutdown';
        this.$emit('shutdown');
      }
    }
  }
};
</script>