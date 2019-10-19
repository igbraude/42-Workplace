const channel = {
    CHAT_MESSAGE: "chat:message",
};

let matchId = document.getElementsByClassName('matchId');
let j = 0;
let url = window.location.toString();

/* **********************************************************************************************************************
 *                                                      Events                                                          *
 ********************************************************************************************************************** */

/* If user click back or forward button in the browser, reloading chat (chatMessage.hbs)
*/

addEventListener('popstate', function(e){
    createChat()
}, false);

/* List all users match and add an click event that display chat (only chatMessage.hbs is reloaded)
*/

addEventListener('load', () => {
    let userSelected = document.getElementsByName('users');

    for (let i = 0; i < userSelected.length; i++) {

        /* * replace Url then load the chat (chatMessage.hbs) * */

        userSelected[i].addEventListener('click', (e) => {
            j = i;
            e.preventDefault();
            let newUrl = url.replace(/\/[^\/]*$/, '/' + matchId[i].value);
            window.history.replaceState(url, '', newUrl);
            createChat()
        })
    }
    createChat()
});

/* On click Send message. user receive and send his message
*/

const messageSender = (receiver) => {
    let sender_button = document.getElementById('sendMessage').addEventListener('click', (event) => {
        let message = document.getElementById('message')
        event.preventDefault()
        let empty = message.value.trim().length
        if (empty > 0) {
            sendMessage(message.value, receiver)
        }
        message.value = ''
    })
}

socket.on(channel.CHAT_MESSAGE, ({message, room}) => {
    addChatMessage(message, room['sender']['username'])
})





/* **********************************************************************************************************************
 *                                                      Functions                                                       *
 ********************************************************************************************************************** */


/* Function that update the chat room and create the chat sender/receiver
*/

const createChat = () => {
    let url = window.location.toString();
    fetch(url, { method: "POST" }).then(res => res.text()).then(chatHtml => {

        document.getElementById("messageArea").innerHTML = chatHtml;
        let roomId = document.getElementById('room').value
        let first_user_id = document.getElementById('first_user_id').value
        let second_user_id = document.getElementById('second_user_id').value
        let myId = document.getElementById('myId').value
        scrollToButton()
        if (myId === first_user_id) {
            messageSender(second_user_id)
        }
        else {
            messageSender(first_user_id)
        }
    })
};

/* Function send message socket emit
*/

const sendMessage = (message, receiver) => {
    socket.emit(channel.CHAT_MESSAGE, {message, receiver});
};

/* Functions add message to the DOM
*/


        /*
            Create Element and his attributes ('class for exemple')
         */
        
const createElem = (element, attr, value) => {
    let elem = document.createElement(element)

    for (let i = 0; i < attr.length; i++) {
        let attribute = document.createAttribute(attr[i])
        attribute.value = value[i]
        elem.setAttributeNode(attribute)
    }

    return elem
}

        /*
            AddElement to another
         */

const addElem = (element, child) => {
    for (let i = 0; i < child.length; i++) {
        element.appendChild(child[i])
    }

    return element
}
        /*
            Add text to element
         */

const addTextNode = (element, text) => {
    element.appendChild(document.createTextNode(text))

    return element
}

        /*
            Add message to the DOM receiver and sender
         */

const addChatMessage = (message, sender) => {

    let myName = document.getElementById('myName').value

    if (sender === myName) {
        let divChat = document.getElementById('chat')
        let spanElem = createElem('span', ['class'], ['time_date'])
        spanElem = addTextNode(spanElem, 'few second ago')
        let pElem = createElem('p', ['class'], ['message_text'])
        pElem = addTextNode(pElem, message)
        let divMessage = createElem('div', ['class'], ['sent_msg'])
        divMessage = addElem(divMessage, [pElem, spanElem])
        let divRow = createElem('div', ['class'], ["outgoing_msg"])
        divRow = addElem(divRow,[divMessage])

        divChat = addElem(divChat, [divRow])

        scrollToButton()
    }
    else {
        let divChat = document.getElementById('chat')

        let image = createElem('img', ['class', 'src', 'alt'], ['chat-image' , document.getElementById('pictureSrc').value, 'target'])
        let divImage = createElem('div', ['class'], ['incoming_msg_img'])
        divImage = addElem(divImage, [image])

        let spanElem = createElem('span', ['class'], ['time_date'])
        spanElem = addTextNode(spanElem, 'few second ago')
        let pElem = createElem('p', ['class'], ['message_text'])
        pElem = addTextNode(pElem, message)
        let divMessageSize = createElem('div', ['class'], ['received_withd_msg'])
        divMessageSize = addElem(divMessageSize, [pElem, spanElem])
        let divMessage = createElem('div', ['class'], ["received_msg"])
        divMessage = addElem(divMessage,[divMessageSize])
        let divRow = createElem('div', ['class'], ['incoming_msg'])
        divRow = addElem(divRow, [divImage, divMessage])

        divChat = addElem(divChat, [divRow])

        scrollToButton()
    }

}

/* Function scroll chat
*/

const scrollToButton = () => {
    let chat = document.getElementById('chat')
    chat.scrollTop = chat.scrollHeight
}
