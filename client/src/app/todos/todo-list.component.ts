import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
    providers: []
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];
    private todoAddSuccess : Boolean = false;

    public todoOwner : string;
    public todoStatus : string;

    public newTodoOwner:string;
    public newTodoStatus: string;
    public newTodoBody: string;
    public newTodoCategory: string;


    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService) {

    }

    addNewTodo(owner: string, status: string, body: string, category: string) : void{

        //Here we clear all the fields, probably a better way of doing
        //this could be with clearing forms or something else
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoBody = null;
        this.newTodoCategory = null;

        this.todoListService.addNewTodo(owner, status, body, category).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new User, refresh our user list.
                // There is a more efficient method where we request for
                // this new user from the server and add it to users, but
                // for this lab it's not necessary
                this.refreshUsers();
            });
    }



    public filterTodos(searchOwner: string, searchStatus: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by name
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        //Filter by status
        if (searchStatus != null) {
            searchStatus = searchStatus.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchStatus || todo.status.toString().toLowerCase().indexOf(searchStatus) !== -1;
            });
        }

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshUsers(): void {
        //Get Users returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoOwner, this.todoStatus);
            },
            err => {
                console.log(err);
            });
    }

    ngOnInit(): void {
        this.refreshUsers();
    }
}
