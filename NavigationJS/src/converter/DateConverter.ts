import TypeConverter = require('./TypeConverter');

class DateConverter extends TypeConverter {
    constructor(key: string) {
        super(key, 'date');
    }

    convertFrom(val: string): any {
        var dateParts = val.split('-');
        if (dateParts.length !== 3)
            throw Error(val + ' is not a valid date');
        var date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
        if (isNaN(+date))
            throw Error(val + ' is not a valid date');
        return date;
    }

    convertTo(val: Date): { val: string, vals?: string[] } {
        var year = val.getFullYear();
        var month = ('0' + (val.getMonth() + 1)).slice(-2);
        var day = ('0' + val.getDate()).slice(-2); 
        return { val: year + '-' + month + '-' + day };
    }
}
export = DateConverter;
