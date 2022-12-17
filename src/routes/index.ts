import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ViewSignIn from "../views/ViewSignIn.vue";
import ViewMain from "../views/ViewMain.vue";
import ViewCourses from "../views/ViewCourses.vue";
import ViewCoursesCreateEdit from "../views/ViewCoursesCreateEdit.vue";
import ViewPromocodes from "../views/ViewPromocodes.vue";
import ViewPromocodesCreate from "../views/ViewPromocodesCreate.vue";
import ViewNotifications from "../views/ViewNotifications.vue";
import ViewNotificationsCreate from "../views/ViewNotificationsCreate.vue";
import CoursesCreateEditAbout from "@for-course-create/CoursesCreateEditAbout.vue";
import CoursesCreateEditProgram from "@for-course-create/CoursesCreateEditProgram.vue";

import IconHome from "../components/add-comps/icons/IconHome.vue";
import IconCourses from "../components/add-comps/icons/IconCourses.vue";
import IconPromocodes from "../components/add-comps/icons/IconPromocodes.vue";
import IconNotifications from "../components/add-comps/icons/IconNotifications.vue";
import { Component } from 'vue';

const default_title: string = 'Личный кабинет'

interface Meta {
	title: string,
	nav_icon?: Component,
	nav_title?: string
}

type RouteRecordRawWithMeta = RouteRecordRaw | RouteRecordRaw & {
	meta: Meta
}

const routes: Array<RouteRecordRawWithMeta> = [
	{
		path: "/",
		name: "Main",
		component: ViewMain,
		meta: {
			title: "Главная",
			nav_icon: IconHome,
			nav_title: 'Главная'
		}
	},
	{
		path: "/courses",
		name: "Courses",
		component: ViewCourses,
		meta: {
			title: "Все курсы",
			nav_icon: IconCourses,
			nav_title: 'Курсы'
		},
	},
	{
		path: '/courses/create-edit/:id',
		component: ViewCoursesCreateEdit,
		children: [
			{
				path: 'about',
				name: "CoursesCourseCreate",
				component: CoursesCreateEditAbout,
			},
			{
				path: 'program',
				name: "CoursesCourseProgram",
				component: CoursesCreateEditProgram,
			},
		]
	},
	{
		path: "/promocodes",
		name: "Promocodes",
		component: ViewPromocodes,
		meta: {
			title: "Все промокоды",
			nav_icon: IconPromocodes,
			nav_title: 'Промокоды'
		}
	},
	{
		path: '/promocodes/create',
		name: "PromocodesCreate",
		component: ViewPromocodesCreate,
		meta: {
			title: "Создание промокода"
		},
	},
	{
		path: "/notifications",
		name: "Notifications",
		component: ViewNotifications,
		meta: {
			title: "Все уведомления",
			nav_icon: IconNotifications,
			nav_title: 'Уведомления'
		},
	},
	{
		path: '/notifications/create',
		name: "NotificationsCreate",
		component: ViewNotificationsCreate,
		meta: {
			title: "Создание уведомления"
		},
	},
	{
		path: '/sign-in',
		name: "SignIn",
		component: ViewSignIn,
	},
]

const router = createRouter({
	history: createWebHistory('/'),
	scrollBehavior: function (to, from, savedPosition) {
		if (to.hash) {
			return { el: to.hash, behavior: 'smooth', }
		} else if (savedPosition) {
			return savedPosition
		} else {
			return { left: 0, top: 0 }
		}
	},
	routes
})

router.beforeEach((to, from, next) => {
	let title = <HTMLElement>document.querySelector('head title')
	title.innerText = <string>(to.meta.title || default_title)
	next()
})

export default router