import { RouteComponent } from "vue-router"

export declare type Course = {
	id?: number,
	course_id?: any,
	production: number,
	about: CourseAbout | {},
	days: CourseDays | {}
	active?: number | string
}
export declare type Courses = { [key: string]: Course } | Array<null>

export declare interface Promocode {
	id?: string,
	promocode: string,
	value: string,
	type: string,
	sended?: boolean,
}
export declare type Promocodes = { [key: string]: Promocode } | {}

export declare interface Notification {
	id?: string,
	language: string,
	title: string,
	text?: string,
	type?: string,
	time: string,
	date?: string,
	app: string,
	is_active?: boolean,
	count_total: number | null,
	count_completed: number | null,
    premium_availability: boolean | null,
	days_without_premium?: number | null,
	days_since_last_visit?: number | null,
	image?: string | Blob | null
	os?: string | null
	info?: string
	is_test?: boolean
}
export declare type Notifications = Array<Notification> | Array<null>

export declare interface CourseAbout {
	title: string
	lang: string
	period: number
	description: string
	for_whom: string
	results: string
	price: number
	category: string
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

export declare type AllUsersInfo = {
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
	content_id?: string
	title: string
	image?: string
	app: string
	language: string
	type: string
	texts: ContentTexts
	order: number
}
export declare type ContentPreview = Content & {
	texts: number
}
export declare type ContentTexts = { [key: string]: ContentText }
export declare type ContentText = {
	id: string
	title: string | null
	description: string | null
	author: string | null
	type: string | null
	info: string | null
	is_premium: boolean
	image?: string | null
	media?: string | null
	order: number
	media_size?: string
	playtime?: string
}
export declare type ContentList = { [key: string]: ContentPreview } | {}

export declare type Price = {
	id: string
	tag: string
	name: string
	price: number
	second_price: number | null
	second_price_visibility: boolean
	text_1: string
	text_1_visibility: boolean
	text_2: string
	text_2_visibility: boolean
	strikethrough: boolean
	second_price_per_month: boolean
	readonly price_divison: number | null
	is_divide: boolean
	duration_timestamp: string | null
}
export declare type Prices = { [key: string]: Price } | {}

export declare type ActiveSubscription = {
	id: string
	name: string
	count: number
}
export declare type ActiveSubscriptions = { [key: string]: ActiveSubscription } | {}

export declare type ScheduleSubscriptionTypeUser = {
	email: string
	id: number
}
export declare type ScheduleSubscriptionType = {
	id: string
	price: number
	name: string
	users: ScheduleSubscriptionTypeUser[]
}
export declare type ScheduleSubscriptionTypes = { [key: string]: ScheduleSubscriptionType } | {}

export declare type State = {
	monthNames: ReadonlyArray<string>
	activeApp: string,
	avatarUrl: string,
	apps: StringObject,
	OS: StringObject,
	loading: boolean,
	popup: {
		text: string,
		isActive: boolean,
		isReturned: boolean,
		answer: boolean,
		additionFields: PopupAdditionFields,
		type: string
	},
	info_popup: {
		text: string,
		isActive: boolean,
		additionFields: PopupAdditionFields,
	}
	mainTitle: string,
	courses: Courses,
	currentTime: string,
	promocodes: Promocodes,
	loadedMedia: { [key: string]: File },
	loadedImages: { [key: string]: File },
	loadedFiles: { [key: string]: File },
	defaultCourse: Course,
	defaultDayItem: CourseDay,
	defaultTaskItem: CourseDayTask,
	languages: Object,
	premiumAppTypes: StringObject
	acceptedImageExtensions: Array<string>
	fileErrorStatuses: string[]
	acceptedMediaExtensions: Array<string>
	defaultLang: string,
	commonInfo: AllUsersInfo
}

export declare type PopupAdditionFields = {
	[key: string]: string
} | {}

export declare type StringObject = { [key: string]: string }
export declare type NumberObject = { [key: string]: number }
export declare type NumberOrStringObject = StringObject | NumberObject
export declare type ObjectOfStringObject = { [key: string]: StringObject }

export declare type Link = {
	to: string
	name: string
	nav_title: string
	nav_icon: RouteComponent | string
	variative?: boolean
}

export declare type User = {
	id?: number | string
	email?: string
	name?: string
	password?: string
	photo?: string
	typePremium: UsersTypePremiums
	session_series?: string
	session_token?: string
	device_token?: string
	user_id?: number | string
	app?: string[]
	phone_model?: string
	registration_date: string
	lang?: string
	premium_app?: ObjectOfStringObject
	open_app: NumberOrStringObject
	timezone?: string
	sys_notifications_state?: boolean | number
	level?: string
	active_course?: string
	completed_courses?: string[]
	device_tokens?: StringObject
	versions?: StringObject
	is_test?: boolean | number
}
export declare type UsersTypePremiums = {
	psy: UsersTypePremium
	avocado: UsersTypePremium
}
export declare type UsersTypePremium = {
	autopayment: string | number
	keyPaymant: string
	payDate: string | number
	payment_method_type: string
	status: string
	subscriptionDuration: string
	subscriptionDurationText: string
	typeApp: string
	typePremium: string
}

export declare type Logs = {
	total_size?: string
	logs?: LogsInfo
}
export declare type LogsInfo = {
	admin?: LogsInfoItem
	site?: LogsInfoItem
}
export declare type LogsInfoItem = {
	total_size: LogsSize
	logs_size: LogsSize
	is_clear_needed: boolean
}
export declare type LogsSize = {
	value: string | number
	format_value: string
}