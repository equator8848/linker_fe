import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Index from '@/views/Index.vue'
import Boarding from '@/views/Boarding.vue'
import Help from '@/views/Help.vue'
import Intro from '@/views/Intro.vue'
import Home from '@/views/Home.vue'
import ProjectOps from '@/views/ProjectOps.vue'
import Link from '@/views/Link.vue'
import Me from '@/views/Me.vue'
import AdminHome from '@/views/admin/AdminHome'
import DashboardStatistics from '@/views/admin/DashboardStatistics'
import AppSetting from '@/views/admin/AppSetting'
import LoginLogList from '@/views/admin/LoginLogList'
import UserList from '@/views/admin/UserList'
import UserDetails from '@/views/admin/UserDetails'
import ProjectList from '@/views/admin/ProjectList'
import ProjectDetails from '@/views/admin/ProjectDetails'

import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        redirect: '/intro',
        children: [
            {
                path: '/intro',
                name: 'Intro',
                component: Intro
            },
            {
                path: '/help',
                name: 'Help',
                component: Help
            },
            {
                path: '/boarding',
                name: 'Boarding',
                component: Boarding
            },
        ]
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/home/link',
        children: [
            {
                path: '/home/link',
                name: 'Link',
                component: Link
            },
            {
                path: '/home/projectOps/:projectId?',
                name: 'ProjectOps',
                component: ProjectOps
            },
            {
                path: '/home/me',
                name: 'Me',
                component: Me
            }
        ]
    },
    {
        path: '/admin',
        name: 'AdminHome',
        component: AdminHome,
        redirect: '/admin/dashboard',
        children: [
            {
                path: '/admin/dashboard',
                name: 'DashboardStatistics',
                component: DashboardStatistics
            },
            {
                path: '/admin/userList',
                name: 'UserList',
                component: UserList
            },
            {
                path: '/admin/userDetails/:uid',
                name: 'UserDetails',
                component: UserDetails
            },
            {
                path: '/admin/appSetting',
                name: 'AppSetting',
                component: AppSetting
            },
            {
                path: '/admin/loginLogList',
                name: 'LoginLogList',
                component: LoginLogList
            },
            {
                path: '/admin/projectList',
                name: 'ProjectList',
                component: ProjectList
            },
            {
                path: '/admin/projectDetails/:projectId',
                name: 'projectDetails',
                component: ProjectDetails
            },
        ]
    },
    {
        path: '/notfound',
        component: () => import('../views/NotFound')
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/notfound'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const anonymousPages = new Set(["Boarding", "Help", "Intro", "StatusCheck", "LoginByToken"])

// 全局路由守卫
router.beforeEach((to, from, next) => {
    if (anonymousPages.has(<string>to.name)) {
        next();
    }
    const token = store.getters['token'];
    if (!token) {
        // 跳转到登录页面
        next({name: "Boarding"});
        return;
    }
    const expiredAt = store.getters['expiredAt'];
    if (Number(Date.now()) > Number(expiredAt)) {
        console.log("token已过期，请重新登录");
        next({name: "Boarding"});
        return;
    }
    next();
});

export default router
