module.exports = {
    timeout: async function (min, max) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("Done"), this.getRandomInt(min, max))
        });
    },

    getRandomElement: async function (array) {
        return array[Math.floor(Math.random() * array.length)]
    },

    /*
        Returns a random integer between min (inclusive) and max (inclusive)
    */
    getRandomInt: async function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};