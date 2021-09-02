import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
window.unique = (arr) => {
    //Set数据结构，它类似于数组，其成员的值都是唯一的
    return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
}

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
    render: h => h(App),
}).$mount('#app')