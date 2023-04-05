import { defineStore } from 'pinia'
import axios from 'axios';
import { useCookies, globalCookiesConfig } from 'vue3-cookies';
import { Course, Courses, CourseDay, CourseDayTask, Promocode, Promocodes, Notifications, CourseToPost, UserCredentials } from "../../helpers";
import { cloneDeep } from 'lodash';
import { clearVariable } from '../main';
import { watch } from 'vue';

const url: string = ""
const api_base: string = '/v1/'
const { cookies } = useCookies();

globalCookiesConfig({
	expireTimes: "30d",
	secure: true,
});

function timer(s: number, callback: VoidFunction = () => { }): Promise<void> {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res(callback())
		}, s);
	})
}

function getObjectFromFormData(formData: FormData) {
	let obj: { [key: string | number]: any } = {}
	for (let [name, value] of formData) {
		obj[name] = value
	}
	return obj
}

function formRequest(uriName: string, dataObj?: FormData): Array<string | FormData> {
	if (!dataObj) {
		dataObj = new FormData();
	}
	let newDataObj = copyFormData(dataObj);
	newDataObj.append("session_token", cookies.get("session_token"))
	return [
		api_base + uriName,
		newDataObj
	]
}

function copyFormData(formData: FormData): FormData {
	let newFormData = new FormData();
	for (let [name, value] of formData) {
		newFormData.append(name, value)
	}
	// formData.forEach((k, v): void => newFormData.append(k as string, v as FormDataEntryValue))
	return newFormData;
}

function object_reverse(object: { [key: string]: {} }): { [key: string]: {} } {
	let objectKeys: Array<string> = Object.keys(object).reverse()
	let newObject: typeof object = {};
	objectKeys.forEach((key) => {
		newObject[key] = cloneDeep(object[key])
	});
	return newObject;
}

const monthNames: ReadonlyArray<string> = [
	"января",
	"ферваля",
	"марта",
	"апреля",
	"мая",
	"июня",
	"июля",
	"августа",
	"сентября",
	"октября",
	"ноября",
	"декабря",
];

type State = {
	loading: boolean,
	popup: {
		text: string,
		isActive: boolean,
		isReturned: boolean,
		answer: boolean,
	},
	mainTitle: string,
	courses: Courses,
	currentTime: string,
	promocodes: Promocodes,
	notifications: Notifications,
	loadedFile: File | null,
	defaultCourse: Course,
	defaultDayItem: CourseDay,
	defaultTaskItem: CourseDayTask,
	languages: Object,
	acceptedImageExtensions: Array<string>
	defaultLang: string
}

export const Store = defineStore('Store', {
	state: () => (
		<State>{
			loading: false,
			popup: {
				text: '',
				isActive: false,
				isReturned: false,
				answer: false,
			},
			mainTitle: '',
			courses: {},
			currentTime: '',
			promocodes: {},
			notifications: [],
			loadedFile: null,

			defaultCourse: {
				id: 0,
				about: {
					id: 0,
					title: "",
					lang: "",
					period: "",
					description: "",
					for_whom: "",
					results: "",
					image: "",
					price: 0,
					category: ""
				},
				days: {}
			},
			defaultDayItem: {
				id: 0,
				title: "",
				description: "",
				tasks: {}
			},
			defaultTaskItem: {
				title: "",
				type: "",
				description: ""
			},

			appNames: {
				'psy': 'PSY',
				'avocado': 'Avocado'
			},
			languages: {
				'ru': 'Русский',
				'en': 'Английский',
			},
			premiumAppTypes: {
				is: 'Есть подписка',
				not: 'Нет подписки',
				all: 'Для всех',
			},

			acceptedImageExtensions: [
				".jpeg",
				".jpg",
				".bmp",
				".gif",
				".png",
				".ico",
				".webp",
			],
			imageErrorStatuses: [
				'FILE_SIZE_EXCEEDED',
				'INVALID_FILE_EXTENSION'
			],

			defaultLang: ''
		}
	),

	actions: {
		async getCourses(lang: string | undefined): Promise<void> {
			this.loading = true
			const langFD = new FormData()
			if (lang) {
				langFD.append('lang', lang)
			}

			return await axios.post(...formRequest('Courses/getCourses', langFD) as [string])
				.then(r => {
					this.courses = r.data.data
					this.loading = false
					return
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				})
		},

		async getCourse(courseId: string): Promise<void> {
			this.loading = true
			const courseIdFD = new FormData()
			courseIdFD.append('courses_ids', JSON.stringify([courseId]))

			return await axios.post(...formRequest('Courses/getCourses', courseIdFD) as [string])
				.then(r => {
					this.loading = false
					return r.data.data
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				})
		},

		async addCourse(course: Course): Promise<void> {
			const newCourse: CourseToPost = cloneDeep(course)
			const fd = new FormData();
			fd.append('about', JSON.stringify(newCourse['about']));
			fd.append('days', JSON.stringify(newCourse['days']));
			if (this.loadedFile) {
				fd.append('course_images', this.loadedFile);
			}

			return await axios.post(...formRequest('Courses/createCourse', fd) as [string, FormData]).then(
				r => {
					this.loadedFile = null
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async updateCourse(course: Course): Promise<void> {
			const updateCourse: CourseToPost = cloneDeep(course)
			const fd = new FormData();
			fd.append('course_id', updateCourse['course_id']);
			fd.append('about', JSON.stringify(updateCourse['about']));
			fd.append('days', JSON.stringify(updateCourse['days']));
			if (this.loadedFile) {
				fd.append('course_images', this.loadedFile);
			}

			return await axios.post(...formRequest('Courses/updateCourse', fd) as [string, FormData]).then(
				r => {
					this.loadedFile = null
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async deleteCourse(courses_ids: Array<string>): Promise<void> {
			const fd = new FormData();
			fd.append('courses_ids', JSON.stringify(courses_ids));

			return await axios.post(...formRequest('Courses/deleteCourses', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async updateTime() {
			const d: Date = new Date();
			this.currentTime = dateForm(d)

			function dateForm(d: Date): string {
				let day: string | number = d.getDate();
				let month: string = monthNames[d.getMonth()];
				let time: string = d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);

				return `${day} ${month} ${time}`
			}

			setTimeout(() => {
				this.currentTime = dateForm(new Date())

				setInterval(() => {
					this.currentTime = dateForm(new Date())
				}, 60000)
			}, 60000 - d.getSeconds() * 1000 - d.getMilliseconds());
		},

		async getPromocodes(): Promise<void> {
			const fd = new FormData()
			return await axios.post(...formRequest('Promocodes/getPromocodes', fd) as [string])
				.then(r => {
					const promocodes: Promocodes = cloneDeep(r.data.data.promocodes)
					for (const key in promocodes) {
						const promocode: Promocode = promocodes[key as keyof Promocodes];
						promocode.sended = !!promocode.sended;
					}
					return promocodes;
				})
				.then((e: Promocodes): void => {
					this.promocodes = e
					this.loading = false
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},

		async deletePromocode(promocode: string): Promise<void> {
			const fd = new FormData()
			fd.append('promocode', promocode);
			return await axios.post(...formRequest('Promocodes/deletePromocode', fd) as [string])
				.then(r => {
					return r.data;
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},

		async addPromocode(newPromocode: {}): Promise<void> {
			const fd = new FormData()
			fd.append('promocode_data', JSON.stringify(newPromocode))
			return await axios.post(...formRequest('Promocodes/createPromocode', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async updatePromocode(promocode: string, newPromocodeData: {}): Promise<void> {
			const fd = new FormData()
			fd.append('promocode', promocode)
			fd.append('promocode_new_data', JSON.stringify(newPromocodeData))
			return await axios.post(...formRequest('Promocodes/updatePromocode', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async getNotifications(app: string, lang: string): Promise<void> {
			this.loading = true
			const fd = new FormData()
			fd.append('app', app)
			fd.append('lang', lang)

			return await axios.post(...formRequest('Notifications/getAdminNotifications', fd) as [string])
				.then(
					r => {
						return r.data.data;
					},
					e => {
						console.log(e);
						if (!e.response.data.success) throw new Error("There is error in notifications getting.")
					})
				.then((e: Notifications): void => {
					this.loading = false
					this.$patch({
						notifications: <Notifications>e,
					})
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},

		async addNotification(newNotification: FormData): Promise<void> {
			return await axios.post(...formRequest('Notifications/createAdminNotification', newNotification) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async deleteNotification(deleteNotification: FormData): Promise<void> {
			return await axios.post(...formRequest('Notifications/deleteAdminNotification', deleteNotification) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async updateNotification(updateNotification: FormData): Promise<void> {
			return await axios.post(...formRequest('Notifications/updateAdminNotification', updateNotification) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async signIn(creadentials: FormData): Promise<void> {
			return await axios.post(api_base + "signIn", creadentials).then(
				r => {
					console.log(r);
					return r.data
				},
				e => {
					console.log(e);
					return e.response.data
				}
			)
		},

		clearPopup() {
			this.popup = cloneDeep(clearVariable(this.popup))
		},

		async callPopup(text: string): Promise<boolean> {
			this.popup.text = text
			this.popup.isActive = true
			return new Promise((res, rej) => {
				watch(
					() => this.popup.isReturned,
					() => {
						res(this.popup.isReturned && this.popup.answer)
					}
				)
			})

			// return new Promise((res, rej) => {

			// })
		},

		async checkSessionToken() {
			return await axios.post(...formRequest('checkSessionToken') as [string]).then(
				r => {
					return r.data
				},
				e => {
					console.log(e);
					return e.response.data
				}
			)
		},

		async getUsersData(): Promise<void> {
			return await axios.post(...formRequest('getUsersInfo', new FormData()) as [string, FormData])
				.then(
					r => {
						return r.data.data;
					},
					e => {
						console.log(e);
						if (!e.response.data.success) throw new Error("There is error in notifications getting.")
					})
				.then(r => {
					return r
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},

	},
})