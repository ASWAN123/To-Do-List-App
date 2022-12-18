class Todo{
    constructor (check , text ){
        this.check = check ;
        this.text = text ;
    }
}


// class ui
class UI {
    static addtodo(todo){
        let destination = document.querySelector(".mylist")
        let row = document.createElement("div")
        row.className = "task" ;
        row.innerHTML = `
            <input class = "done" type="checkbox" ${todo.check == true ? "checked" : "" }>
            <p>${todo.text}</p>
            <div class="delete"><span> </span><span> </span><span> </span></div>
        `
        let todos = store.data()
        if (todos.length == 0){
            destination.appendChild(row) ;
        }else{
            let direct = document.querySelectorAll('.task')[0] ;
            destination.insertBefore( row , direct) ;
        }

    }

    static clearFields(){
        document.querySelector('#complete').checked = "" ;
        document.querySelector("#task").value = "" ;
    }


    static removeTask(ele) {
        ele.parentElement.remove() ;
    }


    static updateStatus(position){
        let myarray = store.data() ;
        myarray.reverse() ;
        let trueorfalse = myarray[position].check ;
        document.querySelectorAll(`.task:nth-of-type(${position+1}) .done`)[0].remove() ;
        let div = document.querySelectorAll(`.task:nth-of-type(${position+1})`)[0] ;
        let befor = document.querySelectorAll(`.task:nth-of-type(${position+1}) p`)[0] ;
        let input = document.createElement('input') ;
        input.type = "checkbox" ;
        input.className = "done" ;
        if (trueorfalse === true){
            input.checked = true ;
        }else{
            input.checked = false ;
        }
        div.insertBefore(input , befor) ;


    }


}

// class storage 
class store {
    static data() {
        let todos ;
        if (localStorage.getItem('todos')===null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('todos')) ;
        }

        return todos
    }

    static gettodos(){
        let todos = store.data() ;
        todos.forEach((todo) => {
            UI.addtodo(todo) ;
        });
    }

    static storeTodo(todo){
        let todos = store.data() ;
        todos.push(todo) ;
        localStorage.setItem("todos" , JSON.stringify(todos)) ;
        
    }

    static removeTask(todo){
        let todos = store.data() ;
        todos.forEach((t , index) =>{
            if(t.text === todo){
                todos.splice(index , 1) ;
            }
        })

        localStorage.setItem("todos" , JSON.stringify(todos)) ;
    }

    static updateStatus(ele){
        let todos = store.data().reverse() ;
        let position ;
        todos.forEach((t , index) =>{
            if(t.text === ele){
                t.check == true ? t["check"]=false : t["check"]=true ;
                position = index ;

            }
        })
        todos.reverse()
        localStorage.setItem("todos" , JSON.stringify(todos)) ;
        UI.updateStatus(position) ;

    }

}

//event : gettodolist
document.addEventListener("DOMContentLoaded" , () =>{
    store.gettodos() ;
    // update number of items left
    let filtered = store.data().filter((el)=>{return el.check === false;})
    document.querySelector(".items-left").innerText = filtered.length + " items left" ;
})

// event : addtodo
document.querySelector(".todo-form").addEventListener('submit' , (e)=>{
    e.preventDefault() ;
    // get values 
    let check = document.querySelector('#complete').checked ;
    let text = document.querySelector("#task").value ;
    
    if (text !== ""){

        // into object
        let todo = new Todo(check , text) ;
        // add to UI
        UI.addtodo(todo) ;
        // store todo
        store.storeTodo(todo) ;

        // clear fields
        UI.clearFields()

        // update number of items left
        let filtered = store.data().filter((el)=>{return el.check === false;})
        document.querySelector(".items-left").innerText = filtered.length + " items left" ;
    }
    
})

// event : removetodo
document.querySelector(".mylist").addEventListener("click" , (e)=>{
    e.preventDefault() ;
    
    // delete task 
    if (e.target.parentElement.className === 'delete'){
        UI.removeTask(e.target.parentElement) ;
        store.removeTask(e.target.parentElement.previousElementSibling.textContent) ;
    }

    // chnage mark as complete status
    if (e.target.className === 'done'){
        store.updateStatus(e.target.nextElementSibling.textContent) ;
        // update number of items left
        let filtered = store.data().filter((el)=>{return el.check === false;})
        document.querySelector(".items-left").innerText = filtered.length + " items left" ;
    }
})

// event clear completed
document.querySelector(".clear_completed").addEventListener("click" , ()=>{
    // update database
    let data = store.data() ;
    let filtered = data.filter((el)=>{
        return el.check !== true;
    })
    localStorage.setItem("todos" , JSON.stringify(filtered)) ;

    // update UI
    let tasks = document.querySelectorAll(".task")
    tasks.forEach((ele) =>{
        let input = ele.querySelector("input");
        if (input.checked == true ){
            input.parentElement.remove() ;
        }
    })
})

// event filter completed 
document.querySelector(".Completed").addEventListener("click" , ()=>{
    // update UI
    let tasks = document.querySelectorAll(".task")
    tasks.forEach((ele) =>{
        let input = ele.querySelector("input");
        if (input.checked == false ){
            input.parentElement.style.display = "none" ;
        }else{
            input.parentElement.style.display = "flex" ;
        }
    })
})


// event filter Active 
document.querySelector(".Active").addEventListener("click" , ()=>{
    // update UI
    let tasks = document.querySelectorAll(".task")
    tasks.forEach((ele) =>{
        let input = ele.querySelector("input");
        if (input.checked == true ){
            input.parentElement.style.display = "none" ;
        }else{
            input.parentElement.style.display = "flex" ;
        }
    })
})

// event filter All 
document.querySelector(".All").addEventListener("click" , ()=>{
    // update UI
    let tasks = document.querySelectorAll(".task")
    tasks.forEach((ele) =>{
        let input = ele.querySelector("input");
        if (input.checked == true ){
            input.parentElement.style.display = "flex" ;
        }else{
            input.parentElement.style.display = "flex" ;
        }
    })
})

// drag and drop
