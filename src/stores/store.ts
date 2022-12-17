import { defineStore } from 'pinia'
import axios from 'axios';
import { Course, Courses, CourseProgram, CourseProgramTask, Promocode, Promocodes, Notifications, CourseToPost, UserCredentials } from "../../helpers";
import { cloneDeep } from 'lodash';
import { clearVariable } from '../main';
import { watch } from 'vue';

const url: string = 'http://testing.edproduction.xyz'

function timer(s: number, callback: VoidFunction = () => { }): Promise<void> {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res(callback())
		}, s);
	})
}

async function async(src: string) {
	const r = await axios(src)
	return r.data
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
	defaultProgramItem: CourseProgram,
	defaultTaskItem: CourseProgramTask
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
			courses: [
				{
					"id": 7,
					"about": {
						"title": "Название_3",
						"period": "3 дня",
						"description": "3",
						"whom": "3",
						"results": "3",
						"image": "/images/courses/Courses__Course-Image.png",
						"price": "По договоренности",
						"category": "Медицина"
					},
					"program": [
						{
							"id": 3,
							"title": "",
							"description": "",
							"tasks": [
								{
									"title": "",
									"type": "",
									"description": ""
								}
							]
						}
					]
				}
			],
			currentTime: '',
			promocodes: [],
			notifications: [],

			loadedFile: null,

			defaultCourse: {
				id: 0,
				about: {
					id: 0,
					title: "",
					period: "",
					description: "",
					whom: "",
					results: "",
					image: "",
					price: "",
					category: ""
				},
				program: []
			},
			defaultProgramItem: {
				id: 0,
				title: "",
				description: "",
				tasks: []
			},
			defaultTaskItem: {
				title: "",
				type: "",
				description: ""
			}
		}
	),

	actions: {
		async getCourses(): Promise<void> {
			this.loading = true
			return await axios(url + "/json/data.json")
				.then(r => {
					const d = r.data;
					if (typeof d === 'string') { throw new Error("There is error in courses getting."); }
					return d;
				})
				.then((e: Courses): void => {
					this.$patch({
						courses: <Courses>e,
					})
				})
				.then((): void => {
					this.loading = false
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				})
		},

		async saveCourse(course: Course): Promise<void> {
			const c: CourseToPost = cloneDeep(course)
			if (this.loadedFile) {
				c['loadedFile'] = this.loadedFile
			}
			return timer(2000, () => {
				console.log(c)
				this.loadedFile = null
			})
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
			this.loading = true
			return await axios(url + "/json/promocodes.json")
				.then(r => {
					const d = r.data;
					if (typeof d === 'string') { throw new Error("There is error in promocodes getting."); }
					return d;
				})
				.then((e: Promocodes): void => {
					this.loading = false
					this.$patch({
						promocodes: <Promocodes>e,
					})
				})
				.then((): void => {
					this.loading = false
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},

		async addPromocode(newPromocode: Promocode): Promise<void> {
			return timer(2000, () => console.log(newPromocode))
		},

		async getNotifications(): Promise<void> {
			this.loading = true
			return await axios(url + "/json/notifications.json")
				.then(r => {
					const d = r.data;
					if (typeof d === 'string') { throw new Error("There is error in notifications getting."); }
					return d;
				})
				.then((e: Notifications): void => {
					this.loading = false
					this.$patch({
						notifications: <Notifications>e,
					})
				}).then((): void => {
					this.loading = false
				})
				.catch(e => {
					console.error(`${e.name}: ${e.message}`);
				});
		},

		async addNotification(newNotification: FormData): Promise<void> {
			return timer(2000, () => {
				const formDataObj: any = {};
				newNotification.forEach((value, key: any) => formDataObj[key] = value);
				console.log(formDataObj)
			})
		},

		async signIn(creadentials: FormData): Promise<void> {
			return timer(2000, () => {
				const formDataObj: any = {};
				creadentials.forEach((value, key): void => {
					formDataObj[key] = value
				})
				console.log(formDataObj)
				return true
			})
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
		}
	},
})