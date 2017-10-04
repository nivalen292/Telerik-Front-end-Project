const getMonthNumber = (month) => {
    switch (month) {
        case 'Jan':
            return 1;
        case 'Feb':
            return 2;
        case 'Mar':
            return 3;
        case 'Apr':
            return 4;
        case 'May':
            return 5;
        case 'Jun':
            return 6;
        case 'Jul':
            return 7;
        case 'Aug':
            return 8;
        case 'Sep':
            return 9;
        case 'Oct':
            return 10;
        case 'Nov':
            return 11;
        case 'Dec':
            return 12;
    }
}

const getLatest = (arr) => {
    arr.sort((x, y) => {
        if (+x.date.year === +y.date.year) {
            if (getMonthNumber(x.date.month) === getMonthNumber(y.date.month)) {
                return +x.date.day + +y.date.day;
            }
            else {
                return getMonthNumber(x.date.month) + getMonthNumber(y.date.month);
            }
        }
        else {
            return +x.date.year + +y.date.year
        }
    });
    arr = arr.slice(0, 7);
    return arr;
}

export { getLatest };