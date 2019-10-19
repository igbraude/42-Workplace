<template>
    <div class="watch container mt-5">
      <Alert :error="error"></Alert>
      <template v-if="stream">
        <div class="watch-title">
          {{stream.movie.primaryTitle}}
        </div>
        <video ref="player" class="video-js vjs-default-skin vjs-big-play-centered watch-player">
        </video>
        <div class="row">
          <div class="col-md-2">
            <b-form-group label="Quality">
              <b-form-select :options="stream.sources" text-field="label" value-field="src"
                :value="currentResolution ? currentResolution.src : undefined" @change="changeResolution">
              </b-form-select>
            </b-form-group>
          </div>
        </div>
        <MovieComments class="mt-5"></MovieComments>
      </template>
    </div>
</template>

<script>
  import videojs from "video.js"
  import { mapActions, mapState } from 'vuex'
  import MovieComments from '@/components/MovieComments'
  import Alert from '@/components/Alert'

  export default {
    name: 'Watch',
    data() {
      return {
        title: 'Interstellar',
        error: undefined,
        player: undefined,
        currentResolution: undefined,
      }
    },
    components: {
      MovieComments,
      Alert,
    },
    computed: {
      ...mapState('movie', ['stream', 'movie'])
    },
    methods: {
      ...mapActions('movie', ['startStream', 'setStreamWatchTime']),
      changeResolution(src) {
        if (this.player) {
          const currTime = this.player.currentTime()
          const source = this.stream.sources.find(s => s.src === src)
          this.player.src(source)
          this.player.currentTime(currTime)
          this.currentResolution = source
        }
      },
      startPlayer() {
        const { duration, subtitles, sources } = this.stream
        if (duration === undefined || subtitles === undefined || sources === undefined) {
            return
        }
        const player = videojs(this.$refs.player, {
            controls: true,
            preload: "auto",
            muted: true,
            fluid: true,
            autoplay: true,
            responsive: true,
            html5: {
                nativeTextTracks: false,
            },
            textTrackSettings: true,
            controlBar: {
                children: [
                    "playToggle",
                    "volumePanel",
                    "currentTimeDisplay",
                    "progressControl",
                    "remainingTimeDisplay",
                    "subsCapsButton",
                    "fullscreenToggle",
                ],
            },
            sources: [this.currentResolution],
        })
        const oldCurrentSrc = player.currentSrc.bind(player)
        const oldCurrentTime = player.currentTime.bind(player)
        let offset = 0
        let last = 0
        player.currentSrc = () => `${oldCurrentSrc()}?time=${oldCurrentTime() + offset}`
        player.duration = () => duration;
        player.currentTime = time => {
            if (time) {
                const url = new URL(oldCurrentSrc())
                player.src({ src: `${url.origin}${url.pathname}?time=${time}`, type: "video/mp4" })
                oldCurrentTime(0);
                player.player_.scrubbing_ = false;
                player.textTracks().tracks_.forEach(track => {
                    track.cues_.forEach(cue => {
                        cue.startTime = cue.startTime - (time - offset)
                        cue.endTime = cue.endTime - (time - offset)
                    })
                })
                offset = time
            }
            const curr = oldCurrentTime() + offset
            if (curr > 5 && ~~curr % 10 === 0 && ~~curr !== last) {
              last = ~~curr
              this.setStreamWatchTime({ id: this.stream.id, duration: last })
                .catch(() => console.log('failed to set watchtime'))
            }
            return curr
        }
        player.on("ready", () => {
            subtitles.forEach(({ src, lang: language, label }) => {
                player.addRemoteTextTrack({
                    kind: "captions",
                    src,
                    language,
                    label,
                }, true)
            })
          setTimeout(() => {
            if (player && this.stream && this.stream.resumeAt) {
              player.currentTime(this.stream.resumeAt)
            }
          }, 1000)
        })
        this.player = player
      },
    },
    async mounted() {
      try {
        if (!this.stream || this.stream.id !== this.$route.params.id) {
          await this.startStream({ id: this.$route.params.id })
        }
        this.currentResolution = this.stream.sources[0]
        this.startPlayer()
      } catch (error) {
          this.error = error
        }
    },
    beforeDestroy() {
      if (this.player !== undefined) {
        this.player.dispose()
      }
    }
  };
</script>

<style scoped>
.watch-title {
  color: #fff;
  font-weight: 600;
  font-size: 38px;
  margin-bottom: 20px;
}

.watch-player {
  width: 100%;
}
</style>
