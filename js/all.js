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
    `<input type="button" :value="state" @click="done(index)"></input>`,
  props: {
    doneThing: null,
    stateValue: null,
    num: null
  },
  data(){
    return {
      todoState: this.doneThing,
      state: this.stateValue,
      index: this.num
    }
  },
  methods: {
    done(index){
      if (this.state == '完成'){
        const object = {
          Boolean: true,
          number: index
        }
        this.$bus.$emit('updateState', object);
        this.state = '取消';
      }else{
        const object = {
          Boolean: false,
          number: index
        }
        this.$bus.$emit('updateState', object);
        this.state = '完成';
      }
    }
  }
});

let todoList = Vue.extend({
  template: 
    `<ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="(item, index) in thingTodos">
        <span :class="{ checkbox: item.complete }">{{ item.content }}</span>
        <done-cancel :doneThing="item.complete"
          :stateValue="todoState" :num="index"></done-cancel>
        <input type="button" value="刪除" @click="removeThing(item)">
      </li>
    </ul>`,
  props: {
    todolists: null
  },
  components: {
    doneCancel
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
    this.$bus.$on('updateState', this.updateData);
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
    },
    updateData(object){
      this.todos[object.number].complete = object.Boolean;
      this.$bus.$emit('doneState', this.todos);
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
  mounted: function(){
    this.$bus.$on('doneState', this.doneState);
  },
  data(){
    return{
      todos: [],
    }
  },
  methods: {
    doneState(array){
      this.todos = array;
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