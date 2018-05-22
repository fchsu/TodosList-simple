// 全域變數設定
let app = new Vue({
  el:'#app',
  data: {
    todos: [],
    newTodo: ''
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