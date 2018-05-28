// 全域變數設定
let EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus;
    }
  }
})

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
      this.$bus.$emit('updatedAdd', thing);
      this.newInputTodo = '';
    }
  }
});

let todoList = Vue.extend({
  template: 
    `<ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="(item, index) in thingTodos">
        <input type="checkbox" v-model="item.complete" @click="done(item,index)"></input>
        <span :class="{ checkbox: item.complete }">{{ item.content }}</span>     
        <input type="button" value="刪除" @click="removeThing(item, index)">
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
    removeThing(object, index){
      if (object.complete == false){
        this.$bus.$emit('updatedRemove', index);
      }else {
        this.$bus.$emit('doneStateRemove', index);
      }
    },
    done(object, index){
      if (object.complete == false){
        this.thingTodos.splice(index, 1);
        this.$bus.$emit('doneState', object);
        localStorage.setItem('todoList', JSON.stringify(this.thingTodos));
      }else {
        this.thingTodos.splice(index, 1);
        this.$bus.$emit('undoneState', object);
        localStorage.setItem('doneList', JSON.stringify(this.thingTodos));
      }
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
    this.$bus.$on('updatedAdd', this.addTodo);
    this.$bus.$on('updatedRemove', this.removeTodo);
    this.$bus.$on('undoneState', this.undoneState);
  },
  data(){
    return{
      todos: JSON.parse(localStorage.getItem('todoList')) || [],
      newTodo: ''
    }
  },
  methods: {
    addTodo(thing){
      this.todos.push(thing);
      localStorage.setItem('todoList', JSON.stringify(this.todos));
    },
    removeTodo(index){
      this.todos.splice(index, 1);
      localStorage.setItem('todoList', JSON.stringify(this.todos));
    },
    undoneState(object){
      this.todos.push(object);
    }
  }
});

let doneTodo = Vue.extend({
  template: 
    `<div class="todolist">
      <todo-list :todolists="todos"></todo-list>
    </div>`,
  components: {
    todoList
  },
  created(){
    this.$bus.$on('doneState', this.doneState);
    this.$bus.$on('doneStateRemove', this.doneStateRemove);
  },
  data(){
    return{
      todos: JSON.parse(localStorage.getItem('doneList')) || []
    }
  },
  methods: {
    doneState(object){
      this.todos.push(object);
    },
    doneStateRemove(index){
      this.todos.splice(index, 1);
      localStorage.setItem('doneList', JSON.stringify(this.todos));
    }
  }
});

let app = new Vue({
  el:'#app',
  data: {
    todoTitle: '代辦事項',
    doneTitle: '已完成',
    currentView: 'wantTodo'
  },
  components: {
    wantTodo,
    doneTodo
  },
  computed: {
    wantBorderOnOff(){
      return{
        titleBorder: this.currentView == 'wantTodo'
      }   
    },
    doneBorderOnOff(){
      return{
        titleBorder: this.currentView == 'doneTodo'
      }
    }
  },
});