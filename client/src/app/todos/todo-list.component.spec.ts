import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoListComponent} from "./todo-list.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms"; //for [(ngModule)] to not break tests

describe("Todo list", () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: "nick_id",
                    owner: "Nick",
                    status: "complete",
                    body: "I like apples.",
                    category: "knight"
                },
                {
                    _id: "ethan_id",
                    owner: "Ethan",
                    status: "incomplete",
                    body: "I like oranges.",
                    category: "knave"
                },
                {
                    _id: "kk_id",
                    owner: "Kristin",
                    status: "complete",
                    body: "I like pears.",
                    category: "knight"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });


    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the users", () => {
        expect(todoList.todos.length).toBe(3);
    });

    it("contains an owner named 'Nick'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Nick")).toBe(true);
    });

    it("contain a user named 'Ethan'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Ethan")).toBe(true);
    });

    it("doesn't contain a user named 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Santa")).toBe(false);
    });

    it("has two users that are incomplete", () => {
        expect(todoList.todos.some((todo: Todo) => todo.status === "complete")).toBe(true);
    });

    it("todo list refreshes", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        let newTodos : Todo[] = new Array(1);
        let newTodo : Todo = {_id: "nic_id", owner: "Nic", status: "incomplete", body: "I am Nic McPhee!", category: "knight"};
        newTodos.push(newTodo);
        todoList.todos = newTodos;
        todoList.refreshTodos();
        //expect(todoList.filteredTodos).toBe(newTodos);
    });

    it("todo list filters by owner", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoOwner = "i";
        todoList.refreshTodos(); //The asynchronicity of refreshTodos doesn't seem to effect `expect`
        expect(todoList.filteredTodos.length).toBe(2);
    });

    it("todo list filters by status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = "complete";
        todoList.refreshTodos();
        expect(todoList.filteredTodos.length).toBe(2);
    });

    it("todo list filters by owner and status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = "incomplete";
        todoList.todoOwner = "a";
        todoList.refreshTodos();
        expect(todoList.filteredTodos.length).toBe(1);
    });

});

describe("Misbehaving Todo List", () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});
