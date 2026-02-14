/* ===== AIRTABLE CONFIGURATION ===== */
/* Munich Watch Fair – Exhibitor Portal
   Replace with your actual Airtable credentials when ready. */

var AIRTABLE_CONFIG = {
  API_KEY: '',
  BASE_ID: '',
  TABLES: {
    EXHIBITORS: 'Exhibitors',
    BOOKINGS: 'Bookings',
    EVENTS: 'Events'
  },
  FIELDS: {
    EXHIBITORS: {
      FIRST_NAME: 'First Name',
      LAST_NAME: 'Last Name',
      EMAIL: 'Email',
      COMPANY: 'Company',
      PHONE: 'Phone',
      VAT_ID: 'VAT ID',
      STREET: 'Street',
      ZIP: 'ZIP',
      CITY: 'City',
      CREATED: 'Created'
    },
    BOOKINGS: {
      EXHIBITOR: 'Exhibitor',
      EVENT: 'Event',
      TABLE_TYPE: 'Table Type',
      STATUS: 'Status',
      NOTES: 'Notes'
    }
  }
};

/* Future API endpoint (when backend is ready) */
var API_CONFIG = {
  BASE_URL: '',
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/exhibitor/profile',
    BOOKINGS: '/api/exhibitor/bookings'
  }
};
