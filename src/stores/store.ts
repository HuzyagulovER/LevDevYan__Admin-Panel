import {defineStore} from 'pinia'
import axios, {AxiosRequestConfig} from 'axios';
import {useCookies, globalCookiesConfig} from 'vue3-cookies';
import {
    Course,
    Promocode,
    Promocodes,
    Notifications,
    CourseToPost,
    Content,
    Price,
    State,
    PopupAdditionFields,
    StringObject, Notification,
} from "../../helpers";
import {cloneDeep, isBoolean, isEmpty, isNull} from 'lodash';
import {clearVariable} from '../main';
import {watch} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const api: { [key: string]: string } = {
    psy: "/v1/",
    avocado: "/v1/",
    optimind: "https://optimind.levdevyan.com/v1/",
}

const api_base: string = 'https://levdevyan.com/api/admin/'
const {cookies} = useCookies();

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    if (isEmpty(config.headers)) {
        config.headers = {};
    }

    config.headers['API-v2-Updated-Version'] = true;

    if (!isEmpty(cookies.get("session_token"))) {
        config.headers['Authorization'] = 'Bearer ' + cookies.get("session_token");
    }

    if (config.method && ['PUT', 'PATCH'].includes(config.method.toUpperCase())) {
        config.params._method = config.method;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.error?.status === 'OUTDATED_SESSION') {
            Store().logout();
        }

        return Promise.reject(error);
    }
);

globalCookiesConfig({
    expireTimes: "30d",
    secure: true,
});

function objectToFormData<T extends Record<string, any>>(obj: T): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
        if (isBoolean(value)) {
            value = Number(value)
        }
        if (isNull(value)) {
            value = ''
        }

        formData.append(key, String(value));
    });

    return formData;
}

function timer(s: number, callback: VoidFunction = () => {
}): Promise<void> {
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

    return [
        url(uriName),
        newDataObj
    ]
}

function url(uriName: string, key?: string | number): string {
    return api_base + uriName + (key ? '/' + key : '');
}

function copyFormData(formData: FormData): FormData {
    let newFormData = new FormData();
    for (let [name, value] of formData) {
        newFormData.append(name, value)
    }
    // formData.forEach((k, v): void => newFormData.append(k as string, v as FormDataEntryValue))
    return newFormData;
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
            apps: {
                psy: 'PSY',
                avocado: 'Avocado',
                // optimind: 'Optimind',
            },
            OS: {
                android: "Android",
                apple: "Apple",
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
                true: 'Есть подписка',
                false: 'Нет подписки',
                null: 'Для всех'
            } as const,

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
                texts: {},
                order: 1
            }
        }
    ),

    actions: {
        async getPrices(): Promise<void> {
            return await axiosInstance.get(url('premiums')).then(
                r => {
                    return r.data.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async getPrice(priceId: string): Promise<void> {
            return await axiosInstance.get(url('premiums', priceId)).then(
                r => {
                    return r.data.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async getPricesByApp(app: string): Promise<void> {
            return await axiosInstance.get(url('premiums/app', app)).then(
                r => {
                    return r.data.data
                },
                e => {
                    return e.response.data
                }
            )
        },

        async getPromocodes(): Promise<void> {
            return await axiosInstance.get(url('promocodes'))
                .then(r => {
                    const promocodes: Promocodes = cloneDeep(r.data.data)
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
        async addPromocode(data: {}): Promise<void> {
            return await axiosInstance.post(url('promocodes'), objectToFormData(data)).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async deletePromocode(id: string): Promise<void> {
            return await axiosInstance.delete(url('promocodes', id))
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.error(`${e.name}: ${e.message}`);
                });
        },
        async updatePromocode(id: string, data: {}): Promise<void> {
            return await axiosInstance.post(url('promocodes', id), objectToFormData(data)).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },

        async updatePrice(id: string, price: Price): Promise<void> {
            return await axiosInstance.post(url('premiums', id), objectToFormData(price)).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },

        async getActiveSubscriptions(app: string, device: string): Promise<void> {
            return await axiosInstance.get(url('premiums/counters', app), {params: {device: device}}).then(
                r => {
                    return r.data.data
                }
            )
        },
        async getScheduleSubscriptions(app: string, date: string): Promise<void> {
            return await axiosInstance.get(url('premiums/schedule', app), {params: {date: date}}).then(
                r => {
                    return r.data.data
                },
                e => {
                    return e.response.data
                }
            )
        },

        logout() {
            cookies.remove("session_token");
            router.push("/sign-in");
        },
        async getUsersCounters(): Promise<StringObject> {
            return await axiosInstance.get(url('users/counters'))
                .then(
                    r => {
                        return r.data.data;
                    },
                    e => {
                        console.log(e);
                        if (!e.response.data.success) throw new Error("There is error in counters getting.")
                    })
                .catch(e => {
                    console.error(`${e.name}: ${e.message}`);
                });
        },
        async getUser(identifier: string | number): Promise<void> {
            const fd = new FormData()
            fd.append('user_identifier', identifier as string);
            return await axiosInstance.post(url('users/user'), fd).then(
                r => {
                    return r.data
                },
                e => {
                    throw e.response.data
                }
            )
        },
        async deleteUser(identifier: string | number): Promise<void> {
            const fd = new FormData()
            fd.append('user_identifier', identifier as string);
            return await axiosInstance.post(...formRequest('users/delete', fd) as [string, FormData]).then(
                r => {
                    return r.data
                },
                e => {
                    throw e.response.data
                }
            )
        },


        async signIn(credentials: FormData): Promise<void> {
            return await axiosInstance.post(...formRequest('sign-in', credentials) as [string, FormData]).then(
                r => {
                    console.log(r.data)
                    return r.data
                },
                e => {
                    console.log(e);
                    return e.response.data
                }
            )
        },
        async getMainCounters(filters: StringObject): Promise<void> {
            let filtersFormData = new FormData();
            for (const filter in filters) {
                filtersFormData.append(filter, filters[filter])
            }
            return await axiosInstance.post(...formRequest('main/counters', filtersFormData) as [string, FormData])
                .then(
                    r => {
                        this.commonInfo = r.data.data
                        return;
                    },
                    e => {
                        console.log(e);
                        if (!e.response.data.success) throw new Error("There is error in counters getting.")
                    })
                .catch(e => {
                    console.error(`${e.name}: ${e.message}`);
                });
        },
        async setSubscription(): Promise<void> {
            const fd = new FormData()
            fd.append('identifier', this.popup.additionFields['identifier' as keyof PopupAdditionFields] as string);
            fd.append('id', this.popup.additionFields['id' as keyof PopupAdditionFields] as string);
            if (this.popup.additionFields['autopayment' as keyof PopupAdditionFields]) {
                fd.append('autopayment', this.popup.additionFields['autopayment' as keyof PopupAdditionFields] as string);
            }

            return await axiosInstance.post(...formRequest('users/setSubscription', fd) as [string, FormData]).then(
                r => {
                    return r.data
                },
                e => {
                    throw e.response.data
                }
            )
        },
        async callPopupWithData(text: string, additionFields: StringObject): Promise<StringObject> {
            return this.callPopup(text, additionFields).then((r: boolean): Promise<StringObject> => {
                return new Promise((res, rej) => {
                    if (r) res(additionFields)
                })
            })
        },

        async getNotifications(app: string, language: string): Promise<Notifications> {
            this.loading = true

            return await axiosInstance.get(url('notifications'), {params: {app: app, language: language}})
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
                })
                .finally(() => {
                    this.loading = false
                });
        },
        async getNotification(id: string): Promise<Notification> {
            return await axiosInstance.get(url('notifications', id))
                .then(
                    r => {
                        console.log(r.data.data)
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
        async createNotification(data: Notification): Promise<void> {
            return await axiosInstance.post(url('notifications'), data).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async deleteNotification(deleteNotification: string): Promise<void> {
            return await axiosInstance.delete(url('notifications', deleteNotification)).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async updateNotification(id: string, data: Notification): Promise<void> {
            return await axiosInstance.put(url('notifications', id), data).then(
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
        getPremiumAvaliabilityText(label: string): string | undefined {
            return Object.hasOwn(this.premiumAppTypes, label) ? this.premiumAppTypes[label] : undefined;
        },


        getAppByName(appName: string): string {
            return Object.keys(this.apps)[Object.values(this.apps).indexOf(appName)] ?? 'other'
        },
        async getCourses(lang: string | undefined): Promise<void> {
            this.loading = true
            const langFD = new FormData()
            if (lang) {
                langFD.append('lang', lang)
            }

            return await axiosInstance.post(...formRequest('Courses/getCourses', langFD) as [string, FormData])
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

            return await axiosInstance.post(...formRequest('Courses/getCourses', courseIdFD) as [string, FormData])
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

            return await axiosInstance.post(...formRequest('Courses/createCourse', fd) as [string, FormData]).then(
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

            return await axiosInstance.post(...formRequest('Courses/updateCourse', fd) as [string, FormData]).then(
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

            return await axiosInstance.post(...formRequest('Courses/updateCourse', fd) as [string, FormData]).then(
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

            return await axiosInstance.post(...formRequest('Courses/deleteCourses', fd) as [string, FormData]).then(
                r => {
                    return r.data
                },
                e => {
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


        // async checkSessionToken() {
        // 	return await axiosInstance.post(...formRequest('checkSessionToken') as [string]).then(
        // 		r => {
        // 			return r.data
        // 		},
        // 		e => {
        // 			console.log(e);
        // 			return e.response.data
        // 		}
        // 	)
        // },


        async toggleNotifications(): Promise<void> {
            const fd = new FormData()
            fd.append('identifier', this.popup.additionFields['identifier' as keyof PopupAdditionFields] as string);
            fd.append('sys_notifications', this.popup.additionFields['sys_notifications' as keyof PopupAdditionFields] as string);

            return await axiosInstance.post(...formRequest('Users/toggleNotifications', fd) as [string, FormData]).then(
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

            return await axiosInstance.post(...formRequest('Content/getContent', contentIdFD) as [string, FormData])
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

            return await axiosInstance.post(...formRequest('Content/getTypes', pageNameFD) as [string, FormData])
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

            return await axiosInstance.post(...formRequest('Content/createContent', fd) as [string, FormData]).then(
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

            return await axiosInstance.post(...formRequest('Content/updateContent', fd) as [string, FormData]).then(
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
            return await axiosInstance.post(...formRequest('Content/deleteContent', fd) as [string, FormData]).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async updateContentOrder(oldContentKeysOrder: string[], newContentKeysOrder: string[]): Promise<void> {
            const fd = new FormData();

            fd.append("old_content_keys_order", JSON.stringify(oldContentKeysOrder))
            fd.append("new_content_keys_order", JSON.stringify(newContentKeysOrder))

            return await axiosInstance.post(...formRequest('Content/updateContentOrder', fd) as [string, FormData]).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },


        async getLogsInfo(): Promise<void> {
            return await axiosInstance.post(...formRequest('Logs/getLogsSizes') as [string]).then(
                r => {
                    return r.data.data
                },
                e => {
                    return e.response.data
                }
            )
        },
        async clearLogs(domainId: string): Promise<void> {
            const fd = new FormData()
            fd.append('domain_id', domainId);
            return await axiosInstance.post(...formRequest('Logs/clearLogs', fd) as [string, FormData]).then(
                r => {
                    return r.data
                },
                e => {
                    return e.response.data
                }
            )
        },
    },
})