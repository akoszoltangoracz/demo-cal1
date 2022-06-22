const DemoPage = Vue.component('demo-page', {
  template: `
  <div>
    <h1>demo</h1>

    <user-data />
    <login-form />

    <register-form/>

    <hr />
    <h2>interest groups</h2>
    <interest-group-form />
    <interest-group-list />
    <interest-group-cover-form />
    <interest-group-chat-form />

    <hr />
    <h2>events</h2>
    <event-form />
    <event-list />
    <event-cover-form/>
    <event-chat-form />
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
