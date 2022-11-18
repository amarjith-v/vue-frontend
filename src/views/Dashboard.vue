<template>
  <div>
    <Header :title="user"></Header>
    <v-container v-if="!createOrderTable" class="mt-4">
      <div class="d-flex justify-space-between">
        <h3>ORDERS</h3>
        <v-btn v-if="userInfo.data.user.role_id == 1" elevation="2" @click="createOrderTable = true" class="mr-3" fab>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <v-row no-gutters v-if="orders.length > 0">
        <v-col cols="6" v-for="order in orders" :key="order.id">
          <v-card elevation="6" class="mx-auto mr-3 mt-3" outlined>
            <v-row>
              <v-col>
                <v-card-text>
                  <v-chip :color="color(order.status)">{{
                      order.status
                  }}</v-chip>
                </v-card-text>
              </v-col>
              <v-col class="mt-4 d-flex justify-end" v-if="userInfo.data.user.role_id == 2">
                <div class="d-flex justify-end mb-2 mr-2">
                  <v-btn small @click="selectOrder(order.id)">
                    {{ getAction(order.status) }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-list-item-title class="font-weight-medium mb-1" v-if="order.name">
              Order {{ order.status }} by {{ order.name }}
            </v-list-item-title>
            <v-list-item three-line>
              <v-list-item-content>
                <p class="font-weight-bold text-uppercase mb-4">
                  {{ order.item_name }}
                </p>
                <v-list-item-subtitle>
                  <p class="font-weight-medium">
                    Pickup:{{ order.pickup_address }}
                  </p>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <p class="font-weight-medium">
                    Delivery:{{ order.delivery_address }}
                  </p>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
      <div v-else>
        <p class="d-flex justify-center">There are no orders to show..</p>
      </div>
    </v-container>
    <v-container v-else class="mt-4">
      <div class="d-flex justify-space-between">
        <h3>CREATE ORDERS</h3>
        <v-btn @click="createOrderTable = false" class="mr-3">
          Back to Orders
        </v-btn>
      </div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="form.item_name" :counter="10" :rules="itemRules" label="Item Name" required>
        </v-text-field>

        <v-text-field v-model="form.pickup_address" :rules="pickup_addressRules" label="Pickup Address" required>
        </v-text-field>

        <v-text-field v-model="form.delivery_address" :rules="delivery_addressRules" label="Delivery Address" required>
        </v-text-field>

        <v-btn color="success" class="mr-4" @click="onSubmit"> Create </v-btn>
      </v-form>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout" tile>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
export default {
  name: "DashboardPage",
  components: { Header },
  data() {
    return {
      valid: true,
      user: "",
      orders: [],
      createOrderTable: false,
      form: {
        item_name: "",
        pickup_address: "",
        delivery_address: "",
      },
      itemRules: [
        (v) => !!v || "Name is required",
        (v) =>
          (v && v.length >= 3) || "Item Name must be greater than 3 characters",
      ],
      pickup_addressRules: [
        (v) => !!v || "Pickup Address is required",
        (v) =>
          (v && v.length >= 3) ||
          "Pickup Address must be greater than 5 characters",
      ],
      delivery_addressRules: [
        (v) => !!v || "Delivery Address is required",
        (v) =>
          (v && v.length >= 3) ||
          "Delivery Address must be greater than 5 characters",
      ],
      snackbar: false,
      text: "",
      timeout: 2000,
      userInfo: "",
    };
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.userInfo.data.user.role_id == 1) {
      this.getOrders();
    } else {
      this.getOrderList();
      this.getAction();
    }
  },
  methods: {
    async getOrders() {
      this.user = this.userInfo.data.user.name;
      const config = {
        headers: { Authorization: `Bearer ${this.userInfo.data.token}` },
      };
      const url = "http://127.0.0.1:8000/api/view/status";
      await this.$http
        .get(url, config)
        .then((res) => {
          this.orders = res.data.data.order;
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          } else {
            // TODO with toast
            console.log("server error");
          }
        });
    },
    async getOrderList() {
      this.user = this.userInfo.data.user.name;
      const config = {
        headers: { Authorization: `Bearer ${this.userInfo.data.token}` },
      };
      const url = "http://127.0.0.1:8000/api/orders";
      await this.$http
        .get(url, config)
        .then((res) => {
          this.orders = res.data.data.order;
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          } else {
            // TODO with toast
            console.log("server error");
          }
        });
    },
    color(status) {
      if (status == "selected") {
        return "#7FFFD4";
      } else if (status == "pending") {
        return "#FFD700";
      } else if (status == "picked") {
        return "#6B8E23";
      } else {
        return "#32CD32";
      }
    },
    getAction(status) {
      if (status == "pending") {
        return "Select";
      } else if (status == "selected") {
        return "pick";
      } else if (status == "picked") {
        return "pick";
      }
    },
    async selectOrder(){
      
    },
    async onSubmit() {
      if (this.$refs.form.validate() == false) {
        return;
      } else {
        const config = {
          headers: { Authorization: `Bearer ${this.userInfo.data.token}` },
        };
        const url = "http://127.0.0.1:8000/api/place/order";
        await this.$http
          .post(url, this.form, config)
          .then((res) => {
            this.text = res.data.message;
            this.snackbar = true;
            this.getOrders();
            this.$refs.form.reset();
            this.createOrderTable = false;
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            } else {
              // TODO with toast
              console.log("server error");
            }
          });
      }
    },
  },
};
</script>
<style scoped>

</style>