import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(createPinia());

// components.forEach((component) => {
//   app.component(component.name, component);
// });

app.mount("#app");
