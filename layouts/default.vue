<template>
  <div class="app-main-layout mw-100 h-100">
    <Transition
      name="fade"
      mode="in-out"
    >
      <nuxt />
    </Transition>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  overflow: hidden;
}
.app-main-layout {
  background: transparent url('~assets/main-background.jpg') center no-repeat;
  background-size: cover;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
