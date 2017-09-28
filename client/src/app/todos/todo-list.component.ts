import {Component, OnInit} from '@angular/core';
import {UserListService} from "./todo-list.service";
import {User} from "./todo";

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
    public todoStatus : boolean;

    public newTodoOwner:string;
    public newTodoStatus: boolean;
    public newTodoBody: string;
    public newTodoCategory: string;


    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService) {

    }

    addNewTodo(owner: string, status: boolean, body: string, category: string) : void{

        //Here we clear all the fields, probably a better way of doing
        //this could be with clearing forms or something else
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoBody = null;
        this.newTodoCategory = null;

        this.todoListService.addNewUser(owner, status, body, category).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new User, refresh our user list.
                // There is a more efficient method where we request for
                // this new user from the server and add it to users, but
                // for this lab it's not necessary
                this.refreshUsers();
            });
    }



    public filterUsers(searchName: string, searchAge: number): User[] {

        this.filteredUsers = this.users;

        //Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredUsers = this.filteredUsers.filter(user => {
                return !searchName || user.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        //Filter by age
        if (searchAge != null) {
            this.filteredUsers = this.filteredUsers.filter(user => {
                return !searchAge || user.age == searchAge;
            });
        }

        return this.filteredUsers;
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
        this.userListService.getUsers().subscribe(
            users => {
                this.users = users;
                this.filterUsers(this.userName, this.userAge);
            },
            err => {
                console.log(err);
            });
    }

    ngOnInit(): void {
        this.refreshUsers();
    }
}
