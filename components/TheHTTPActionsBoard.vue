<template>
  <div class="app-http-actions-board">
    <h5>{{ title }}</h5>
    <TransitionGroup 
      name="list" 
      tag="div"
    >
      <div 
        v-for="action in httpActions"
        :key="action.count"
        :class="{
          alert: true,
          'app-http-alert': true,
          'alert-success': action.status === 201,
          'alert-danger': action.status >= 400,
          'alert-primary': action.status === 200,}"
      >
        <strong>{{ action.httpMethod }}</strong>
        <strong>{{ action.status }}</strong> 
        &emsp;&emsp; 
        {{ action.responseURL }}
      </div>
    </TransitionGroup>
  </div>
</template>
<script>
"use strict";
export default {
  name: "AppHttpActionsBoard",
  data: function() {
    return {
      title: "Trace actions",
      counter: 0,
    };
  },
  computed: {
    httpActions() {
      return this.$store.state.actionTracer.httpActionsList.map(v => v);
    },
  }
};
</script>
<style lang="scss">
.app-http-actions-board {
  z-index: 1;
  position: relative;
  border-radius: 0px;
  background: inherit;
  box-shadow: 1px 1px 2px 3px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  color: #ffffff;
  overflow: hidden;
  font-size: 0.8rem;
  &::before {
    content: "";
    z-index: -1;
    background: transparent url("~assets/main-background.jpg") right no-repeat;
    background-size: cover;
    filter: blur(30px);
    position: absolute;
    top: -35px;
    right: -35px;
    left: -35px;
    bottom: -35px;
    height: 120vh;
  }
}

.app-http-alert{
  text-align: start !important;
  opacity: 1;
  transition: all 0.5s;
}

.list-enter-active, .list-leave-active, .list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transition: all 0.5s;
}

</style>
