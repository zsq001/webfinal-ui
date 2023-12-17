import './assets/main.css'

import  { createApp } from 'vue'
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import MainPage from "@/components/MainPage.vue";
import 'ant-design-vue/dist/reset.css';
import {createRouter, createWebHistory} from "vue-router";
import App from "./App.vue";
import 'mdui/mdui.css';
import 'mdui';
import ChatPage from "@/components/ChatPage.vue";
import PicturePage from "@/components/PicturePage.vue";
import AccountPage from "@/components/AccountPage.vue";
import ChatDetailPage from "@/components/ChatDetailPage.vue";

const routes = [
    { path: '/login', component: LoginPage },
    { path: '/chat', component: ChatPage },
    { path: '/chat/:id', component: ChatDetailPage},
    { path: '/pic', component: PicturePage},
    { path: '/pic/:id', component: PicturePage},
    { path: '/user', component: AccountPage},
    { path: '/user/:id', component: AccountPage},
    { path: '/register', component: RegisterPage },
    { path: '/', component: MainPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(async (to, from) => {
    if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated()) {
        return '/login'
    }
    if (to.path === '/login' && to.path !== '/register' && isAuthenticated()) {
        return '/'
    }
})

function isAuthenticated() {
    if (localStorage.getItem('token') != null) {
        return true
    }
}


const app = createApp(App)
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')