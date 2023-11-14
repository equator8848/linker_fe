import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Index from '@/views/Index.vue'
import Boarding from '@/views/Boarding.vue'
import Help from '@/views/Help.vue'
import InnerHelp from '@/views/Help.vue'
import WorkOrder from '@/views/WorkOrder.vue'
import Intro from '@/views/Intro.vue'
import Home from '@/views/Home.vue'
import ImageMarket from '@/views/ImageMarket.vue'
import InstanceList from '@/views/InstanceList.vue'
import InstanceVolumeList from '@/views/InstanceVolumeList.vue'
import InstanceCreate from '@/views/InstanceCreate.vue'
import ProjectOps from '@/views/ProjectOps.vue'
import Dashboard from '@/views/Dashboard.vue'
import OperationHistory from '@/views/OperationHistory.vue'
import Me from '@/views/Me.vue'
import LoginByToken from '@/views/LoginByToken.vue'

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
            {
                path: '/loginByToken/:token',
                name: 'LoginByToken',
                component: LoginByToken
            },
        ]
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/home/dashboard',
        children: [
            {
                path: '/home/dashboard',
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: '/home/imageMarket',
                name: 'ImageMarket',
                component: ImageMarket
            },
            {
                path: '/home/help',
                name: 'HelpInner',
                component: InnerHelp
            },
            {
                path: '/home/workOrder',
                name: 'WorkOrder',
                component: WorkOrder
            },
            {
                path: '/home/instanceList',
                name: 'InstanceList',
                component: InstanceList
            },
            {
                path: '/home/instanceVolumeList',
                name: 'InstanceVolumeList',
                component: InstanceVolumeList
            },
            {
                path: '/home/instanceCreate/:imageId',
                name: 'InstanceCreate',
                component: InstanceCreate
            },
            {
                path: '/home/projectOps/:projectId?',
                name: 'ProjectOps',
                component: ProjectOps
            },
            {
                path: '/home/operationHistory',
                name: 'OperationHistory',
                component: OperationHistory
            },
            {
                path: '/home/me',
                name: 'Me',
                component: Me
            }
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
