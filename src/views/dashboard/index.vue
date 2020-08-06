<template>
  <div class="dashboard-container">
    <img class="homebg" src="@/assets/home-bg.png" alt="bg">
    <!-- <component :is="currentRole" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
// import AdminDashboard from './admin/index.vue'
// import EditorDashboard from './editor/index.vue'

@Component({
  name: 'Dashboard',
  components: {
    // AdminDashboard,
    // EditorDashboard
  }
})
export default class extends Vue {
  private currentRole = 'admin-dashboard'

  get roles() {
    return UserModule.roles
  }

  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editor-dashboard'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  text-align: center;
  .homebg {
    position: relative;
    top: 200px;
    width: 400px;
    height: 400px;
  }
}

</style>
