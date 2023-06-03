export default class IwObject {
    readonly theObject: object;

    constructor(theObject: object) {
        this.theObject = theObject;
    }

    /**
     * to initialise variable
     * @param {Object} items Object of key value pair
     *
     * @usage:
     * iwAddToObject(window.iw, {'url': xxx, 'total': 15})
     *
     * Result:
     * window.iw.url = xxx
     * window.iw.total = 15
     *
     */
    add(items: object) {
        if (!items) return;
        for (const [key, val] of Object.entries(items)) {
            this.theObject[key] = val;
        }
    }

    /**
     * to reset the items inside an object to default value.
     * - string type item become empty string
     * - ignore null, empty string and boolean item
     * - array type item become emtpy array
     * - otherwise will be reset to null
     * - able to take care of Oject item as well
     * @param {string[]} ignoreKeyList
     */
    reset(ignoreKeyList: string[] = []) {
        Object.keys(this.theObject).map((key) => {
            for (const ignoreKey of ignoreKeyList) {
                if (key === ignoreKey) return;
            }

            // Test if it's an Object
            if (this.theObject[key] === Object(this.theObject[key])) {
                (new IwObject(this.theObject[key])).reset();
                return;
            }
            if (
                this.theObject[key] === null ||
                this.theObject[key] === '' ||
                typeof this.theObject[key] === 'boolean'
            ) {
                return;
            }
            if (typeof this.theObject[key] === 'string') {
                this.theObject[key] = '';
                return;
            }
            if (this.theObject[key] instanceof Array) this.theObject[key] = [];
            else this.theObject[key] = null;
        });
    }

    /**
     * a = [
     *   { id: 111, name: 'John', age: 29 },
     *   { id: 112, name: 'Sarah', age: 25 },
     * ];
     * b = iwObjectFromArray(a, 'id');
     * output:
     * 111: {
     *   age: 29,
     *   id: 111,
     *   name: "John"
     * },
     * 112: {
     *   age: 25,
     *   id: 112,
     *   name: "Sarah"
     * },
     */
    static fromArray(theArray: Array<object>, key: string) {
        const res = {};
        for (let idx = 0; idx < theArray.length; idx++) {
            //console.log(theArray[idx]);
            res[theArray[idx][key]] = theArray[idx];
        }
        return res;
    }
}
