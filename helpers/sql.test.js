const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql")
describe("Build a db.query string input", function() {
    test("A typical input", function() {
        const data = { firstName: 'Aliya', age: 32 };
        const jsToSql = { firstName: "first_name", lastName: "last_name", age: "age" };
        const { setCols, values } = sqlForPartialUpdate(data, jsToSql);

        expect(setCols).toEqual(`"first_name"=$1, "age"=$2`);
        expect(values).toEqual(['Aliya', 32]);
    });
    test("A case where the data has info not included in the json map", function() {
        const data = { firstName: 'Aliya', carModel: "civic" };
        const jsToSql = { firstName: "first_name", lastName: "last_name", age: "age" };
        const { setCols, values } = sqlForPartialUpdate(data, jsToSql);

        expect(setCols).toEqual(`"first_name"=$1, "carModel"=$2`);
        expect(values).toEqual(['Aliya', "civic"]);
    });
    test("No data is included an error gets thrown", function() {
        const data = {};
        const jsToSql = { firstName: "first_name", lastName: "last_name", age: "age" };
        try {
            const { setCols, values } = sqlForPartialUpdate(data, jsToSql);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});