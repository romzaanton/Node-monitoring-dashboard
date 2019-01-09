<template>
  <nav class="app-dashboard-navbar navbar navbar-light bg-dark d-xl-none d-lg-none d-md-flex d-sm-flex d-flex align-items-center p-0">
    <a 
      class="navbar-brand" 
      href="#"
    >
      <img 
        src="~assets/node-logo-sm.png"
        alt="logo"
      >
    </a>
    <AppFeatherIcon 
      name="menu" 
      current-color="#fafafa" 
      class="mr-1"
    />
  </nav>
</template>
<script>
import AppFeatherIcon from '~/components/BaseIcon'
export default {
    name: 'AppDashboardNavbar',
    components: {
        AppFeatherIcon,
    },
    mounted() {
    },
}
</script>
<style lang="scss">
$navbarHeight: 40px;

.app-dashboard-navbar {
    height: $navbarHeight;
    img {
        width: $navbarHeight;
        height: $navbarHeight;
    }
}
</style>


