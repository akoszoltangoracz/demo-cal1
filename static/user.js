const UserData = Vue.component('user-data', {
  computed: {
    ...Vuex.mapState([
      'user',
    ]),
  },
  methods: {
    ...Vuex.mapActions([
        'loadMe',
      ]),
  },
  async mounted() {
    await this.loadMe();
  },
  template: `
    <div>
      <span v-if="!user.user">user not logged in</span>
      <div v-if="user.user">
        <div>logged in user: <strong>{{user.user.username}}</strong></div>
        <div>signed up for event: {{JSON.stringify(user.user.eventIds, null, 2)}}</div>
        <div>signed up for interest groups: {{JSON.stringify(user.user.interestGroupIds, null, 2)}}</div>
      </div>
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