import {TodoPage} from './todo-list.po';
import {browser, protractor} from 'protractor';
import {before} from "selenium-webdriver/testing";

//let origFn = browser.driver.controlFlow().execute;

//https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
//browser.driver.controlFlow().execute = function () {
//let args = arguments;

 //queue 100ms wait between test
//This delay is only put here so that you can watch the browser do its' thing.
//If you're tired of it taking long you can remove this call
//origFn.call(browser.driver.controlFlow(), function () {
//return protractor.promise.delayed(100);
//});

//return origFn.apply(browser.driver.controlFlow(), args);
//};

describe('angular-spark-lab', () => {
    let page: TodoPage;


    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todo List attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Search for a Todo');
    });

    it('should type something in filter owner box and check that it returned correct element', () => {
        page.navigateTo();
        page.addAOwner("Blanch");
        page.addAStatus("incomplete");
        page.addABody("In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.");
        page.addACategory("software design");
        page.addTodoButton();
        page.addAOwner("Workman");
        page.addAStatus("incomplete");
        page.addABody("Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia.");
        page.addACategory("homework");
        page.addTodoButton();
        page.addAOwner("Blanch");
        page.addAStatus("complete");
        page.addABody("Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.");
        page.addACategory("groceries");
        page.addTodoButton();
        page.typeAOwner("Blanch");
        expect(page.getFirstTodo()).toEqual("Blanch\n" +
            "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.\n" +
            "incomplete software design");
    });

    it('should select incomplete in the status dropdown and check that it returned the correct element', () => {
        page.navigateTo();
        page.addAOwner("Blanch");
        page.addAStatus("incomplete");
        page.addABody("In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.");
        page.addACategory("software design");
        page.addTodoButton();
        page.addAOwner("Workman");
        page.addAStatus("incomplete");
        page.addABody("Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia.");
        page.addACategory("homework");
        page.addTodoButton();
        page.addAOwner("Blanch");
        page.addAStatus("complete");
        page.addABody("Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.");
        page.addACategory("groceries");
        page.addTodoButton();
        page.getTodoByStatus("i");
        expect(page.getFirstTodo()).toEqual("Blanch\n" +
            "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.\n" +
            "incomplete software design")
    });

    it('should type Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia. into the body and check that it returned the correct element', () => {
        page.navigateTo();
        page.addAOwner("Blanch");
        page.addAStatus("incomplete");
        page.addABody("In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.");
        page.addACategory("software design");
        page.addTodoButton();
        page.addAOwner("Workman");
        page.addAStatus("incomplete");
        page.addABody("Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia.");
        page.addACategory("homework");
        page.addTodoButton();
        page.addAOwner("Blanch");
        page.addAStatus("complete");
        page.addABody("Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.");
        page.addACategory("groceries");
        page.addTodoButton();
        page.typeABody("Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia.");
        expect(page.getFirstTodo()).toEqual("Workman\n" +
            "Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia.\n" +
            "incomplete homework")
    });

    it('should type groceries and check that it returned the correct element', ()=>{
        page.navigateTo();
        page.addAOwner("Blanch");
        page.addAStatus("incomplete");
        page.addABody("In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.");
        page.addACategory("software design");
        page.addTodoButton();
        page.addAOwner("Workman");
        page.addAStatus("incomplete");
        page.addABody("Proident cupidatat exercitation id ullamco magna do qui aliquip id. Eiusmod labore non nostrud culpa duis incididunt incididunt esse occaecat amet officia.");
        page.addACategory("homework");
        page.addTodoButton();
        page.addAOwner("Blanch");
        page.addAStatus("complete");
        page.addABody("Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.");
        page.addACategory("groceries");
        page.addTodoButton();
        page.typeACategory("groceries");
        expect(page.getFirstTodo()).toEqual("Blanch\n" +
            "Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.\n" +
            "complete groceries")
    });
});

