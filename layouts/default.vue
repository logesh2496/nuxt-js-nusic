<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="isUserSignedIn"
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="isUserSignedIn"
      />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <img v-if="userPicture !== ''" :src="userPicture" alt="" />
      <v-toolbar-title class="user-name" v-text="userName" />
      <v-btn v-if="!isUserSignedIn" @click.stop="signInUser"> Sign in </v-btn>
      <v-btn v-else @click.stop="signOutUser"> Sign Out </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import firebase from "firebase";
import "firebase/auth";

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Control",
          to: "/control",
        },
      ],
      right: true,
      rightDrawer: false,
      title: "Nusic mini",
      isUserSignedIn: false,
      userName: "" as string,
      userPicture: "" as string,
    };
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL } = user;
        if (displayName) {
          this.userName = displayName;
        }
        if (photoURL) {
          this.userPicture = photoURL;
        }
        this.isUserSignedIn = true;
      } else {
        this.userName = this.userPicture = "";
        this.isUserSignedIn = false;
      }
    });
  },
  methods: {
    async signInUser() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      try {
        const user = await firebase.auth().signInWithPopup(provider);
        this.isUserSignedIn = true;
      } catch (e) {
        this.isUserSignedIn = false;
      }
    },
    async signOutUser() {
      const respose = await firebase.auth().signOut();
    },
  },
};
</script>
<style scoped lang="scss">
.user-name {
  margin-right: 20px;
}
img {
  width: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>