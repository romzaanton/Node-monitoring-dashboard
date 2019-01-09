<template>
  <section class="container mx-0 mw-100 px-0">
    <div 
      class="app-login-container d-flex justify-content-sm-center"
    >
      <AppLoginFrom class="col flex-grow-1 m-2 p-2 align-self-center" />
      <AppHttpActionsBoard class="app-http-actions-board col flex-grow-1 m-0 shadow" />
    </div>
  </section>
</template>

<script>
import AppLoginFrom from "~/components/BaseLoginForm.vue";
import AppHttpActionsBoard from "~/components/TheHTTPActionsBoard.vue";

export default {
  components: {
    AppLoginFrom,
    AppHttpActionsBoard
  }
};
</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.app-http-actions-board {
  height: 100vh;
}
.app-login-container {
  width: 100vw;
}
</style>

