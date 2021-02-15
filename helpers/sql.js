const { BadRequestError } = require("../expressError");

/** Function 
 * @param {object} dataToUpdate - Data that will be used to update the database
 * @param {object} jsToSql - A javascript object that maps column names to their column names
 * @returns {string} setCols - A string that defines the Update statement in the sql query
 * @returns {array} values - A list of the values that will be inserted into the sql query
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {

    //extract all of the keys from the json that will be updated
    const keys = Object.keys(dataToUpdate);

    //if the input doesn't have any keys then there's no data
    if (keys.length === 0) throw new BadRequestError("No data");

    // Builds a list of strings that can be used with the db.query() method.
    // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
    const cols = keys.map((colName, idx) =>
        `"${jsToSql[colName] || colName}"=$${idx + 1}`,
    );

    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate),
    };
}

module.exports = { sqlForPartialUpdate };