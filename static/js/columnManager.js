import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumns();

        for (let column of columns) {
            if (column.owner === boardId || column.owner === "global"){
                const columnBuilder = htmlFactory(htmlTemplates.column);
                const content = columnBuilder(column)
                await domManager.addEventListener(`.board-column-title[column-title-id='${column.id}']`, "click", changeColumnTitle)
                await domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
            }
            let delete_buttons = document.querySelectorAll(`.delete-column-button[data-delete-status-id="${column.id}"], .delete-column-button[data-delete-owner-id="${column.owner}"]`)
            for (let delete_button of delete_buttons){
                delete_button.addEventListener("click", columnsManager.deleteStatus)
            }
        }
    },
    deleteStatus: async function(clickEvent) {
        const statusId = clickEvent.target.attributes['data-delete-status-id'].nodeValue;
        const ownerId = clickEvent.target.attributes['data-delete-owner-id'].nodeValue;
        let item = document.querySelector(`.board-column[data-column-id="${statusId}"], .board-column[data-owner-id="${ownerId}"]`)
        let parent = document.querySelector(`.board-container[board-id="${ownerId}"] .board-columns`)
        parent.removeChild(item)
        await dataHandler.deleteStatusById(ownerId, statusId)
    },

}


function changeColumnTitle(clickEvent) {
    const columnId = clickEvent.target.attributes['column-title-id'].nodeValue;
    let element = document.querySelector(`.board-column-title[column-title-id='${columnId}']`)
    let oldText = element.innerText
    element.addEventListener('focusout', async () =>{
        let title = element.innerText
        if(title === ""){
            element.innerText = "unnamed"
            await dataHandler.renameColumn(columnId, "unnamed")
        }
        else if(title !== oldText){
            await dataHandler.renameColumn(columnId, title)
        }
    })
}


}