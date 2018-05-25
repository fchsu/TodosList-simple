// 全域變數設定
let EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
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

let doneCancel = Vue.extend({
  template:
    `<input type="button" :value="state" @click="done()"></input>`,
  props: {
    doneThing: null,
    stateValue: null
  },
  data(){
    return {
    doneThing: null,
      todoState: this.doneThing,
      state: this.stateValue
    }
  },
  methods: {
    done(){
      if (this.state == '完成'){
        this.$bus.$emit('updateState', true);
        this.state = '取消';
      }else{
        this.$bus.$emit('updateState', false);
        this.state = '完成';
      }
    }
  }
});

let todoList = Vue.extend({
  template: 
    `<ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="item in thingTodos">
        <span :class="{ checkbox: item.complete }">{{ item.content }}</span>
        <done-cancel :doneThing="item.complete"
            :stateValue="todoState"></done-cancel>
        <input type="button" value="刪除" @click="removeThing(item)">
      </li>
    </ul>`,
  props: {
    todolists: null
  },
  components: {
    doneCancel
  },
  mounted: function(){
    this.$bus.$on('updateState', updateData);
  },
  data(){
    return {
      thingTodos: this.todolists,
      todoState: '完成'
    }
  },
  methods:{
    removeThing(object){
      this.$bus.$emit('updatedRemove', object);
    },
    updateData(Boolean){
      this;
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

let doneTodo = Vue.extend({
  template: 
    `<div class="todolist">
      <todo-list :todolists="todos"></todo-list>
    </div>`,
  components: {
    todoList
  },
  data(){
    return{
      todos: [],
    }
  },
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