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
    interestGroups: {
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
      localStorage.setItem(AUTH_TOKEN_STORE, `Bearer ${token}`);
    },
    //interest groups
    setInterestGroups(state, interestGroups) {
      state.interestGroups.list = interestGroups;
    },
    setInterestGroupCount(state, interestGroupCount) {
      state.interestGroups.count = interestGroupCount;
    },
    // events
    setEvents(state, events) {
      state.events.list = events;
    },
    setEventCount(state, eventCount) {
      state.events.count = eventCount;
    },
  },
  actions: {
    // user
    async register({ commit }, user) {
      console.log('registering', user)
      const { data } = await axios.post('/api/auth/register', user);

      return data;
    },
    async login({ commit }, login) {
      const { data } = await axios.post('/api/auth/login', {
        username: login.username,
        password: login.password,
      });

      if (data.status) {
        commit('setUser', data.user);
        commit('setUserToken', data.token);
      }
    },
    async loadMe({ commit }) {
      const { data } = await axios.get('/api/users/me');
      if (data.status) {
        console.log('setting user', data.user)
        commit('setUser', data.user);
      }

      return data;
    },

    // interest group
    async listInterestGroups({ commit }) {
      const { data } = await axios.get('/api/interests');

      commit('setInterestGroups', data.results);
      commit('setInterestGroupCount', data.count);
    },
    async createInterestGroup({ commit }, interestGroup) {
      const { data } = await axios.post('/api/interests', {
        title: interestGroup.title,
      });

      return data;
    },

    // event
    async createEvent({ commit }, event) {
      console.log('creating event', JSON.stringify(event, null, 2))
      const { data } = await axios.post('/api/events', {
        title: event.title,
        description: event.description,
        date: event.date,
        interestGroupId: event.interestGroupId,
      });

      return data;
    },
    async listEvents({ commit }) {
      const { data } = await axios.get('/api/events');

      commit('setEvents', data.results);
      commit('setEventCount', data.count);
    },
    async createEventCover({ commit }, { eventId, formData }) {
      const { data } = await axios.post(`/api/events/${eventId}/cover`, formData);

      return data;
    },
    async createInterestGroupCover({ commit }, { interestGroupId, formData }) {
      const { data } = await axios.post(`/api/interests/${interestGroupId}/cover`, formData);

      return data;
    },

    // sign up
    async createInterestGroupSignUp({ commit }, { interestGroupId }) {
      const { data } = await axios.post(`/api/me/addInterestGroup`, { interestGroupId });

      return data;
    },
    async createEventSignUp({ commit }, { eventId }) {
      const { data } = await axios.post(`/api/me/addEvent`, { eventId });

      return data;
    },

    // chat
    async createInterestGroupChat({ commit }, { interestGroupId, content }) {
      const { data } = await axios.post(`/api/interests/`, { content, interestId: interestGroupId });

      return data;
    },
    async createEventChat({ commit }, { eventId, message }) {
      const { data } = await axios.post(`/api/events/${eventId}/chat`, { message });

      return data;
    },
  },
});
