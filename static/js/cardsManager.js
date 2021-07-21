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

            domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", cardsManager.deleteButtonHandler)

        }
        let draggables = document.getElementsByClassName('card')
        for (let draggable of draggables){
            draggable.addEventListener('dragstart', cardsManager.dragCards)
        }

    },
    deleteButtonHandler: async function(clickEvent) {
        const cardId = clickEvent.target.attributes['data-card-id'].nodeValue;
        let item = document.querySelector(`.card[data-card-id="${cardId}"]`)
        let parent = item.parentNode

        parent.removeChild(item)
        await dataHandler.deleteCardById(cardId)
    },
    dragCards: async function (){
        let cards = document.getElementsByClassName("card")
        cards.forEach(card => {
            card.addEventListener('dragstart', () => {
                card.classList.add('dragging')
            })

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging')
            })
        })
    }
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
