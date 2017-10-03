import {browser, element, by} from 'protractor';
import {Key} from "selenium-webdriver";

export class TodoPage {
    navigateTo() {
        return browser.get('/todos');
    }

    //http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return "highlighted";
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        let title = element(by.id('list-title')).getText();
        this.highlightElement(by.id('list-title'));

        return title;
    }

    addAOwner(owner: string){
        let input = element(by.id('addowner'));
        input.click();
        input.sendKeys(owner);
    }

    addAStatus(status: string){
        let input = element(by.id('addstatus'));
        input.click();
        input.sendKeys(status);
        input.sendKeys(Key.ENTER);
    }

    addABody(body: string){
        let input = element(by.id('addbody'));
        input.click();
        input.sendKeys(body);
    }

    addACategory(category: string){
        let input = element(by.id('addcategory'));
        input.click();
        input.sendKeys(category);
    }

    addTodoButton(){
        let input = element(by.id('finalizetodo'));
        input.click();
    }

    typeAOwner(owner: string) {
        let input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    getTodoByStatus(status: string) {
        let input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(status);
        input.sendKeys(Key.ENTER)
    }

    typeABody(body: string) {
        let input = element(by.id('todoBody'));
        input.sendKeys(body);
    }

    typeACategory(category: string) {
        let input = element(by.id('todoCategory'));
        input.sendKeys(category);
    }

    getFirstTodo() {
        let todo = element(by.id('todos')).getText();
        this.highlightElement(by.id('todos'));

        return todo;
    }
}
