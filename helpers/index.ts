export declare type Course = {
	id?: number,
	course_id?: any,
	production: number,
	about: CourseAbout | {},
	days: CourseDays | {}
}
export declare type Courses = { [key: string]: Course } | Array<null>

export declare interface Promocode {
	id?: number | string,
	promocode: string,
	value: string,
	type: string,
	sended?: boolean,
}
export declare type Promocodes = { [key: string]: Promocode } | {}

export declare interface Notification {
	id?: number | string,
	lang: string,
	title: string,
	body?: string,
	type?: string,
	time: string,
	date: string,
	app: string,
	state?: boolean | number,
	repeat_times: number,
	notification_id?: string,
	premium_app_type: string,
	days_without_subscription?: number,
	days_without_open_app?: number,
	image?: string
	info?: string
}
export declare type Notifications = Array<Notification> | Array<null>

export declare interface CourseAbout {
	title: string,
	lang: string,
	period: number,
	description: string,
	for_whom: string,
	results: string,
	price: number,
	category: string,
	image?: string
}
export declare interface CourseDayTask {
	id?: number,
	title: string,
	type: string,
	description: string
}
export declare interface CourseDay {
	id?: number,
	title: string,
	description: string,
	tasks: {
		[key: string]: CourseDayTask
	}
}

export declare type CourseDays = {
	[key: string]: CourseDay
};

export declare type CourseToPost = Course & {
	loadedFiles?: File[]
}

export declare type UserCredentials = {
	email: string;
	password: string;
}

export declare type ReturnedData = {
	data: {
		[key: string]: any
	},
	success: true
}
export declare type ReturnedError = {
	error: {
		[key: string]: any
	},
	success: false
}

export declare type UsersInfo = {
	courses: {
		active_courses: number,
		completed_courses: number,
		rejected_courses: number,
	},
	subs: {
		all_subs: number,
		psy: number,
		avocado: number,
	},
	users: {
		all_users: number,
		psy: number,
		avocado: number,
	},
}

export declare type Content = {
	id: string
	title: string
	image: string
	app: string
	lang: string
	type: string
	texts: { [key: string]: ContentText }
}
export declare type ContentText = {
	text: string
	image: string
}
export declare type ContentList = { [key: string]: Content } | {}

export declare type Price = {
	id: string
	name: string
	price: number
	second_price: number
	text_1: string
	text_2: string
	duration_timestamp: string
	strikethrough: number | boolean
	second_price_per_month: number | boolean
	price_divison: number
}
export declare type Prices = { [key: string]: Price } | {}

export declare type ActiveSubscription = {
	id: string
	count: number
}
export declare type ActiveSubscriptions = { [key: string]: ActiveSubscription } | {}

export declare type ScheduleSubscription = {
	id: string
	price: number
	email: string
	user_id: number
}
export declare type ScheduleSubscriptions = { [key: string]: ScheduleSubscription } | {}
