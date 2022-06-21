const UserData = Vue.component('user-data', {
  computed: {
    ...Vuex.mapState([
      'user',
    ]),
  },
  template: `
    <div>
      <span v-if="!user.user">user not logged in</span>
      <span v-if="user.user">logged in user: <strong>{{user.user.username}}</strong></span>
    </div>
  `
});

const LoginForm = Vue.component('login-form', {
  data: () => ({
    form: {
      username: '',
      password: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'login',
    ]),
    async doLogin() {
      console.log(JSON.stringify(this.form, null ,2))
      this.login(this.form);
    }
  },
  template: `
    <div>
      <fieldset>
        <legend>login</legend>
        <label>username</label><input v-model="form.username" type="text"/>
        <label>password</label><input v-model="form.password" type="password"/>
        <button @click.prevent="doLogin">Login</button>
      </fieldset>
    </div>
  `
});

const RegisterForm = Vue.component('register-form', {
  data: () => ({
    form: {
      username: '',
      password: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'register',
    ]),
    async doRegister() {
      this.register(this.form);
    }
  },
  template: `
    <div>
      <fieldset>
        <legend>register</legend>
        <label>username</label><input v-model="form.username" type="text"/>
        <label>password</label><input v-model="form.password" type="password"/>
        <button @click.prevent="doRegister">register</button>
      </fieldset>
    </div>
  `
});

const ActivityForm = Vue.component('activity-form', {
  data: () => ({
    form: {
      title: '',
      description: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createActivity',
      'listActivities',
    ]),
    async doCreateActivity() {
      await this.createActivity(this.form);
      await this.listActivities();
    }
  },
  template: `
    <div>
      <fieldset>
        <legend>create activity</legend>
        <label>title</label><input v-model="form.title" type="text"/>
        <label>description</label><textarea v-model="form.description" type="password"></textarea>
        <button @click.prevent="doCreateActivity">create activity</button>
      </fieldset>
    </div>
  `
});

const ActivityItem = Vue.component('activity-item', {
  props: ['activity'],
  template: `
    <li>
      {{activity.title}}
    </li>
  `
});

const ActivityList = Vue.component('activity-list', {
  computed: {
    ...Vuex.mapState([
      'activities',
    ]),
  },
  methods: {
    ...Vuex.mapActions([
      'listActivities',
    ]),
  },
  async mounted() {
    await this.listActivities();
  },
  template: `
    <div>
      <h3>activity list</h3>
      count: <span>{{activities.count}}</span>
      <ul>
        <activity-item v-for="activity in activities.list" :key="activity._id" :activity="activity" />
      </ul>
    </div>
  `,
});

const DemoPage = Vue.component('demo-page', {
  template: `
  <div>
    <h1>demo</h1>

    <user-data />
    <login-form />

    <register-form/>

    <h2>activities</h2>

    <activity-form />

    <activity-list />
  </div>`,
});

const routes = [
  {path: '/', redirect: '/demo'},
  {path: '/demo', component: DemoPage},
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  el: "#app",
  router,
  store,
  template: `
    <router-view/>
  `
});
