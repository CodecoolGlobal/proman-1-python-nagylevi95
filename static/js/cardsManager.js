import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card)
            domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="${card.status_id}"] .board-column-content`, content)
            //domManager.addEventListener(`.card[data-card-id="${card.id}"]`, "click", deleteButtonHandler)
            domManager.addEventListener(`.card-title[card-title-id="${card.id}"]`, "click", changeCardTitle)
        }
    },
}

function deleteButtonHandler(clickEvent) {
}

async function cardOrder(boardId, columnId){
    const cards = await dataHandler.getCardOrderByBoardColumnId(boardId,columnId);

}

function changeCardTitle(clickEvent) {
    const cardId = clickEvent.target.attributes['card-title-id'].nodeValue;
    let element = document.querySelector(`.card-title[card-title-id='${cardId}']`)
    let oldText = element.innerText
    element.addEventListener('focusout', async () =>{
        let title = element.innerText
        if(title === ""){
            element.innerText = "unnamed"
            await dataHandler.renameCard(cardId, "unnamed")
        }
        else if(title !== oldText){
            await dataHandler.renameCard(cardId, title)
        }
    })
}
