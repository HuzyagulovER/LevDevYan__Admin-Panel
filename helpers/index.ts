export declare type Course = {
	id?: number | string,
	about: CourseAbout | {},
	program: Array<CourseProgram> | Array<null>
};
export declare type Courses = Array<Course> | Array<null>

export declare interface Promocode {
	id?: number | string,
	promocode: string,
	value: string,
	type: string,
	active?: boolean,
}
export declare type Promocodes = Array<Promocode> | Array<null>

export declare interface Notification {
	id?: number | string,
	lang: string,
	title: string,
	body?: string,
	type: string,
	time: string,
	date: string,
	app?: string,
	image?: string | File
}
export declare type Notifications = Array<Notification> | Array<null>

export declare interface CourseAbout {
	id?: number | string,
	title: string,
	period: string,
	description: string,
	whom: string,
	results: string,
	price: string,
	category: string,
	image?: string
}
export declare interface CourseProgramTask {
	title: string,
	type: string,
	description: string
}
export declare interface CourseProgram {
	id?: number | string,
	title: string,
	description: string,
	tasks: Array<CourseProgramTask | null>
}

export declare type CourseToPost = Course & {
	loadedFile?: File
}

export declare type UserCredentials = {
	email: string;
	password: string;
};