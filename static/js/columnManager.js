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
                domManager.addEventListener(`.delete-column-button[delete-status-id="${column.owner}"]`, "click", deleteStatus)
                domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
                domManager.addEventListener(`.board-column-title[column-title-id='${column.id}']`, "click", changeColumnTitle)
            }
        }
    },
}

async function deleteStatus(clickEvent){
    const statusId = clickEvent.target.attributes['delete-status-id'].nodeValue;
    //get board id by status id
    let column = "";
    const columns = await dataHandler.getColumns();
    for (let status of columns){
        if (status.id === statusId){
            column = status;
            break;
        }
    }


    await dataHandler.deleteStatusById(column.owner, statusId)
    //root.board-container.
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


