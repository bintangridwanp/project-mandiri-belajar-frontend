let books = [];
const RENDER_EVENT = 'render-bookshelf';
const STORAGE_KEY = 'bookshelf';

const checkWebStorage = () => {
    if (typeof Storage !== "undefined") {
        return true;
    }
    alert('Browser tidak mendukung web storage');
    return false;
}

const loadBookFromStorage = () => {
    const booksFromStorage = localStorage.getItem(STORAGE_KEY);
    const booksData = JSON.parse(booksFromStorage);

    if (booksData !== null) {
        books = booksData;
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const saveToStorage = () => {
    if (checkWebStorage()) {
        const stringBookJSON = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, stringBookJSON);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('input-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addBookshelf();
    });

    if (checkWebStorage()) {
        loadBookFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, () => {
    const uncompletedBooks = document.getElementById('uncompleted-booklist');
    uncompletedBooks.innerHTML = '';

    const completedBooks = document.getElementById('completed-booklist');
    completedBooks.innerHTML = '';

    for (const book of books) {
        const bookElement = createBooklistItem(book);
        if (book.isComplete) {
            completedBooks.append(bookElement);
        } else {
            uncompletedBooks.append(bookElement);
        }
    }
});

const addBookshelf = () => {
    const newId = +new Date();
    const bookTitle = document.getElementById('input-title').value;
    const bookAuthor = document.getElementById('input-author').value;
    const bookYear = Number(document.getElementById('input-year').value);
    const isComplete = document.getElementById('isComplete').checked;

    const newBookObject = {
        id: newId,
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: isComplete
    };

    books.push(newBookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
}

const deleteBook = (bookId) => {
    books = books.filter(book => book.id !== bookId);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
}

const updateBookStatus = (bookId) => {
    const book = books.find(book => book.id === bookId);
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
}

const createBooklistItem = (bookObject) => {
    const bookItemContainer = document.createElement('div');
    bookItemContainer.classList.add('book-item');
    bookItemContainer.setAttribute('id', bookObject.id);

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;
    bookItemContainer.append(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${bookObject.author}`;
    bookItemContainer.append(bookAuthor);

    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${bookObject.year}`;
    bookItemContainer.append(bookYear);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.classList.add('book-button');
    deleteButton.addEventListener('click', () => {
        if (confirm(`Anda yakin ingin menghapus buku ${bookObject.title} (${bookObject.year})`)) {
            deleteBook(bookObject.id);
            createNotification(`${bookObject.title} berhasil dihapus`);
        }
    });
    bookItemContainer.append(deleteButton);

    const buttonStatus = document.createElement('button');
    buttonStatus.classList.add('book-button');
    buttonStatus.addEventListener('click', () => {
        updateBookStatus(bookObject.id);
        createNotification(`${bookObject.title} berhasil diperbarui`);
    });

    if (bookObject.isComplete) {
        buttonStatus.innerText = 'Belum Selesai Dibaca';
    } else {
        buttonStatus.innerText = 'Selesai Dibaca';
    }

    bookItemContainer.append(buttonStatus);
    return bookItemContainer;
}

const createNotification = (message) => {
    const notificationContainer = document.getElementById('notification');
    const notificationCard = document.createElement('div');
    notificationCard.classList.add('notification-card');
    notificationCard.innerText = message;
    notificationContainer.append(notificationCard);

    setTimeout(() => {
        notificationCard.remove();
    }, 3000);
}

const cb = document.getElementById('isComplete');
const submitInputBook = document.getElementById('submit-text');
cb.addEventListener('change', () => {
    if (cb.checked) {
        submitInputBook.innerText = 'Daftar Buku Selesai Dibaca';
    } else {
        submitInputBook.innerText = 'Daftar Buku Belum Dibaca';
    }
});
