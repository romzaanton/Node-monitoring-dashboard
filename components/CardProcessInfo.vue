<template>
  <div class="card shadow rounded">
    <div class="card-body d-flex flex-column justify-content-start">
      <h6 class="card-title text-uppercase text-muted">
        <strong>PID: </strong>{{ process ? process.pid : '' }}
        <strong 
          v-if="process.isMaster" 
          class="text-monospace"
        >
          (master)
        </strong>
      </h6>
      <div class="mb-3">
        <small class="text-monospace">
          {{ `https://${process.host}:${process.port}` }}
        </small>
      </div>
      <div class="d-flex justify-content-between mw-100 align-items-center">
        <AppFeatherIcon 
          name="arrow-up"
          current-color="#00701a"
          class="flex-grow-0"
        />
        <span class="card-text flex-grow-1 ml-4">
          Requests per second
        </span>
        <span class="card-text flex-grow-0">
          500 <small class="text-monospace">
            .rps
          </small>
        </span>
      </div>
      <span class="border-bottom mb-1 mt-1" />
      <div class="d-flex justify-content-between mw-100 align-items-center">
        <AppFeatherIcon 
          name="chevrons-up"
          current-color="#00701a"
          class="flex-grow-0"
        />
        <span class="card-text flex-grow-1 ml-4">
          Total traffic
        </span>
        <span class="ccard-text flex-grow-0">
          {{ totalTraffic }} <small class="text-monospace">
            .kb
          </small>
        </span>
      </div>
      <span class="border-bottom mb-1 mt-1" />
      <div class="d-flex justify-content-between mw-100 align-items-center">
        <AppFeatherIcon 
          name="cpu"
          current-color="#0d47a1"
          class="flex-grow-0"
        />
        <span class="card-text flex-grow-1 ml-4">
          CPU usage
        </span>
        <span class="ccard-text flex-grow-0">
          {{ cpuUsage }} <small class="text-monospace">
            %
          </small>
        </span>
      </div>
      <span class="border-bottom mb-1 mt-1" />
      <div class="d-flex justify-content-between mw-100 align-items-center">
        <AppFeatherIcon 
          name="layers"
          current-color="#0d47a1"
          class="flex-grow-0" 
        />
        <span class="card-text flex-grow-1 ml-4">
          Memory usage
        </span>
        <span class="ccard-text flex-grow-0">
          {{ memoryUsage }} <small class="text-monospace">
            .mb
          </small>
        </span>
      </div>
    </div>
    <div class="card-footer d-flex flex-sm-column flex-md-column flex-lg-row flex-xl-row justify-content-md-start justify-content-sm-start">
      <button
        :class="['btn', 'btn-outline-danger', 'btn-sm', 'm-1', 'd-flex', 'justify-content-between', cpuMonitorActive ? 'app-active-monitor-button' : '']" 
        type="button"
        @click="startProcessObserving"
      >
        <span>Live observing</span>
        <AppFeatherIcon
          :class="['flex-grow-0', 'ml-2', cpuMonitorActive ? 'active-button-circle' : '']" 
          name="circle-small"
          current-color="#b71c1c"
        />
      </button>
      <button 
        type="button" 
        class="btn btn-outline-secondary btn-sm m-1"
      >
        CPU stat
      </button>
      <button 
        type="button" 
        class="btn btn-outline-secondary btn-sm m-1"
      >
        RAM stat
      </button>
    </div>
  </div>
</template>
<script>
import AppFeatherIcon from './BaseIcon'

export default {
    name: 'AppProcessInfoCard',
    components: {
        AppFeatherIcon,
    },
    props: {
      process: {
        type: Object,
        default: () => {},
      }
    },
    data: function() {
        return {
            processPid: '17289',
            serverMonitoringObservable: undefined,
            cpuMonitorActive: false,
        }
    },
    computed: {
      totalTraffic() {
        return ((this.process.bytesRead + this.process.bytesWritten)/1024).toFixed(2);
      },
      memoryUsage() {
        return (this.process.rss/1000000).toFixed(2);
      },
      cpuUsage() {
        return this.process.cpuAdjustmentRate ? this.process.cpuAdjustmentRate.toFixed(2) : 0;
      }
    },
    methods: {
      startProcessObserving() {
        
      }
    }
}
</script>
<style lang="scss">
.app-active-monitor-button {
  animation:  button-animation-red 2s infinite ease-in-out;
}
@keyframes button-animation-red {
    0% {
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
    }
    50% {
      box-shadow: 0 0 0 0.4rem rgba(255, 174, 182, 0.5);
    }
    100% {
      box-shadow: 0 0 0 0.6rem rgba(255, 221, 225, 0.5);
    }
}
.active-button-circle circle {
  animation: button-icon-animation 2s infinite ease-in-out;
}
@keyframes button-icon-animation {
    0% {
      r: 1px;
    }
    50% {
      r: 5px;
    }
    100% {
      r: 10px;
    }
}
</style>
