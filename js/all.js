// 設置 Event bus
let EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus;
    }
  }
})

// 組件 - 輸入框
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
      date: ''
    }
  },
  methods: {
    addThing(content){
      const thing = {
        content: content,
        complete: false,
        dateTime: new Date().getTime()
      }
      this.$bus.$emit('updatedAdd', thing);
      this.newInputTodo = '';
    }
  }
});

// 組件 - 事項列表
let todoList = Vue.extend({
  template: 
    `<ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="(item, index) in thingTodos">
        <input type="checkbox" v-model="item.complete" @click="done(item,index)"></input>
        <div>
          <p :class="{ checkbox: item.complete }">{{ item.content }}</p>
          <div>
            {{ timeFormat(item.dateTime) }}
            <input type="button" value="刪除" @click="removeThing(item, index)">
          </div>
        </div>  
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
    timeFormat(time){
      const date = new Date(time);
      const Hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
      const Minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
      return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' +
      date.getDate() + ' ' + Hour + ':' + Minute;
    },
    removeThing(object, index){
      if (object.complete == false){
        this.thingTodos.splice(index, 1);
        localStorage.setItem('todoList', JSON.stringify(this.thingTodos));
      }else {
        this.thingTodos.splice(index, 1);
        localStorage.setItem('doneList', JSON.stringify(this.thingTodos));
      }
    },
    done(object, index){
      if (object.complete == false){
        this.thingTodos.splice(index, 1);
        object.complete = true;
        this.$bus.$emit('doneState', object);
        localStorage.setItem('todoList', JSON.stringify(this.thingTodos));
      }else {
        this.thingTodos.splice(index, 1);
        object.complete = false;
        this.$bus.$emit('undoneState', object);
        localStorage.setItem('doneList', JSON.stringify(this.thingTodos));
      }
    }
  }
});

// 組件 - 待辦事項
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
      this.todos.sort((a, b) => {
        return a.dateTime - b.dateTime;
      });
      localStorage.setItem('todoList', JSON.stringify(this.todos));
    },
    undoneState(object){
      this.todos.push(object);
      this.todos.sort((a, b) => {
        return a.dateTime - b.dateTime;
      });
      localStorage.setItem('todoList', JSON.stringify(this.todos));
    }
  }
});

// 組件 - 已辦事項
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
  },
  data(){
    return{
      todos: JSON.parse(localStorage.getItem('doneList')) || []
    }
  },
  methods: {
    doneState(object){
      this.todos.push(object);
      this.todos.sort((a, b) => {
        return a.dateTime - b.dateTime;
      });
      localStorage.setItem('doneList', JSON.stringify(this.todos));
    }
  }
});

let app = new Vue({
  el:'#app',
  data: {
    todoTitle: '代辦事項',
    doneTitle: '已完成',
    currentView: 'wantTodo',
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