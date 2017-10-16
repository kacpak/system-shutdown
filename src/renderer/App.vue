<template>
  <v-app light>
    <v-toolbar dark color="primary" app>
      <v-toolbar-title>System Shutdown</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat icon @click="onMinimize">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn flat icon ripple @click="onClose">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid style="height: 100%">
          <v-layout column align-center justify-center style="height: 100%">
            <v-card>
              <v-card-text>
                <v-layout row align-center justify-center>
                  <ShutdownClock :shutdownTime="datetime" :startTime="startTime" :on="isBeingShutdown" @shutdown="onShutdown" class="mr-4"></ShutdownClock>

                  <v-layout column align-center justify-center>
                    <v-dialog persistent v-model="showDatePickerModal" lazy full-width :disabled="isBeingShutdown">
                      <v-text-field slot="activator" label="Dzień wyłączenia" v-model="date" prepend-icon="event" readonly :disabled="isBeingShutdown"></v-text-field>
                      <v-date-picker v-model="date" scrollable autosave></v-date-picker>
                    </v-dialog>
                    <v-dialog persistent v-model="showTimePickerModal" lazy full-width :disabled="isBeingShutdown">
                      <v-text-field slot="activator" label="Godzina wyłączenia" v-model="time" prepend-icon="access_time" readonly :disabled="isBeingShutdown"></v-text-field>
                      <v-time-picker v-model="time" format="24h" autosave></v-time-picker>
                    </v-dialog>
                    <v-layout row>
                      <v-btn flat color="primary" @click="onStart" :disabled="time === null || isBeingShutdown">Start</v-btn>
                      <v-btn flat color="secondary" @click="onStop" :disabled="!isBeingShutdown">Stop</v-btn>
                    </v-layout>
                  </v-layout>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import * as os from 'os';
import { execSync } from 'child_process';
import { remote } from 'electron';
import ShutdownClock from './components/ShutdownClock.vue';

export default {
  name: 'system-shutdown',
  data() {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      time: null,
      startTime: null,
      isBeingShutdown: false,
      showTimePickerModal: false,
      showDatePickerModal: false
    };
  },
  computed: {
    datetime() {
      if (this.time === null) {
        return null;
      }
      return this.$moment(`${this.date} ${this.time}`, 'YYYY-MM-DD hh:mm');
    },
  },
  components: {
    ShutdownClock
  },
  methods: {
    onStart() {
      this.startTime = this.$moment();
      this.isBeingShutdown = true;
    },
    onStop() {
      this.isBeingShutdown = false;
    },
    onMinimize() {
      const window = remote.getCurrentWindow();
      window.minimize();
    },
    onClose() {
      const window = remote.getCurrentWindow();
      window.close();
    },
    onShutdown() {
      if (os.platform() === 'win32') {
        execSync('shutdown /s /t 0');
      } else {
        execSync('shutdown now');
      }
    }
  },
};
</script>

<style lang="scss">
nav.toolbar {
  -webkit-app-region: drag;

  button {
	  -webkit-app-region: no-drag;
  }
}

html {
  overflow-y: auto;
}

@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(~material-design-icons/iconfont/MaterialIcons-Regular.eot); /* For IE6-8 */
  src: local('Material Icons'),
       local('MaterialIcons-Regular'),
       url(~material-design-icons/iconfont/MaterialIcons-Regular.woff2) format('woff2'),
       url(~material-design-icons/iconfont/MaterialIcons-Regular.woff) format('woff'),
       url(~material-design-icons/iconfont/MaterialIcons-Regular.ttf) format('truetype');
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
</style>
