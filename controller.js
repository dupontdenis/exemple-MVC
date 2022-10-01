import { emptyItemQuery } from './item.js';
import Store from './store.js';
import View from './view.js';

export default class Controller {
    /**
     * @param  {!Store} store A Store instance
     * @param  {!View} view A View instance
     */
    constructor(store, view) {
        this.store = store;
        this.view = view;

        view.bindAddItem(this.addItem.bind(this));
        view.bindEditItemSave(this.editItemSave.bind(this));
        view.bindEditItemCancel(this.editItemCancel.bind(this));
        view.bindRemoveItem(this.removeItem.bind(this));


        this._filter();

    }


    /**
     * Add an Item to the Store and display it in the list.
     *
     * @param {!string} title Title of the new item
     */
    addItem(title) {
        this.store.insert({
            id: Date.now(),
            title,
        }, () => {
            this.view.clearNewTodo();
            this._filter(true);
        });
    }

    /**
     * Save an Item in edit.
     *
     * @param {number} id ID of the Item in edit
     * @param {!string} title New title for the Item in edit
     */
    editItemSave(id, title) {
        if (title.length) {
            this.store.update({ id, title }, () => {
                this.view.editItemDone(id, title);
            });
        } else {
            this.removeItem(id);
        }
    }

    /**
     * Cancel the item editing mode.
     *
     * @param {!number} id ID of the Item in edit
     */
    editItemCancel(id) {
        this.store.find({ id }, data => {
            const title = data[0].title;
            this.view.editItemDone(id, title);
        });
    }

    /**
     * Remove the data and elements related to an Item.
     *
     * @param {!number} id Item ID of item to remove
     */
    removeItem(id) {
        this.store.remove({ id }, () => {
            this._filter();
            this.view.removeItem(id);
        });
    }

    /**
     * Remove all completed items.
     */
    removeCompletedItems() {
        this.store.remove({ completed: true }, this._filter.bind(this));
    }



    /**
     * Refresh the list based on nothing!.
     *
     *
     */
    _filter() {

        //this.store.findAll(this.view.showItems.bind(this.view));

        this.store.findAll((taches) => {
            this.view.showItems(taches);
        });

        //this.store.findAll(this.view.showItems); ne marche pas car this dans view.showtime = undefined
    }
}
