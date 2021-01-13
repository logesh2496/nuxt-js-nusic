<template>
  <div>Welcome to Nusic mini</div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";
import firebase from "firebase";
import "firebase/auth";

export default {
  components: {
    Logo,
    VuetifyLogo,
  },
};
</script>
