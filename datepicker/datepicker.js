import calendar from '../calendar/index.vue';

export default {
  name: 'datepicker',
  components: {
    calendar,
  },
  props: {
    'locale': {
      type: String,
      default: 'en-US',
    },
    'label': {
      type: String,
      default: 'Choose a date',
    },
    'inputs': {
      type: Object,
      default() {
        return {
          local: 'date-local',
          day: 'date-day',
          month: 'date-month',
          year: 'date-year',
        };
      },
      validator(value) {
        const keys = ['local', 'day', 'month', 'year'];

        // Make sure all three keys are there
        if (JSON.stringify(Object.keys(value)) !== JSON.stringify(keys)) {
          return false;
        }

        return true;
      },
    },
    'microcopy': {
      type: Object,
      default() {
        return {
          today: 'Today: {date}',
          next: 'Next Month',
          previous: 'Previous Month',
          open: 'Open Calendar',
          cancel: 'Cancel',
        };
      },
      validator(value) {
        const keys = ['today', 'next', 'previous', 'open', 'cancel'];

        // Make sure all required keys are there
        if (keys.find(k => value[k] === undefined)) {
          return false;
        }

        // Make sure `today` includes `{date}`
        if (value.today.indexOf('{date}') < 0) {
          return false;
        }

        return true;
      },
    },
    'data-value': {
      type: Object,
      default() {
        return {
          year: '',
          month: '',
          day: '',
        };
      },
    },
    'name': {
      type: String,
    },
    'icon-close': {
      type: String,
      default: 'fa fa-close',
    },
    'icon-calendar': {
      type: String,
      default: 'fa fa-calendar',
    },
  },
  methods: {
    t(value, props = {}) {
      let output = value;
      Object.keys(props).forEach((prop) => {
        const replace = new RegExp(`{${prop}}`, 'g');
        output = output.replace(replace, props[prop]);
      });

      return output;
    },
    open(e) {
      e.preventDefault();
      const { calendar: cal } = this.$children[0].$refs;
      this.$el.querySelector('.datepicker__popup').setAttribute('data-state', 'open');
      cal.find(elem => elem.getAttribute('tabindex') === '0').focus();
    },
    tabcapture(e) {
      const { target } = e;
      const { calendar: cal } = this.$children[0].$refs;

      if (target.classList.contains('calendar__link') && e.shiftKey === true) {
        const cancel = this.$refs.cancel;
        e.preventDefault();
        cancel.focus();
      } else if (target.classList.contains('cancel') && e.shiftKey === false) {
        const item = cal.find(elem => elem.getAttribute('tabindex') === '0');
        e.preventDefault();
        item.focus();
      }
    },
    cancel(e) {
      let state = this.$refs.popup.getAttribute('data-state');
      if(state && state==='open') {
        e.preventDefault();
        this.$refs.openButton.focus();
        this.$refs.popup.setAttribute('data-state', 'closed');
      }
    },
    select(target) {
      this.$refs.popup.setAttribute('data-state', 'closed');
      this.$refs.input.focus();

      this.value = {
        year: target.dataset.year,
        month: target.dataset.month,
        day: target.dataset.day
      };

      this.$emit('dateSelected', target);
      this.$emit('input', {
        value: this.value,
        formatted: this.formattedValue
      });
    },
    setValue(e) {
      let calendar = this.$refs.calendar;

      if(e.currentTarget.value) {
        let date = new Date(e.currentTarget.value);

        this.value = {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        };
        
        calendar.setCurrent(this.value.month, this.value.year);
      } else {
        let now = new Date();
        calendar.setCurrent(now.getMonth(), now.getFullYear());
      }
      this.$emit('input', {
        value: this.value,
        formatted: this.formattedValue
      });
    },
    strpad(number) {
      return String('00' + number).slice(-2);
    }
  },
  computed: {
    selectedLocal() {
      if (!this.value || isNaN(this.value.year) || isNaN(this.value.month) || isNaN(this.value.day))
        return '';

      const date = new Date();
      date.setFullYear(this.value.year);
      date.setMonth(this.value.month);
      date.setDate(this.value.day);

      return date.toLocaleDateString(this.locale);
    },
    formattedValue() {
      if (!this.value || isNaN(this.value.year) || isNaN(this.value.month) || isNaN(this.value.day))
        return '';

      const date = new Date();
      date.setFullYear(this.value.year);
      date.setMonth(this.value.month);
      date.setDate(this.value.day)

      return date.getFullYear()+'-'+this.strpad(date.getMonth()+1)+'-'+this.strpad(date.getDate());
    }
  },
  data() {
      let value = this.dataValue || {
        year: '',
        month: '',
        day: ''
      };
      return {
        value: value
      }
  },
};
