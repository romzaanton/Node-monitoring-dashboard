<template>
  <section class="app-dashboard-container container mx-0 mw-100 px-0 align-items-stretch">
    <div class="app-dashboard-content d-flex flex-row h-100 w-100">
      <AppDashboardSidebar />
      <div
        class="app-dashboard-main-section col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12 p-0 bg-light text-dark flex-grow-1"
      >
        <AppDashboardNavbar />
        <div
          class="app-dashboard-title-section d-flex flex-row align-items-stretch m-1 mt-2 shadow"
        >
          <AppFeatherIcon
            name="activity"
            current-color="#00701a"
            class="m-3"
          />
          <blockquote class="app-dashboard-title-bar blockquote m-2">
            <h6 class="mb-0 text-uppercase">
              Node.js dashboard
            </h6>
            <footer class="blockquote-footer text-left">
              <small>{{ subtitle }}</small>
            </footer>
          </blockquote>
        </div>
        <div
          class="app-dashboard-control-buttons-section d-flex flex-row align-items-center m-1 mt-3 shadow"
        >
          <span class="h6 m-2">
            Node.js monitoring:
          </span>
          <button
            type="button"
            class="btn btn-outline-success m-2 btn-sm w-25"
            @click="startProcessMonitroing"
          >
            Start
          </button>
          <button
            type="button"
            class="btn btn-outline-danger m-2 btn-sm w-25"
            @click="stopProcessMonitroing"
          >
            Stop
          </button>
        </div>
        <div class="app-dashboard-processes-info row p-1">
          <div
            v-for="process in processesData"
            :key="process.pid"
            class="app-dashboard-process-info col-xl-6 col-md-6 col-sm-6 col-12 mb-sm-1 mb-1"
          >
            <AppProcessInfoCard :process="process" />
          </div>
        </div>
        <div class="app-dashboard-process-chart m-1 shadow border rounded row">
          <div
            class="d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-column flex-column justify-content-between col-12 m-0 p-0"
          />
          <AppProcessInfoDahsboard v-if="processInMonitoring" />
          <div class="card m-1">
            <h6 class="card-header">
              OS-CPU utilization
            </h6>
            <div class="card-body">
              <AppCpuUtilChartLine class="m-1 p-0" />
            </div>
          </div>
          <div class="card m-1">
            <h6 class="card-header">
              OS-MEM utilization
            </h6>
            <div class="card-body">
              <AppChartRadar
                :externalid="'app-main-dashboard-mem-radar-chart'"
                class="m-1 p-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppProcessInfoCard from "~/components/ProcessInfoCard";
import AppFeatherIcon from "~/components/BaseIcon";
import AppCpuUtilChartLine from "~/components/ChartLineCPUUtilization";
import AppDashboardSidebar from "~/components/DashboardSidebar";
import AppDashboardNavbar from "~/components/DashboardNavbar";
import AppProcessInfoDahsboard from "~/components/ProcessInfoDashboard";
import AppChartRadar from "~/components/ChartRadar";

export default {
  name: "AppDashboard",
  components: {
    AppProcessInfoCard,
    AppCpuUtilChartLine,
    AppDashboardSidebar,
    AppDashboardNavbar,
    AppFeatherIcon,
    AppProcessInfoDahsboard,
    AppChartRadar,
  },
  data: function() {
    return {
      subtitle: ""
    };
  },
  computed: {
    dashboardSubTitel() {
      return this.subtitle;
    },
    processesData() {
      return this.$store.state.logger["process-node"];
    },
    processInMonitoring() {
      return this.$store.state.logger.processInMonitoring;
    },
  },
  mounted() {
    this.subtitle = `Process's at run on ${window.location.origin}`;
  },
  methods: {
    startProcessMonitroing(ev) {
      this.$store.dispatch("logger/createWebSocket").then(res => {
        this.$store.dispatch("logger/startProcessesMonitoring");
      });
    },
    stopProcessMonitroing(ev) {
      this.$store.dispatch("logger/stopProcessesMonitoring");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-dashboard-container {
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  background: #ffffff;
}
</style>


