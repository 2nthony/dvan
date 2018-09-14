<template>
  <transition name="sw-update-popup">
    <div v-if="enabled" class="sw-update-popup">
      {{ message }}<br>
      <button @click="reload">{{ buttonText }}</button>
    </div>
  </transition>
</template>

<script>
import SWUpdateEvent from './sw-update-event'

export default {
  props: {
    SWRegistration: {
      type: Object,
      default: null
    }
  },

  computed: {
    SWUpdateEvent () {
      return new SWUpdateEvent(this.SWRegistration)
    },

    enabled () {
      return Boolean(this.SWRegistration)
    }
  },

  data () {
    const opts = __PWA_OPTIONS__

    return {
      message: opts.updateText,
      buttonText: opts.updateButtonText
    }
  },

  methods: {
    reload () {
      if (this.SWUpdateEvent) {
        this.SWUpdateEvent.skipWaiting()
          .then(() => location.reload(true))
        this.SWUpdateEvent = null
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.sw-update-popup
  position fixed
  right 1em
  bottom 1em
  padding 1em
  border-radius 4px
  background #fff
  box-shadow 0 4px 16px rgba(0, 0, 0, 0.5)
  text-align center

  button
    margin-top 0.5em
    padding 0.25em 2em

.sw-update-popup-enter-active, .sw-update-popup-leave-active
  transition opacity 0.3s, transform 0.3s

.sw-update-popup-enter, .sw-update-popup-leave-to
  opacity 0
  transform translate(0, 50%) scale(0.5)
</style>
