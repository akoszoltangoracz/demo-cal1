const EventForm = Vue.component('event-form', {
  data: () => ({
    form: {
      title: '',
      description: '',
      date: '2022-06-30',
      interestGroupId: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createEvent',
      'listEvents',
    ]),
    async doCreateEvent() {
      await this.createEvent(this.form);
      await this.listEvents();
    }
  },
  computed: {
    ...Vuex.mapState([
      'interestGroups',
    ]),
  },
  template: `
    <div>
      <fieldset><legend>event form</legend>
        <label>title</label><input type="text" v-model="form.title" />
        <label>description</label><input type="text" v-model="form.description" />
        <label>date</label><input type="text" v-model="form.date" />
        <label>interest group</label>
        <select v-model="form.interestGroupId">
          <option v-for="interestGroup in interestGroups.list" :key="interestGroup._id" :value="interestGroup._id">{{interestGroup.title}}</option>
        </select>

        <button @click.prevent="doCreateEvent">create event</button>
      </fieldset>
    </div>
  `,
});

const EventItem = Vue.component('event-item', {
    props: ['event'],
    template: `
      <li>
        {{event.title}} (interest group id {{event.interestGroupId}})
        <img v-if="event.coverUrl" :src="event.coverUrl" style="maxWidth: 50px" />
        <event-sign-up :event="event" />
        (interested users
          <span v-for="userId in event.userIds" :key="userId">{{userId}}</span>  
        )
      </li>
    `
  });
  
  const EventList = Vue.component('event-list', {
    computed: {
      ...Vuex.mapState([
        'events',
      ]),
    },
    methods: {
      ...Vuex.mapActions([
        'listEvents',
      ]),
    },
    async mounted() {
      await this.listEvents();
    },
    template: `
      <div>
        <h3>event list</h3>
        count: <span>{{events.count}}</span>
        <ul>
          <event-item v-for="event in events.list" :key="event._id" :event="event" />
        </ul>
      </div>
    `,
  });

const EventCoverForm = Vue.component('event-cover-form', {
  data: () => ({
    form: {
      eventId: '',
    }
  }),
  computed: {
    ...Vuex.mapState([
      'events',
    ]),
  },
  methods: {
    ...Vuex.mapActions([
      'listEvents',
      'createEventCover'
    ]),
    async doCreateEventCover() {
      const elem = document.getElementById('event-cover');
      console.log('files', elem.files)
      const formData = new FormData();
      formData.append('coverFile', elem.files[0]);

      await this.createEventCover({ eventId: this.form.eventId, formData });
    },
  },
  async mounted() {
    await this.listEvents();
  },
  template: `
    <div>
      <fieldset>
        <legend>event cover</legend>
        <select v-model="form.eventId">
          <option v-for="event in events.list" :key="event._id" :value="event._id">{{event.title}}</option>
        </select>
        <input type="file" id="event-cover" />
        <button @click.prevent="doCreateEventCover">add cover</button>
      </fieldset>
    </div>
  `,
});


const EventSignUp = Vue.component('event-sign-up', {
  props: ['event'],
  methods: {
    ...Vuex.mapActions([
      'loadMe',
      'createEventSignUp'
    ]),
    async doSignUp() {
      await this.createEventSignUp({ eventId: this.event._id });
      await this.loadMe();
    },
  },
  template: `
    <span>
      <button @click.prevent="doSignUp">Sign up</button>
    </span>
  `
});

const EventChatForm = Vue.component('event-chat-form', {
  data: () => ({
    form: {
      message: '',
      eventId: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createEventChat',
    ]),
    async doCreateEventChat() {
      await this.createEventChat(this.form);
    }
  },
  computed: {
    ...Vuex.mapState([
      'events',
    ]),
  },
  template: `
    <div>
      <fieldset>
        <legend>event chat message</legend>
        <select v-model="form.eventId">
          <option v-for="event in events.list" :key="event._id" :value="event._id">{{event.title}}</option>
        </select>
        <label>message</label><input v-model="form.message" type="text"/>
        <button @click.prevent="doCreateEventChat">send message</button>
      </fieldset>
    </div>
  `
});