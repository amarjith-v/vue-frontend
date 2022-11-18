<template>
  <div>
    <v-container fluid class="d-flex justify-center align-center">
      <v-flex xs12 sm8 md3>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field name="login" label="Username" :rules="emailRules" v-model="loginform.email" type="text">
              </v-text-field>
              <v-text-field id="password" name="password" :rules="passRules" v-model="loginform.password"
                label="Password" type="password">
              </v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit" to="/">Login</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
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
export default {
  name: 'LoginPage',
  data() {
    return {
      loginform: {
        email: '',
        password: ''
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be greater than 8 characters',
      ],
      text:'',
      snackbar: false
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate() == false) {
        return
      } else {
        const url = 'http://127.0.0.1:8000/api/user/login';
        await this.$http.post(url, this.loginform).then(res => {
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          this.$router.push("/dashboard");
        }).catch(err => {
          if (err.response) {
            if (err.response.status == 403) {
              this.snackbar = true
              this.text = 'username or password is incorrect';
            }
          } else {
            this.snackbar = true
            this.text = 'server error';
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.container {
  height: 100vh;
}
</style>