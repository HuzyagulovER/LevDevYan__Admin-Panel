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
import CoursesCreateEditDays from "@for-course-create/CoursesCreateEditDays.vue";

import IconHome from "../components/add-comps/icons/IconHome.vue";
import IconCourses from "../components/add-comps/icons/IconCourses.vue";
import IconPromocodes from "../components/add-comps/icons/IconPromocodes.vue";
import IconNotifications from "../components/add-comps/icons/IconNotifications.vue";
import { Component } from 'vue';
import { Store } from '../stores/store';
import { ReturnedError, ReturnedData } from '../../helpers';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

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
		path: '/courses/create-edit/:courseId',
		component: ViewCoursesCreateEdit,
		children: [
			{
				path: 'about',
				name: "CoursesCourseCreate",
				component: CoursesCreateEditAbout,
			},
			{
				path: 'days',
				name: "CoursesCourseDays",
				component: CoursesCreateEditDays,
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
	// {
	// 	path: "/:pathMatch(.*)*",
	// 	name: "NotFound",
	// 	redirect: {
	// 		name: "Main",
	// 	},
	// },
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

router.beforeEach(async (to, from, next) => {
	try {
		const store = Store()

		if (!cookies.get("session_token")) {
			if (to.path !== '/sign-in') {
				next({ path: '/sign-in' })
				return
			}
			next()
		}

		if (cookies.get("session_token")) {
			await store.checkSessionToken().then(
				(r: ReturnedError | ReturnedData) => {
					let title = <HTMLElement>document.querySelector('head title')
					title.innerText = <string>(to.meta.title || default_title)

					if (!r.success) {
						throw new Error(r.error.status);
					}
					if (!r.data.is_valid) {
						cookies.remove("session_token")
						next({ path: '/sign-in' })
						return
					}
					if (to.path === '/sign-in') {
						next({ path: '/' })
					} else {
						next()
					}
				}
			)
		}
	} catch (error) {
		console.log(error);
		// next({ path: '/sign-in' })
	}
})

export default router