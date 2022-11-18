<template>
    <v-card color="grey lighten-4" flat tile>
        <v-toolbar dense fixed>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>Welcome <b>{{ title }}</b></v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn @click="logout">
                Logout
            </v-btn>
        </v-toolbar>
    </v-card>
</template>
<script>
export default {
    name: 'HeaderPage',
    props: {
        title: String
    },
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push("/");
        }
    }
}
</script>

<style>

</style>