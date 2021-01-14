<template>
  <v-app>
    <v-app-bar app color="grey darken-2">
      <div class="d-flex align-center">
        <v-img
            :src="require('@/assets/logo.svg')"
            class="my-3"
            alt="logo"
            contain
            height="200"
        />
      </div>
    </v-app-bar>
    <v-main>
      <Projects/>
    </v-main>
  </v-app>
</template>

<script>
import Projects from "@/components/Projects";
export default {
  name: 'App',
  components: {Projects},
  data: () => ({
    //
  }),
};
</script>