module.exports = {

    sortByMark: function (a, b) {

        if (parseInt(a.mark ) > parseInt(b.mark)) {
            return 1;
        }
        if (parseInt(a.mark) < parseInt(b.mark)) {
            return -1;
        }
        return 0;
    },

    save: (err) => {
        if (err) throw err;
    },

    findByID : (array1, array2) => {
        return array1._id === array2._id;
    }

};