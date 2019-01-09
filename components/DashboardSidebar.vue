<template>
  <div class="app-dashboard-sidebar col-xl-2 col-lg-2 col-md-0 col-sm-0 col-0 p-0 text-white d-xl-block d-lg-block d-md-none d-sm-none d-none">
    <section class="app-dashboard-logo" />
  </div>
</template>
<script>

const sideBarItems = [
  {
    title: 'Dashboard',
    icon: 'monitor' ,
    subitems: [],
  },
  {
    title: 'Logs',
    icon: '',
    subitems: [],
  }
];

export default {
    name: 'AppDashboardSidebar',
    data: function() {
      return {
        sideBarItems
      };
    },
}
</script>

<style lang="scss">
.app-dashboard-sidebar {
  background-color: #263544;
}
.app-dashboard-logo {
  background: url("~assets/node-logo.png") left no-repeat;
  background-size: 50%;
  width: 100%;
  height: 5%;
  margin: 10px 10px 0px 0px;
}
@media (max-width: 920px) {
  .app-dashboard-logo {
    background: url("~assets/node-logo.png") center no-repeat;
    background-size: 80%;
    width: 80%;
    height: 5%;
  }
}
@media (max-width: 768px) {
  .app-dashboard-logo {
    background: url("~assets/node-logo-sm.png") center no-repeat;
    background-size: 80%;
  }
}
</style>

