export const fake = {
    _decks: [
        {
            id: 1,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 30,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 2,
            title: "Informatik 2",
            owner: "Jane Doe",
            numberOfCards: 32,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 3,
            title: "Programmierung 1",
            owner: "Jane Doe",
            numberOfCards: 33,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 4,
            title: "Programmierung 2",
            owner: "Jane Doe",
            numberOfCards: 66,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 5,
            title: "Datenbanken",
            owner: "John Doe",
            numberOfCards: 56,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 6,
            title: "Nachrichtentechnik",
            owner: "John Doe",
            numberOfCards: 42,
            averageRating: 1,
            numberOfSubscribers: 3000
        },
        {
            id: 7,
            title: "Softwareentwicklung",
            owner: "Jane Doe",
            numberOfCards: 87,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 8,
            title: "Webentwicklung",
            owner: "Jane Doe",
            numberOfCards: 1000,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 9,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 33,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 10,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 56,
            averageRating: 3.5,
            numberOfSubscribers: 3000
        },
        {
            id: 11,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 223,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 12,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 342,
            averageRating: 3,
            numberOfSubscribers: 3000
        },
        {
            id: 13,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 36,
            averageRating: 4,
            numberOfSubscribers: 3000
        },
        {
            id: 14,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 76,
            averageRating: 5,
            numberOfSubscribers: 3000
        },
        {
            id: 15,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 56,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 16,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 11,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 17,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 223,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 18,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 123,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 19,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 9,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 20,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 44,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 21,
            title: "Informatik 1",
            owner: "Jane Doe",
            numberOfCards: 22,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        },
        {
            id: 22,
            title: "Informatik 1",
            owner: "John Doe",
            numberOfCards: 42,
            averageRating: 4.5,
            numberOfSubscribers: 3000
        }
    ],

    _deckToHtml: function (deck) {
        return `<div><h2>${deck.title}</h2><br/><p>Von ${deck.owner}</p><br/><p>${deck.numberOfCards} Karten</p></div>`;
    },

    fakeData: function () {
        let fd = new Array();
        this._decks.forEach(deck => {
            fd.push({ "id": deck.id, "html": this._deckToHtml(deck) })
        });
        return fd;
    }
};