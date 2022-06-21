const AUTH_TOKEN_STORE = 'demo-cal1-token';

axios.interceptors.request.use(function(config) {
  config.headers.authorization = localStorage.getItem(AUTH_TOKEN_STORE); // TODO base it on the store

  return config;
});

const store = new Vuex.Store({
  state: {
    user: {
      user: null,
      token: null,
    },
    activities: {
      list: [],
      count: 0,
    },
    events: {
      list: [],
      count: 0
    },
  },
  mutations: {
    setUser(state, user) {
      state.user.user = user;
    },
    setUserToken(state, token) {
      state.user.token = token;
      localStorage.setItem(AUTH_TOKEN_STORE, token);
    },
    setActivities(state, activities) {
      state.activities.list = activities;
    },
    setActivityCount(state, activitiesCount) {
      state.activities.count = activitiesCount;
    },
  },
  actions: {
    async register({ commit }, user) {
      console.log('registering', user)
      const { data } = await axios.post('/api/register', user);

      return data;
    },
    async login({ commit }, login) {
      const { data } = await axios.post('/api/login', {
        username: login.username,
        password: login.password,
      });

      if (data.status) {
        commit('setUser', data.user);
        commit('setUserToken', data.token);
      }
    },
    async listActivities({ commit }) {
      const { data } = await axios.get('/api/activities');

      commit('setActivities', data.results);
      commit('setActivityCount', data.count);
    },
    async createActivity({ commit }, activity) {
      const { data } = await axios.post('/api/activities', {
        title: activity.title,
      });

      return data;
    },
  },
});
