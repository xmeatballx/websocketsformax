module.exports = class Queue {
    constructor() {
        this.contents = [];
    }

    enqueue(element) {
        this.contents.push(element);
    }

    dequeue() {
        return this.contents.shift();
    }
}