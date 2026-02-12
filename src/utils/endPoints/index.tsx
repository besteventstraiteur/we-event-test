export const BASEURL = import.meta.env.VITE_API_URL;
export const GOOGLE_PLACE_API = import.meta.env.VITE_PLACE_API;
export const CONTENT = {
  UPDATE_CONTENT: `${BASEURL}/content/update-web-content`,
  GET_CONTENT: `${BASEURL}/content/get-web-content`,
};
export const PLANS = {
  GET_ALL_PLANS: `${BASEURL}/subscription/all-plans`,
  START_FREE_TRIAL: `${BASEURL}/subscription/start-free-trial`,
  START_SUBSCRIPTION: `${BASEURL}/subscription/start-subscription`,
};

export const ProductEndPoint = {
  GET_ALL_PRODUCTS: `${BASEURL}/products/all-products`,
};

export const ContactFormSubmit = {
  CREATE: `${BASEURL}/contact-inquiry/create`,
};
export const CREATED_BLOCKS = {
  GET_ALL_COVERS: `${BASEURL}/blocks/all-blocks`,
  VIEW_BLOCk: `${BASEURL}/blocks/get`,
  EDIT_BLOCk: `${BASEURL}/blocks/update`,
  PUBLISH_BLOCK: `${BASEURL}/blocks/publish`,
  CREATE_BLOCK: `${BASEURL}/blocks/create`,
};

export const AUTH = {
  LOGIN: `${BASEURL}/auth/login`,
  GETUSERDETAILS: `${BASEURL}/users/me`,
  SIGNUP: `${BASEURL}/auth/signup`,
  VERIFY: `${BASEURL}/auth/verify/sp/email`,
  RESEND_OTP: `${BASEURL}/auth/resend-otp/sp/email`,
  SEND_OTP: `${BASEURL}/auth/send-otp/sp/email`,
  FORGET_PASSSWORD: `${BASEURL}/auth/forgot-password`,
  OTP_VERIFIED: `${BASEURL}/auth/verify-otp`,
  UPDATE_PROFILE: `${BASEURL}/users`,
  BUSINESS_PROFILE: `${BASEURL}/business/profile`,
  BUSINESS_RATING: `${BASEURL}/business/ratings`,
  RESET_PASSWORD: `${BASEURL}/auth/reset-password`,
  DELETE: `${BASEURL}/auth/delete`,
  DISABLE_MFA: `${BASEURL}/auth/disable-mfa`,
  ENABLE_MFA: `${BASEURL}/auth/enable-mfa`,
  LOGIN_MFA: `${BASEURL}/auth/sp/verify-mfa`,
  SOCIAL_LOGIN: `${BASEURL}/auth/social`,
  SESSIONS: `${BASEURL}/auth/sessions`,
  CONTACT: `${BASEURL}/contact`,
};
export const UPLOAD_FILE = {
  UPLOAD: `${BASEURL}/common/upload`,
};

export const PROVIDER = {
  GET_ALL_CATEGORIES: `${BASEURL}/events/category/all`,
  GET_ALL_CATEGORIES_WITHOUT_PAGINATION: `${BASEURL}/events/category/list`,
  GET_ALL_SERVICES: `${BASEURL}/services/list`,
  REQUEST_QUOTE: `${BASEURL}/business/request/quote`,
  GET_BY_ID_DETAILS: `${BASEURL}/business/request/quote`,
  UPDATE_STATUS: `${BASEURL}/business/request/quote`,
  UPGRADE_SUBSCRIPTION:`${BASEURL}/subscription/upgrade`,
  GET_ALL_PROFILES: `${BASEURL}/business/nearby`,
  GET_PROFILE: `${BASEURL}/business/profile/me`,
  GET_ALL_CATEGORIES_EVENTS: `${BASEURL}/events/category/all`,
  CREATE_EVENT: `${BASEURL}/events`,
  GET_EVENTS: `${BASEURL}/events/me`,
  GUEST_LIST: `${BASEURL}/events/guest/all`,
  ADD_GUEST: `${BASEURL}/events/guest`,
  GET_EVENT_BY_ID: `${BASEURL}/events/detail`,
  GET_BUDGET_BY_ID: `${BASEURL}/events/budget/detail`,
  UPDATE_GUEST: `${BASEURL}/events/guest`,
  ADD_BUDGET: `${BASEURL}/events/budget/add`,
  ADD_EXPENSE: `${BASEURL}/events/expense/add`,
  DELETE_EXPENSE: `${BASEURL}/events/expense`,
  GET_BY_ID: `${BASEURL}/events/expense/add`,
  UPDATE_EXPENSE: `${BASEURL}/events/expense`,
  REVIEW: `${BASEURL}/business/ratings`,
  FAVORITES: `${BASEURL}/users/favorites`,
  DASHBOARD: `${BASEURL}/stats/partner/dashboard`,
  ADD_SUGESTION: `${BASEURL}/feedback`,
  ROADMAP: `${BASEURL}/roadmap/public-post`,
  ROADMAP_OLD: `${BASEURL}/roadmap`,
  FEEDBACK: `${BASEURL}/feedback/public-post`,
  PLANS: `${BASEURL}/subscription/plan/public`,
  SUBSCRIBE: `${BASEURL}/subscription/subscribe`,
  MY_SUBSCRIPTION: `${BASEURL}/subscription/me`,
  CANCEL_SUBSCRIPTION: `${BASEURL}/subscription/cancel`,
  OWN_AFFILATE_DATA: `${BASEURL}/affiliate/me/dashboard`,
  GENERATE_CODE: `${BASEURL}/affiliate/generate-referral-code`,
  GET_ALL_RANK: `${BASEURL}/affiliate/rank/public`,
  GET_NETWORK: `${BASEURL}/affiliate/me/network`,
  GET_BANKS: `${BASEURL}/bank`,
  PAYOUT: `${BASEURL}/payout`,
  CHECK_CODE: `${BASEURL}/affiliate/validate-referral-code`,
  DELETE_EVENT: `${BASEURL}/events`,
  UPDATE_EVENT: `${BASEURL}/events`,
  GET_TASKS: `${BASEURL}/events/task/list`,
  TASKS: `${BASEURL}/events/task`,
  SITE: `${BASEURL}/events/site`,
  SITE_CHECK: `${BASEURL}/events/site/check`,
  GUESTBOOK: `${BASEURL}/events/site/guest-message`,
  GUEST_MESSAGES: `${BASEURL}/events/site/guest-messages`,
  UPLOAD_SHOWCASE: `${BASEURL}/business/profile/files`,
  DELETE_VIDEO: `${BASEURL}/business/profile/video`,
  DELETE_DOCUMENT: `${BASEURL}/business/profile/document`,
  GUEST_OVERVIEW: `${BASEURL}/events/guest/overview`,
  DELETE_GUEST: `${BASEURL}/events/guest`,
  RESEND_INVITATION: `${BASEURL}/events/guest`,
  trainingSTATS: `${BASEURL}/training/stats`,
  trainingVIDEOS_ALL: `${BASEURL}/training/video/all`,
  DELETE_VIDEO_REPLAY: `${BASEURL}/training/video`,
  TRAINING_ADD_VIDEO: `${BASEURL}/training/video`,
  trainingCOURSES_ALL: `${BASEURL}/training/course/all`,
  GET_COURSE_BY_ID: `${BASEURL}/training/course`,
  ADD_TRAINING_COURSE: `${BASEURL}/training/course`,
  UPDATE_TRAINING_COURSE: `${BASEURL}/training/course`,
  GET_LIVE_SESSIONS: `${BASEURL}/training/live-session/all`,
  DELETE_LIVE_SESSION: `${BASEURL}/training/live-session`,
  ADD_LIVE_SESSION: `${BASEURL}/training/live-session`,
  GET_BUSINESS_MEETINGS: `${BASEURL}/training/business-meeting/all`,
  DELETE_BUSINESS_MEETING: `${BASEURL}/training/business-meeting`,
  BUSINESS_MEETING: `${BASEURL}/training/business-meeting`,
  TOP_TRAININGS: `${BASEURL}/training/top-trainings`,
  TRAINING_REG_CHART: `${BASEURL}/training/registrations-chart`,
  TRAINING_VIDEO_LIST: `${BASEURL}/training/video/list`,
  TRAINING_VIDEO: `${BASEURL}/training/video`,
  TRAINING_COURSE_LIST: `${BASEURL}/training/course/list`,
  TRAINING_COURSE: `${BASEURL}/training/module`,
  TRAINING_COURSE_START: `${BASEURL}/training/course/start`,
  COMPLETE_COURSE_MODULE: `${BASEURL}/training/course/module`,
  TRAINING_LIVE_SESSION_REGISTER: `${BASEURL}/training/live-session/register`,
  TRAINING_LIVE_SESSION_LIST: `${BASEURL}/training/live-session/list`,
  BUSINESS_MEETING_LIST: `${BASEURL}/training/business-meeting/list`,
  BUSINESS_MEETING_REGISTER: `${BASEURL}/training/business-meeting/register`,
  APPLY_INTELLIGENT_DISTRIBUTION: `${BASEURL}/events/budget/distribute`,
  CERTIFICATES: `${BASEURL}/training/certificates`,
  GET_CONVERSTION_BY_ID: `${BASEURL}/events/conversation`,
  GET_CONVERSTIONS: `${BASEURL}/events/conversation/list`,
  SEND_MESSAGE: `${BASEURL}/events/conversation/send-message`,
  GET_CONTACTS: `${BASEURL}/crm/contact/list`,
  CHECK_EMAIL_EXIST: `${BASEURL}/crm/contact/check-email-exists`,
  ADD_CONTACT: `${BASEURL}/crm/contact`,
  UPDATE_CONTACT: `${BASEURL}/crm/contact`,
  IMPORT_CONTACTS: `${BASEURL}/crm/contact/import`,
  RECOMENDATION_LIST: `${BASEURL}/recommendation/list`,
  SEND_RECOMENDATION: `${BASEURL}/recommendation/sent`,
  RECOMENDATION: `${BASEURL}/recommendation`,
  RECOMENDATION_RECEIVED: `${BASEURL}/recommendation/received`,
  RECOMENDATION_SENT: `${BASEURL}/recommendation/sent`,
  RECOMENDATION_CREATE_LIST: `${BASEURL}/recommendation/list/create`,
  RECOMENDATION_SEND: `${BASEURL}/recommendation`,
  RECOMENDATION_OVERVIEW: `${BASEURL}/recommendation/overview`,
  RECOMENDATION_ALL: `${BASEURL}/recommendation/all`,
  SUBSCRIBE_NEWSLETTER: `${BASEURL}/newsletter/subscribe`,
  SUBSCRIBE_ALL: `${BASEURL}/newsletter/all-subscriber`,
  SUBSCRIBE_SEND_MESSAGE: `${BASEURL}/newsletter`,
  UPDATE_GUEST_PLAN: `${BASEURL}/events/guest/seating-plan`,
  GUEST_PLAN: `${BASEURL}/events/guest/seating-plan`,
  CATELOGUE: `${BASEURL}/crm/catalogue`,
  CREATE_TEMPLATE: `${BASEURL}/crm/templates`,
  TEMPLATE: `${BASEURL}/crm/templates`,
  PIPLINE: `${BASEURL}/crm/pipeline`,
  OPPURTINITES: `${BASEURL}/crm/opportunies`,
  STAGE: `${BASEURL}/crm/pipeline`,
  AICHAT: `${BASEURL}/crm/assistant-ai/chat`,
  AICHATCONVERSATION: `${BASEURL}/crm/assistant-ai`,
  TREASURY: `${BASEURL}/crm/treasury`,
  DOCUMENT: `${BASEURL}/crm/documents`,
  DELETE_TRAINING_COURSE: `${BASEURL}/training/course`,
  MEETING: `${BASEURL}/crm/vendor-meeting`,
  CONNECT_GMAIL: `${BASEURL}/crm/mail/connect/gmail`,
  MAIL_LIST: `${BASEURL}/crm/mail/list`,
  MAIL: `${BASEURL}/crm/mail`,
  IMPORT: `${BASEURL}/business/ratings/import`,
  GET_IMPORTED_REVIEWS: `${BASEURL}/business/ratings`,
  DELETE_REVIEW: `${BASEURL}/business/ratings/delete-review`,
  ANLYTICS_TRACK: `${BASEURL}/analytics/track`,
  SEND_CONTACT_EMAIL: `${BASEURL}/crm/contact/send-authorization-email`,
  PAYMENT_SETTING: `${BASEURL}/crm/finance`,
  SUPPLIER: `${BASEURL}/crm/supplier`,
  NOTIFACTIONS: `${BASEURL}/notification`,
  EMAIL_TEMPLATES: `${BASEURL}/crm/email-templates`,
  EMAIL_TEMPLATES_LIST: `${BASEURL}/crm/email-templates/list`,
  NEWSLETTER_STATS: `${BASEURL}/newsletter/stats`,
};

export const CLIENT = {
  DASHBOARD: `${BASEURL}/stats/client/dashboard`,
};

export const ADMIN = {
  USERS: `${BASEURL}/users/all`,
  STATS: `${BASEURL}/stats/admin/dashboard`,
  AUTH: `${BASEURL}/auth`,
  CONTACT_ENQUIRES: `${BASEURL}/contact/all`,
  GET_ALL_PAGES: `${BASEURL}/pages/all`,
  UPDATE_PROFILE: `${BASEURL}/business`,
  RESERVE_SPACE: `${BASEURL}/spaces/rented/reserve`,
  PAGES: `${BASEURL}/pages`,
  GET_BY_SLUG: `${BASEURL}/pages/static`,
  TRANSLATION: `${BASEURL}/common/translate`,
  CREATE_CONTENT: `${BASEURL}/pages`,
  ROADMAP: `${BASEURL}/roadmap`,
  SUBSCRIPTION_LIST: `${BASEURL}/subscription/all`,
  PLANS_LIST: `${BASEURL}/subscription/plan/list`,
  FEEDBACK: `${BASEURL}/feedback/all`,
  APPROVE_REJECT_FEEDBACK: `${BASEURL}/feedback`,
  PLANS: `${BASEURL}/subscription/plan/all`,
  CREATE_PLAN: `${BASEURL}/subscription/plan`,
  LEADERBOARD: `${BASEURL}/affiliate/admin/leaderboard`,
  AFFILATE_USER: `${BASEURL}/affiliate/admin/users`,
  ASSIGN_SPONSAR_CODE: `${BASEURL}/affiliate/admin/assign-referral-code`,
  COMMINSION_HISTORY: `${BASEURL}/affiliate/admin/comission-history`,
  AFFILATE_DASHBOARD: `${BASEURL}/affiliate/admin/dashboard`,
  VIEW_TREE: `${BASEURL}/affiliate/admin/users`,
  CANCEL_SUBSCRIPTION: `${BASEURL}/subscription`,
  GET_PAYOUTS: `${BASEURL}/payout/all`,
  CHANGE_PAYOUT_STATUS: `${BASEURL}/payout/status`,
  MANUAL_UPGRADE: `${BASEURL}/subscription/manual-upgrade`,
  DELETE_PLAN: `${BASEURL}/subscription/plan`,
  CREATE_USER: `${BASEURL}/auth/create-manual-user`,
  EDIT_USER: `${BASEURL}/users`,
  trainingVIDEOS_ALL: `${BASEURL}/training/videos/all`,
  DELETE_USER: `${BASEURL}/users`,
};

export const BUSINESS = {
  GET_PROFILE: `${BASEURL}/business`,
  UPDATE_PROFILE: `${BASEURL}/business`,
  RESERVE_SPACE: `${BASEURL}/spaces/rented/reserve`,
};

export const USERS = {
  GET_ALL_USERS: `${BASEURL}/user/all`,
  EARNING: `${BASEURL}/stats/earninig`,
};
export const SERVICES = {
  GET_ALL_SERVICES: `${BASEURL}/business/services`,
};
export const DASHBOARD = {
  GET: `${BASEURL}/stats/dashboard`,
};
export const CHAT = {
  ALL: `${BASEURL}/chat/conversations`,
  CONV: `${BASEURL}/chat/conversation`,
};
export const NOTIFICATION = {
  SET: `${BASEURL}/notification/prefrence`,
  GET_PREFRENCE: `${BASEURL}/notification/prefrence`,
  LIST: `${BASEURL}/notification/list`,
  MARK_AS_READ: `${BASEURL}/notification`,
};
export const SPACES = {
  GET_MY_SPACES: `${BASEURL}/spaces/rented/listings`,
  GET_RENTED_SPACES: `${BASEURL}/spaces/rented/me`,
  GET_FACILITIES: `${BASEURL}/category/facility`,
  GET_SERVICES: `${BASEURL}/category/service`,
  GET_SHOPS: `${BASEURL}/spaces/rented/me/active-stores`,
  GET_SUB_SERVICES: `${BASEURL}/category/sub-service`,
  CREATE_SPACE: `${BASEURL}/spaces`,
  GET_SPACE_DETAILS: `${BASEURL}/spaces/rented/listing`,
  GET_RENTED_SAPCE_DETAILS: `${BASEURL}/spaces/rented/me`,
  CREATE_SERVICE: `${BASEURL}/business/services`,
  EDIT_SERVICE: `${BASEURL}/business`,
  GET_SERVICE_DETAILS: `${BASEURL}/business/services`,
  DELETE_SERVICE: `${BASEURL}/business/services`,
  PAY_RENT: `${BASEURL}/spaces/rented`,
  GET_PAYMENT_HISTORY: `${BASEURL}/spaces/rented/payment-history`,
};
export const STRIPE = {
  CREATE: `${BASEURL}/stripe/card/attach`,
  LIST: `${BASEURL}/stripe/card/list`,
};

export const CUSTOMER = {
  CHECK_PHONE_EXIST: `${BASEURL}/auth/check-phone-exists`,
  CREATE: `${BASEURL}/auth/create-user-manual`,
  LIST: `${BASEURL}/business/all-customers`,
};
export const APPOINTNMETS = {
  CHECK_PHONE_EXIST: `${BASEURL}/auth/check-phone-exists`,
  CREATE: `${BASEURL}/appointments/create-offline`,
  LIST: `${BASEURL}/appointments`,
  FETCH_USER: `${BASEURL}/appointments/fetch-user`,
  COMPLETE: `${BASEURL}/appointments`,
};
export const PAYOUT = {
  REQUEST: `${BASEURL}/bank/payout`,
  FETCH_BALANCE: `${BASEURL}/wallet/balance`,
  FETCH_BANK_DETAILS: `${BASEURL}/bank`,
  UPDATE_BANK_DETAILS: `${BASEURL}/bank`,
};
export const TEMPLATES = {
  CREATE: `${BASEURL}/templates/create`,
  LIST: `${BASEURL}/templates/all-templates`,
  GET_TEMPLATE: `${BASEURL}/templates/get`,
  UPDATE: `${BASEURL}/templates/update`,
  DELETE: `${BASEURL}/templates/delete`,
};

export const MEDIA_LIBRARY = {
  CREATE_MEDIA: `${BASEURL}/user-library/create`,
  MEDIA_LIST: `${BASEURL}/user-library/all-media`,
  MEDIA_LIST_AUDIO_CATEGORY: `${BASEURL}/content/get-web-content?key=AUDIO_LIBRARY`,
  PIXBY_LIST: `${BASEURL}/user-library/get-pixby-images`,
};

export const TEMPLATES_CATEGORY = {
  CREATE: `${BASEURL}/category/create`,
  LIST: `${BASEURL}/category/all-categories`,
  GET_TEMPLATE: `${BASEURL}/category/get`,
  UPDATE: `${BASEURL}/category/update`,
  DELETE: `${BASEURL}/category/delete`,
};

export const ACCOUNT = {
  CHANGE_PROFILE_IMAGE: `${BASEURL}/user/update-profile-image`,
  DELETE_PROFILE_IMAGE: `${BASEURL}/user/delete-profile-image`,
  UPDATE_ACCOUNT: `${BASEURL}/user/update-account`,
  UPDATE_ACCOUNT_PROFESSIONAL: `${BASEURL}/user/update-user-professional-details`,
  CHANGE_PASSWORD: `${BASEURL}/user/update-password`,
  EMAIL_SUBSCRIPTION: `${BASEURL}/user/email-subscription`,
};

export const PROJECTS = {
  GET_ALL_SECTORS: `${BASEURL}/sector/all-sectors`,
  GET_ALL_SUB_SECTORS: `${BASEURL}/sub-sector/all-sectors`,
};

export const ORGANIZATION = {
  GET_ORIGNATION: `${BASEURL}/organization/get`,
  CHANGE_LOGO: `${BASEURL}/organization/update-logo`,
  DELETE_LOGO: `${BASEURL}/organization/delete-logo`,
  INVITE_MEMBER: `${BASEURL}/organization/add-team-member`,
  CHANGE_DETAILS: `${BASEURL}/organization/update-details`,
  REMOVE_MEMBER: `${BASEURL}/organization/remove-team-member`,
  MANAGE_JOIN_REQUEST: `${BASEURL}/organization/manage-join-request`,
  ADD_FOLDER: `${BASEURL}/organization/create-folder`,
  EDIT_FOLDER: `${BASEURL}/organization/update-folder`,
  DELETE_FOLDER: `${BASEURL}/organization/delete-folder`,
};

export const PROJECTS_DETAILS = {
  CREATE_PROJECT: `${BASEURL}/project/create-project`,
  CLONE_PROJECT: `${BASEURL}/project/clone`,
  DELETE_PROJECT: `${BASEURL}/project/delete`,
  UPDATE_PROJECT: `${BASEURL}/project/update`,
  UPDATE_VISIBILITY: `${BASEURL}/project/update-visibility`,
  MOVE_FOLDER: `${BASEURL}/project/move-project`,
  GET_PROJECT_DTAILS: `${BASEURL}/project/get-details`,
  CHANGE_PROJECT_IMAGE: `${BASEURL}/project/update-user-project-image`,
  CHANGE_AVAILABILITY: `${BASEURL}/project/check-availability`,
};
