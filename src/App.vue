<template>
  <header>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
  </header>
    <div style="position: relative">
    <mdui-navigation-rail contained>
      <mdui-navigation-rail-item v-if="isAuthenticated" icon="insert_photo--outlined" value="Picture" @click="picture">Picture</mdui-navigation-rail-item>
      <mdui-navigation-rail-item v-if="isAuthenticated" icon="message--outlined" value="Chat" @click="chat">Chat</mdui-navigation-rail-item>
      <mdui-navigation-rail-item icon="assignment_ind" value="Account" @click="account">Account</mdui-navigation-rail-item>
    </mdui-navigation-rail>
    <div style="overflow: auto">
      <router-view :nowUser="userName" :nowUserId="userId"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: '',
      userId: '',
      userName : ''
    };
  },
  methods: {
    isAuthenticated() {
      return localStorage.getItem('token') != null;
    },
    changeUserName(newName) {
      this.userName = newName;
    },
    picture() {
      return this.$router.push('/pic');
    },
    chat() {
      return this.$router.push('/chat');
    },
    account() {
      return this.$router.push('/');
    },
    async getUserId(){
      try {
        const response = await fetch('http://localhost:8080/api/v1/user/whoami', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.data) {
          this.userId = data.data;
        } else {
          this.errorMessage = data.error;
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async GetUserName(userId){
      try {
        const response = await fetch(`http://localhost:8080/api/v1/user/info/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.data) {
          this.userName = data.data.name;

        } else {
          this.errorMessage = data.error;
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  },
  async created() {
    await this.getUserId();
    await this.GetUserName(this.userId);
  }
}
</script>