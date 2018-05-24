// 全域變數設定
let newInput = Vue.extend({
  template: 
    `<div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="請輸入代辦事項"
        aria-label="Recipient's username" aria-describedby="basic-addon2"
        v-model="newInputTodo" @keyup.enter="addThing(newInputTodo)">
      <button class="btn btn-outline-secondary" type="button"
        @click="addThing(newInputTodo)">送出</button>
    </div>`,

  props: {
    newAdd: null
  },
  data(){
    return {
      newInputTodo: this.newAdd,
    }
  },
  methods: {
    addThing(content){
      const thing = {
        content: content,
        complete: false
      }
      this.$parent.$emit('updatedAdd', thing);
      this.newInputTodo = '';
    }
  }
});

let todoList = Vue.extend({
  template: 
    `<ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="item in thingTodos">
        <input type="checkbox" v-model="item.complete">
        <span :class="{ checkbox: item.complete }">{{ item.content }}</span>
        <input type="button" value="刪除" @click="removeThing(item)">
      </li>
    </ul>`,
  props: {
    todolists: null,
  },
  data(){
    return {
      thingTodos: this.todolists,
    }
  },
  methods:{
    removeThing(object){
      this.$parent.$emit('updatedRemove', object);
    }
  }
});

let wantTodo = Vue.extend({
  template:
  `<div class="todolist">
    <new-input :new-add="newTodo"></new-input>
    <todo-list :todolists="todos"></todo-list>
  </div>`,
  components: {
    newInput,
    todoList
  },
  mounted: function(){
    this.$on('updatedAdd', this.addTodo);
    this.$on('updatedRemove', this.removeTodo);
  },
  data(){
    return{
      todos: [],
      newTodo: ''
    }
  },
  methods: {
    addTodo(thing){
      this.todos.push(thing);
    },
    removeTodo(object){
      this.todos.splice(this.todos.indexOf(object), 1);
    }
  }
});

let app = new Vue({
  el:'#app',
  data: {
    todoTitle: '代辦事項',
    doneTitle: '已完成'
  },
  components: {
    wantTodo
  }
});




// let app = new Vue({
//   el:'#app',
//   data: {
//     todoTitle: '代辦事項',
//     doneTitle: '已完成',
//     todos: [],
//     newTodo: ''
//   },
//   mounted: function(){
//     this.$on('updatedAdd', this.addTodo);
//     this.$on('updatedRemove', this.removeTodo);
//   },
//   components: {
//     newInput,
//     todoList
//   },
//   methods: {
//     addTodo(thing){
//       this.todos.push(thing);
//     },
//     removeTodo(object){
//       this.todos.splice(this.todos.indexOf(object), 1);
//     }
//   }
// });



// 動作與監聽



// 函式設定