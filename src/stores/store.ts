import { defineStore } from 'pinia'
import axios from 'axios';
import { useCookies, globalCookiesConfig } from 'vue3-cookies';
import { Course, Promocode, Promocodes, Notifications, CourseToPost, Content, Price, State, PopupAdditionFields, StringObject } from "../../helpers";
import { cloneDeep } from 'lodash';
import { clearVariable } from '../main';
import { watch } from 'vue';

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


export const Store = defineStore('Store', {
	state: (): State => (
		{
			monthNames: monthNames,
			activeApp: 'psy',
			apps: { psy: 'PSY', avocado: 'Avocado' },
			OS: {
				android: "Android",
				iOS: "iOS",
			},
			loading: false,
			popup: {
				text: '',
				isActive: false,
				isReturned: false,
				answer: false,
				additionFields: [],
				type: ''
			},
			info_popup: {
				text: '',
				isActive: false,
				additionFields: [],
			},
			mainTitle: '',
			courses: {},
			currentTime: '',
			promocodes: {},
			notifications: [],
			loadedFiles: {},

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
				production: 0,
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
			fileErrorStatuses: [
				'FILE_SIZE_EXCEEDED',
				'INVALID_FILE_EXTENSION'
			],
			acceptedMediaExtensions: [
				".mp3",
				".mp4",
			],

			defaultLang: '',

			commonInfo: {
				courses: {
					active_courses: 0,
					completed_courses: 0,
					rejected_courses: 0,
				},
				subs: {
					all_subs: 0,
					psy: 0,
					avocado: 0,
				},
				users: {
					all_users: 0,
					psy: 0,
					avocado: 0,
				},
			},

			contentList: {},
			defaultContent: {
				id: "",
				title: "",
				image: "",
				app: "",
				type: "",
				lang: "",
				texts: {}
			}
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

			if (Object.keys(this.loadedFiles).length) {
				for (const key in this.loadedFiles) {
					fd.append(key, this.loadedFiles[key]);
				}
			}

			return await axios.post(...formRequest('Courses/createCourse', fd) as [string, FormData]).then(
				r => {
					this.loadedFiles = {}
					console.log(r);

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

			if (Object.keys(this.loadedFiles).length) {
				for (const key in this.loadedFiles) {
					fd.append(key, this.loadedFiles[key]);
				}
			}

			return await axios.post(...formRequest('Courses/updateCourse', fd) as [string, FormData]).then(
				r => {
					this.loadedFiles = {}
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},
		async updateCourseProduction(course_id: string, productionState: boolean): Promise<void> {
			const fd = new FormData();
			fd.append('course_id', course_id);
			fd.append('production', (+productionState).toString());

			return await axios.post(...formRequest('Courses/updateCourse', fd) as [string, FormData]).then(
				r => {
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
		async getNotification(notificationId: string): Promise<void> {
			const fd = new FormData()
			fd.append('notification_id', notificationId)

			return await axios.post(...formRequest('Notifications/getAdminNotification', fd) as [string, FormData])
				.then(
					r => {
						return r.data.data;
					},
					e => {
						console.log(e);
						if (!e.response.data.success) throw new Error("There is error in notifications getting.")
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
					return r.data
				},
				e => {
					console.log(e);
					return e.response.data
				}
			)
		},

		async callPopup(text: string, additionFields?: StringObject): Promise<boolean> {
			this.popup.text = text
			this.popup.isActive = true
			this.popup.additionFields = additionFields && Object.keys(additionFields).length > 0 ? additionFields : {}
			this.popup.type = additionFields && Object.keys(additionFields).length > 0 && additionFields.type ? additionFields.type : ''
			if (this.popup.additionFields['error' as keyof PopupAdditionFields])
				setTimeout(() => {
					delete this.popup.additionFields['error' as keyof PopupAdditionFields]
				}, 2000);

			return new Promise((res, rej) => {
				watch(
					() => this.popup.isReturned,
					() => {
						res(this.popup.isReturned && this.popup.answer)
					}
				)
			})
		},

		clearPopup() {
			this.popup = cloneDeep(clearVariable(this.popup))
		},

		async callInfoPopup(text: string, additionFields?: StringObject): Promise<void> {

			this.info_popup.text = text
			this.info_popup.isActive = true
			this.info_popup.additionFields = additionFields && Object.keys(additionFields).length > 0 ? additionFields : {}
			// setTimeout(() => {
			// 	this.info_popup = cloneDeep(clearVariable(this.info_popup))
			// }, 2000);
			return new Promise((res) => {
				setTimeout(() => {
					this.info_popup = cloneDeep(clearVariable(this.info_popup));
					res();
				}, 2000);
			})
		},

		async callPopupWithData(text: string, additionFields: StringObject): Promise<StringObject> {
			return this.callPopup(text, additionFields).then((r: boolean): Promise<StringObject> => {
				return new Promise((res, rej) => {
					if (r) res(additionFields)
				})
			})

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

		async getUsersData(filters: StringObject): Promise<void> {
			let filtersFormData = new FormData();
			for (const filter in filters) {
				filtersFormData.append(filter, filters[filter])
			}
			return await axios.post(...formRequest('getUsersInfo', filtersFormData) as [string, FormData])
				.then(
					r => {
						this.commonInfo = r.data.data
						return;
					},
					e => {
						console.log(e);
						if (!e.response.data.success) throw new Error("There is error in notifications getting.")
					})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},
		async deleteUser(user_creds: string | number): Promise<void> {
			const fd = new FormData()
			fd.append('user_creds', user_creds as string);
			return await axios.post(...formRequest('Users/deleteUser', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					throw e.response.data
				}
			)
		},
		async getUser(user_creds: string | number): Promise<void> {
			const fd = new FormData()
			fd.append('user_creds', user_creds as string);
			return await axios.post(...formRequest('Users/getUser', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					throw e.response.data
				}
			)
		},
		async addSubscription(): Promise<void> {
			const fd = new FormData()
			fd.append('creds', this.popup.additionFields['creds' as keyof PopupAdditionFields] as string);
			fd.append('app', this.popup.additionFields['app' as keyof PopupAdditionFields] as string);
			fd.append('type', this.popup.additionFields['type' as keyof PopupAdditionFields] as string);
			if (this.popup.additionFields['autopayment' as keyof PopupAdditionFields]) {
				fd.append('autopayment', this.popup.additionFields['autopayment' as keyof PopupAdditionFields] as string);
			}

			return await axios.post(...formRequest('Users/addSubscription', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					throw e.response.data
				}
			)
		},

		async toggleNotifications(): Promise<void> {
			const fd = new FormData()
			fd.append('creds', this.popup.additionFields['creds' as keyof PopupAdditionFields] as string);
			fd.append('sys_notifications', this.popup.additionFields['sys_notifications' as keyof PopupAdditionFields] as string);

			return await axios.post(...formRequest('Users/toggleNotifications', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					throw e.response.data
				}
			)
		},


		async getContent(pageName: string, lang: string, contentId: string | null, contentType?: string): Promise<void> {
			this.loading = true
			const contentIdFD = new FormData()
			if (pageName) {
				contentIdFD.append('app', pageName)
			}
			if (lang) {
				contentIdFD.append('lang', lang)
			}
			if (contentId) {
				contentIdFD.append('content_ids', JSON.stringify([contentId]))
			}
			if (contentType) {
				contentIdFD.append('content_type', contentType)
			}

			return await axios.post(...formRequest('Content/getContent', contentIdFD) as [string])
				.then(r => {
					this.loading = false
					this.contentList = r.data.data
					return r.data.data
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				})
		},
		async getTypes(pageName: string): Promise<string[]> {
			this.loading = true
			const pageNameFD = new FormData()
			pageNameFD.append('app', pageName)

			return await axios.post(...formRequest('Content/getTypes', pageNameFD) as [string])
				.then(r => {
					this.loading = false
					return r.data.data
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				})
		},
		async addContent(content: Content): Promise<void> {
			const newContent: Content = cloneDeep(content)
			const fd = new FormData();

			for (const key in newContent) {
				fd.append(key, JSON.stringify(newContent[key as keyof Content]))
			}

			if (Object.keys(this.loadedFiles).length) {
				for (const key in this.loadedFiles) {
					fd.append(key, this.loadedFiles[key]);
				}
			}

			return await axios.post(...formRequest('Content/createContent', fd) as [string, FormData]).then(
				r => {
					this.loadedFiles = {}
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},
		async updateContent(content: Content): Promise<void> {
			const updateContent: Content = cloneDeep(content)
			const fd = new FormData();

			for (const key in updateContent) {
				fd.append(key, JSON.stringify(updateContent[key as keyof Content]))
			}

			if (Object.keys(this.loadedFiles).length) {
				for (const key in this.loadedFiles) {
					fd.append(key, this.loadedFiles[key]);
				}
			}

			return await axios.post(...formRequest('Content/updateContent', fd) as [string, FormData]).then(
				r => {
					this.loadedFiles = {}
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},
		async deleteContent(contentIds: Array<string>): Promise<void> {
			const fd = new FormData()
			fd.append('content_ids', JSON.stringify(contentIds));
			return await axios.post(...formRequest('Content/deleteContent', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async getPrices(app: string, priceId?: string): Promise<void> {
			const fd = new FormData()
			fd.append('app', app);
			if (priceId) {
				fd.append('id', priceId);
			}
			return await axios.post(...formRequest('Prices/getPrices', fd) as [string, FormData]).then(
				r => {
					return r.data.data
				},
				e => {
					return e.response.data
				}
			)
		},
		async updatePrice(app: string, price: Price): Promise<void> {
			const fd = new FormData()
			fd.append('app', app);
			fd.append('price', JSON.stringify(price));

			return await axios.post(...formRequest('Prices/updatePrice', fd) as [string, FormData]).then(
				r => {
					return r.data
				},
				e => {
					return e.response.data
				}
			)
		},

		async getActiveSubscriptions(app: string): Promise<void> {
			const fd = new FormData()
			fd.append('app', app)

			return await axios.post(...formRequest('Subscriptions/getActiveSubscriptions', fd) as [string, FormData]).then(
				r => {
					return r.data.data
				},
				e => {
					return e.response.data
				}
			)
		},
		async getScheduleSubscriptions(app: string, data: string): Promise<void> {
			const fd = new FormData()
			fd.append('app', app);
			fd.append('data', data);

			return await axios.post(...formRequest('Subscriptions/getScheduleSubscriptions', fd) as [string, FormData]).then(
				r => {
					return r.data.data
				},
				e => {
					return e.response.data
				}
			)
		},
	},
})