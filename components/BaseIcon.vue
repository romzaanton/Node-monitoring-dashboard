<template>
  <span class="app-icon">
    <svg 
      v-if="name === 'circle'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle 
        cx="12"
        cy="12"
        r="10"
      />
    </svg>
    <svg 
      v-if="name === 'circle-small'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle 
        cx="6"
        cy="6"
        r="5"
      />
    </svg>
    <svg
      v-else-if="name === 'arrow-up'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line 
        x1="12"
        y1="19"
        x2="12"
        y2="5"
      />
      <polyline points="5 12 12 5 19 12" />
    </svg>
    <svg
      v-else-if="name === 'arrow-down'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line 
        x1="12"
        y1="5"
        x2="12"
        y2="19"
      />
      <polyline points="19 12 12 19 5 12" />
    </svg>
    <svg
      v-else-if="name === 'chevron-up'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
    <svg
      v-else-if="name === 'chevrons-up'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="17 11 12 6 7 11" />
      <polyline points="17 18 12 13 7 18" />
    </svg>
    <svg
      v-else-if="name === 'cpu'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect 
        x="4" 
        y="4" 
        width="16" 
        height="16" 
        rx="2" 
        ry="2"
      />
      <rect 
        x="9" 
        y="9" 
        width="6" 
        height="6"
      />
      <line 
        x1="9" 
        y1="1" 
        x2="9" 
        y2="4"
      />
      <line 
        x1="15" 
        y1="1" 
        x2="15" 
        y2="4"
      />
      <line 
        x1="9" 
        y1="20" 
        x2="9" 
        y2="23"
      />
      <line 
        x1="15" 
        y1="20" 
        x2="15" 
        y2="23"
      />
      <line 
        x1="20" 
        y1="9" 
        x2="23" 
        y2="9"
      />
      <line 
        x1="20" 
        y1="14" 
        x2="23" 
        y2="14"
      />
      <line 
        x1="1" 
        y1="9" 
        x2="4" 
        y2="9"
      />
      <line 
        x1="1" 
        y1="14" 
        x2="4" 
        y2="14" 
      />
    </svg>
    <svg
      v-else-if="name === 'layers'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
    <svg
      v-else-if="name === 'menu'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line 
        x1="3" 
        y1="12" 
        x2="21" 
        y2="12"
      />
      <line 
        x1="3" 
        y1="6" 
        x2="21" 
        y2="6"
      />
      <line 
        x1="3" 
        y1="18" 
        x2="21" 
        y2="18"
      />
    </svg>
    <svg
      v-else-if="name === 'monitor'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect 
        x="2" 
        y="3"
        width="20"
        height="14"
        rx="2"
        ry="2"
      />
      <line
        x1="8" 
        y1="21" 
        x2="16" 
        y2="21"
      />
      <line 
        x1="12" 
        y1="17" 
        x2="12" 
        y2="21"
      />
    </svg>
    <svg
      v-else-if="name === 'activity'"
      :stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  </span>
</template>
<script>
import * as feather from "feather-icons";
export default {
  name: "AppFeatherIcon",
  props: {
    name: {
      type: String,
      default: "circle"
    },
    currentColor: {
        type: String,
        default: '#212121'
    }
  },
};
</script>
<style lang="scss" scoped>
.app-icon {
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
}
</style>
