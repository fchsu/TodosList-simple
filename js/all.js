// 全域變數設定
// Vue.component('todoList', {
//   template: 
//     `<ul>
//       <input type="checkbox" v-model="newThingTodo.complete">
//       <li :class="{checkbox: newThingTodo.complete}">{{ newThingTodo.content }}</li>
//     </ul>`,
//   props: {
//     new: null
//   },
//   data(){
//     return {
//       newThingTodo: this.new
//     }
//   }
// });
let newInput = Vue.extend({  // 無法呼叫 app(Vue) 中的 methods (addTodo)
  template: 
    `<div>
      <input type="text" placeholder="請輸入代辦事項" v-model="newInputTodo"
        @keyup.enter="addTodo(newInputTodo)">
      <input type="button" value="送出" @click="addTodo(newInputTodo)">
    </div>`,
  props: {
    newAdd: null
  },
  data(){
    return {
      newInputTodo: this.newAdd
    }
  }
});

let todoList = Vue.extend({
  template: 
    `<ul>
      <input type="checkbox" v-model="newThingTodo.complete">
      <li :class="{checkbox: newThingTodo.complete}">{{ newThingTodo.content }}</li>
    </ul>`,
  props: {
    new: null
  },
  data(){
    return {
      newThingTodo: this.new
    }
  }
});


let app = new Vue({
  el:'#app',
  data: {
    todos: [],
    newTodo: ''
  },
  components: {
    newInput,
    todoList
  },
  methods: {
    addTodo(){
      this.todos.push(
        {
          content: this.newTodo,
          complete: false
        }
      );
    },
    removeTodo(){

    }
  }
});



// 動作與監聽



// 函式設定