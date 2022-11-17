<template>
  <div>
    <Header :title="user"></Header>
    <v-container>
      <template>
        <v-card v-for="order in orders" :key="order.id" class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                {{order.status}}
              </div>
              <v-list-item-title class="text-h5 mb-1">
                Headline 5
              </v-list-item-title>
              <v-list-item-subtitle>{{order.delivery_address}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          </v-list-item>

          <!-- <v-card-actions>
            <v-btn outlined rounded text>
              Button
            </v-btn>
          </v-card-actions> -->
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
export default {
  name: 'DashboardPage',
  components: { Header },
  data() {
    return {
      user: '',
      orders: []
    }
  },
  created() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      const user = JSON.parse(localStorage.getItem('userInfo'))
      this.user = user.data.user.name
      const config = {
        headers: { Authorization: `Bearer ${user.data.token}` }
      };
      const url = 'http://127.0.0.1:8000/api/view/status';
      await this.$http.get(url,config).then(res => {
        this.orders = res.data.data.order
        console.log(this.orders)
      }).catch(err => {
        if (err.response) {
          console.log(err.response)
        } else {
          // TODO with toast
          console.log("server error")
        }
      })
    }
  }
}
</script>

<style>

</style>