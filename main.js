console.log("Hi!!");

const shelf = document.querySelector('.shelf');
const dialogAdding = document.querySelector('#adding');
const newBookButton = document.querySelector('#newBook');
const closeButton = document.querySelector('#quit');
const addButton = document.querySelector('#add');
const nameInput = document.querySelector('#bookName');
const authorInput = document.querySelector('#authorName');
const pagesInput = document.querySelector('#pageNumber');
const readCheck = document.querySelector('#state');
const form = document.querySelector('form');

function Book(title, author, pages, state) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.state = state;
    this.id = crypto.randomUUID();
}

function VisualRepresentation(typeOfElement, className) {
    this.element = document.createElement(typeOfElement);
    this.element.className = className;
}

function bookStyle(currentIndex, j) {
    let infoContainer = document.createElement('div');
    infoContainer.setAttribute('class', 'infoContainer');
    let infoMsg = document.createElement('p');
    infoMsg.textContent = collection[j].title+", by "+collection[j].author;
    let additionalInfo = document.createElement('p');
    additionalInfo.innerHTML = "Pages: "+collection[j].pages+"<br>Status: "+collection[j].state;
    let buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'buttonContainer');
    let changeState = document.createElement('button');
    let deleteBook = document.createElement('button');
    changeState.setAttribute('class', 'changeState');
    deleteBook.setAttribute('class', 'deleteBook');
    changeState.textContent = "Change Status";
    deleteBook.textContent = "Delete from Library";
    infoContainer.append(infoMsg, additionalInfo);
    buttonContainer.append(changeState, deleteBook);
    bookOnShelf[currentIndex].element.append(infoContainer, buttonContainer);

    deleteBook.addEventListener('click', (event) => {
        let book = event.target.parentNode.parentNode;
        let bookId = book.id;
        let index = collection.findIndex(item => item.id === bookId);
        
        if (index!==-1) {
            collection.splice(index, 1);
            book.remove();
        }
    });
    changeState.addEventListener('click', (event) => {
        let book = event.target.parentNode.parentNode;
        let bookId = book.id;
        let index = collection.findIndex(item => item.id === bookId);
        if (index !== -1) {
            if(collection[index].state === "not read yet"){
                collection[index].state = "already read";
                book.style.transition = "0.5s";
                book.style.backgroundColor = "lawngreen";
                book.style.borderRight = "solid 1em darkgreen";
            } else {
                collection[index].state = "not read yet";
                book.style.transition = "0.5s";
                book.style.backgroundColor = "red";
                book.style.borderRight = "solid 1em darkred";
            }
            let infoContainer = book.querySelector(".infoContainer");
            let oldStatus = infoContainer.querySelector("p:nth-child(2)");
            let newStatus = document.createElement('p');
            newStatus.innerHTML = "Pages: "+collection[index].pages+"<br>Status: "+collection[index].state;
            infoContainer.replaceChild(newStatus, oldStatus);
        }
    });
}

function organizingLib() {
    bookOnShelf = bookOnShelf.filter(book => book!== undefined);

    document.querySelectorAll('.book').forEach(visualBook => visualBook.remove());
    for (let j=0; j<collection.length; j++) {
        const existingInCollection = document.getElementById(collection[j].id);
        if (!existingInCollection) {
            bookOnShelf.push(new VisualRepresentation('div', "book"));

            let currentIndex = bookOnShelf.length -1;
        
            if(collection[j].state == "not read yet") {
                bookOnShelf[currentIndex].element.style.backgroundColor = "red";
                bookOnShelf[currentIndex].element.style.borderRight = "solid 1em darkred";
            } else {
                bookOnShelf[currentIndex].element.style.backgroundColor = "lawngreen";
                bookOnShelf[currentIndex].element.style.borderRight = "solid 1em darkgreen";
            }
            bookStyle(currentIndex, j);
            
            bookOnShelf[currentIndex].element.setAttribute('id', collection[j].id);
            shelf.appendChild(bookOnShelf[currentIndex].element);
        }
    }
}
const hobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, "not read yet");
const methamorphosis = new Book("The Methamorphosis", "Franz Kafka", 42, "already read");

const collection = [];
collection.push(hobbit, methamorphosis);

let bookOnShelf = [];
const userBook = [];

let bookIndex = 0;
let bookLimit = 5;

organizingLib();

newBookButton.addEventListener('click', ()=>{
    dialogAdding.showModal();
});

closeButton.addEventListener('click', ()=>{
    dialogAdding.close();
});

addButton.addEventListener('click', ()=>{
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });
    if((nameInput.value.trim === '')||(authorInput.value.trim() === '') || (pagesInput.value === '')|| (pagesInput.value <= 0) || (pagesInput.value > 2000)){
        alert("Please, fill the form with valid information");
    } else {
        userBook.push(new Book(nameInput.value, authorInput.value, pagesInput.value, readCheck.checked ? "already read" : "not read yet"));
        collection.push(userBook[userBook.length - 1]);
        organizingLib();

        nameInput.value = '';
        authorInput.value = '';
        pagesInput.value = ''; 
        readCheck.checked = false;
        dialogAdding.close();
    }
});