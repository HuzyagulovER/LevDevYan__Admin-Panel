import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ViewSignIn from "@views/ViewSignIn.vue";
import ViewMain from "@views/ViewMain.vue";
import ViewCourses from "@views/ViewCourses.vue";
import ViewCoursesCreateEdit from "@views/ViewCoursesCreateEdit.vue";
import ViewPromocodes from "@views/ViewPromocodes.vue";
import ViewPromocodesCreate from "@views/ViewPromocodesCreate.vue";
import ViewNotifications from "@views/ViewNotifications.vue";
import ViewTextContent from "@views/ViewTextContent.vue";
import ViewSubscriptions from "@views/ViewSubscriptions.vue";
import ViewUsers from "@views/ViewUsers.vue";
import ViewSystem from "@views/ViewSystem.vue";

import ViewNotificationsCreateEdit from "@views/ViewNotificationsCreateEdit.vue";
import CoursesCreateEditAbout from "@for-course-create/CoursesCreateEditAbout.vue";
import CoursesCreateEditDays from "@for-course-create/CoursesCreateEditDays.vue";
import ViewTextContentCreateEdit from "@views/ViewTextContentCreateEdit.vue";
import ViewSubscriptionEdit from "@views/ViewSubscriptionEdit.vue";

import IconHome from "@add-comps/icons/IconHome.vue";
import IconCourses from "@add-comps/icons/IconCourses.vue";
import IconPromocodes from "@add-comps/icons/IconPromocodes.vue";
import IconNotifications from "@add-comps/icons/IconNotifications.vue";
import IconText from "@add-comps/icons/IconText.vue";
import IconSubscription from "@add-comps/icons/IconSubscription.vue";
import IconSmile from "@add-comps/icons/IconSmile.vue";
import IconSystem from "@add-comps/icons/IconSystem.vue";

import {Component} from 'vue';
import { Store } from '@stores/store';
import { useCookies } from 'vue3-cookies';
import ViewAdditionalSubscriptionCreateEdit from "@views/ViewAdditionalSubscriptionCreateEdit.vue";

const { cookies } = useCookies();
const IS_DEV = ["development", "dev"].includes(import.meta.env.MODE);

const default_title: string = 'Личный кабинет'

interface Meta {
	title: string,
	nav_icon?: Component,
	nav_title?: string,
	isNav?: boolean,
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
			nav_title: 'Главная',
			isNav: true
		}
	},
	{
		path: "/courses",
		name: "Courses",
		component: ViewCourses,
		meta: {
			title: "Все курсы",
			nav_icon: IconCourses,
			nav_title: 'Курсы',
			isNav: true,
			saveScroll: true,
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
		],
		meta: {
			title: "Курс",
		},
	},
	{
		path: "/promocodes",
		name: "Promocodes",
		component: ViewPromocodes,
		meta: {
			title: "Все промокоды",
			nav_icon: IconPromocodes,
			nav_title: 'Промокоды',
			isNav: true,
			saveScroll: true,
		}
	},
	{
		path: '/promocodes/create',
		name: "PromocodesCreate",
		component: ViewPromocodesCreate,
		meta: {
			title: "Промокод"
		},
	},
	{
		path: "/notifications",
		name: "Notifications",
		component: ViewNotifications,
		meta: {
			title: "Все уведомления",
			nav_icon: IconNotifications,
			nav_title: 'Уведомления',
			isNav: true,
			variative: true,
			saveScroll: true,
		},
	},
	{
		path: '/notifications/create-edit/:id',
		name: "NotificationsCreateEdit",
		component: ViewNotificationsCreateEdit,
		meta: {
			title: "Уведомление"
		},
	},
	{
		path: '/sign-in',
		name: "SignIn",
		component: ViewSignIn,
		meta: {
			title: "Вход",
		},
	},
	{
		path: '/content',
		name: "Content",
		component: ViewTextContent,
		meta: {
			title: "Контент",
			nav_icon: IconText,
			nav_title: "Контент",
			isNav: true,
			variative: true,
			saveScroll: true,
		},
	},
	{
		path: '/content/create-edit/:contentId',
		name: "ContentCreateEdit",
		component: ViewTextContentCreateEdit
	},
	{
		path: '/subscriptions',
		name: "Subscriptions",
		component: ViewSubscriptions,
		meta: {
			title: "Подписки",
			nav_icon: IconSubscription,
			nav_title: "Подписки",
			isNav: true,
			variative: true,
		},
	},
	{
		path: '/subscription-edit/:subscriptionId',
		name: "SubscriptionEdit",
		component: ViewSubscriptionEdit,
		meta: {
			title: "Редактирование подписки",
		},
	},
	{
		path: '/additional-subscription/edit/:subscriptionId',
		name: "AdditionalSubscriptionEdit",
		component: ViewAdditionalSubscriptionCreateEdit,
		meta: {
			title: "Редактирование дополнительной подписки",
		},
	},
	{
		path: '/additional-subscription/create/:app',
		name: "AdditionalSubscriptionCreate",
		component: ViewAdditionalSubscriptionCreateEdit,
		meta: {
			title: "Редактирование дополнительной подписки",
		},
	},
	{
		path: '/users',
		name: "Users",
		component: ViewUsers,
		meta: {
			title: "Пользователи",
			nav_icon: IconSmile,
			nav_title: "Пользователи",
			isNav: true,
			variative: false,
		},
	},
	{
		path: '/system',
		name: "System",
		component: ViewSystem,
		meta: {
			title: "Система",
			nav_icon: IconSystem,
			nav_title: "Система",
			isNav: true,
			variative: false,
		},
	},
	{
		path: "/:catchAll(.*)*",
		name: "NotFound",
		redirect: {
			name: "Main",
		},
	},
]

const router = createRouter({
	history: createWebHistory('/'),
	// scrollBehavior: function (to, from, savedPosition) {
	// 	if (to.hash) {
	// 		return { el: to.hash, behavior: 'smooth', }
	// 	} else if (savedPosition) {
	// 		return savedPosition
	// 	} else {
	// 		return { top: 0, behavior: 'auto' }
	// 	}
	// },
	routes
})

const scrollPositions = new Map();

router.beforeEach(async (to, from, next) => {
	const container = document.querySelector('.main__container')
	if (from.meta?.saveScroll && container) {
		scrollPositions.set(from.fullPath, container.scrollTop)
	}
	if (container) {
		container.scrollTop = 0
	}

	try {
		const store = Store()
		store.clearLoadedFiles();

		if (IS_DEV) {
			next();
			return
		}

		if (!cookies.get("session_token")) {
			if (to.path !== '/sign-in') {
				next({ path: '/sign-in' })
				return
			} else {
				next()
			}
		}

		// if (cookies.get("session_token")) {
		// 	store.loading = true
		// 	await store.checkSessionToken().then(
		// 		(r: ReturnedError | ReturnedData) => {
					let title = <HTMLElement>document.querySelector('head title')
					title.innerText = <string>((to.meta.title || default_title))
		// 			store.loading = false
		//
		// 			if (!r.success) {
		// 				throw new Error(r.error.status);
		// 			}
		// 			if (!r.data.is_valid) {
		// 				cookies.remove("session_token")
		// 				next({ path: '/sign-in' })
		// 				return
		// 			}
					if (to.path === '/sign-in') {
						next({ path: '/' })
					} else {
						next()
					}
		// 		}
		// 	)
		// }
	} catch (error) {
		console.log(error);
		// next({ path: '/sign-in' })
	}
})

export default router