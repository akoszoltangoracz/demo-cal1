const InterestGroupForm = Vue.component('interest-group-form', {
  data: () => ({
    form: {
      title: '',
      description: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createInterestGroup',
      'listInterestGroups',
    ]),
    async doCreateInterestGroup() {
      await this.createInterestGroup(this.form);
      await this.listInterestGroups();
    }
  },
  template: `
    <div>
      <fieldset>
        <legend>create interest group</legend>
        <label>title</label><input v-model="form.title" type="text"/>
        <label>description</label><textarea v-model="form.description" type="password"></textarea>
        <button @click.prevent="doCreateInterestGroup">create interest group</button>
      </fieldset>
    </div>
  `
});
  
const InterestGroupItem = Vue.component('interest-group-item', {
  props: ['interestGroup'],
  template: `
    <li>
      {{interestGroup.title}}
      <img v-if="interestGroup.coverUrl" :src="interestGroup.coverUrl" style="maxWidth: 50px" />
      <interest-group-sign-up :interestGroup="interestGroup" />
      (interested users
        <span v-for="userId in interestGroup.userIds" :key="userId">{{userId}}</span>  
      )
    </li>
  `
});

const InterestGroupList = Vue.component('interest-group-list', {
  computed: {
    ...Vuex.mapState([
      'interestGroups',
    ]),
  },
  methods: {
    ...Vuex.mapActions([
      'listInterestGroups',
    ]),
  },
  async mounted() {
    await this.listInterestGroups();
  },
  template: `
    <div>
      <h3>interest groups list</h3>
      count: <span>{{interestGroups.count}}</span>
      <ul>
        <interest-group-item v-for="interestGroup in interestGroups.list" :key="interestGroup._id" :interestGroup="interestGroup" />
      </ul>
    </div>
  `,
});

const InterestGroupCoverForm = Vue.component('interest-group-cover-form', {
  data: () => ({
    form: {
      interestGroupId: '',
    }
  }),
  computed: {
    ...Vuex.mapState([
      'interestGroups',
    ]),
  },
  methods: {
    ...Vuex.mapActions([
      'listInterestGroups',
      'createInterestGroupCover'
    ]),
    async doCreateInterestGroupCover() {
      const elem = document.getElementById('interest-group-cover');
      console.log('files', elem.files)
      const formData = new FormData();
      formData.append('coverFile', elem.files[0]);

      await this.createInterestGroupCover({ interestGroupId: this.form.interestGroupId, formData });
    },
  },
  async mounted() {
    await this.listInterestGroups();
  },
  template: `
    <div>
      <fieldset><legend>interest group cover</legend>
        <select v-model="form.interestGroupId">
          <option v-for="interestGroup in interestGroups.list" :key="interestGroup._id" :value="interestGroup._id">{{interestGroup.title}}</option>
        </select>
        <input type="file" id="interest-group-cover" />
        <button @click.prevent="doCreateInterestGroupCover">add cover</button>
      </fieldset>
    </div>
  `,
});

const InterestGroupSignUp = Vue.component('interest-group-sign-up', {
  props: ['interestGroup'],
  methods: {
    ...Vuex.mapActions([
      'loadMe',
      'createInterestGroupSignUp'
    ]),
    async doSignUp() {
      await this.createInterestGroupSignUp({ interestGroupId: this.interestGroup._id });
      await this.loadMe();
    },
  },
  template: `
    <span>
      <button @click.prevent="doSignUp">Sign up</button>
    </span>
  `
});

const InterestGroupChatForm = Vue.component('interest-group-chat-form', {
  data: () => ({
    form: {
      content: '',
      interestGroupId: '',
    },
  }),
  methods: {
    ...Vuex.mapActions([
      'createInterestGroupChat',
    ]),
    async doCreateInterestGroupChat() {
      await this.createInterestGroupChat(this.form);
    }
  },
  computed: {
    ...Vuex.mapState([
      'interestGroups',
    ]),
  },
  template: `
    <div>
      <fieldset>
        <legend>interest group chat message</legend>
        <select v-model="form.interestGroupId">
          <option v-for="interestGroup in interestGroups.list" :key="interestGroup._id" :value="interestGroup._id">{{interestGroup._id}}</option>
        </select>
        <label>content</label><input v-model="form.message" type="text"/>
        <button @click.prevent="doCreateInterestGroupChat">send message</button>
      </fieldset>
    </div>
  `
});
