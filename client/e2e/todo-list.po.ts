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
        let title = element(by.id('title')).getText();
        this.highlightElement(by.id('title'));

        return title;
    }

    typeAOwner(owner: string) {
        let input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(name);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    getTodoByStatus() {
        let input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(Key.TAB);
    }

    getFirstTodo() {
        let user = element(by.id('todos')).getText();
        this.highlightElement(by.id('todos'));

        return todo;
    }
}
