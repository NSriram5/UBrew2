const Style = require('../models').Style;
const Op = require('../models/').Sequelize.Op;
module.exports = {
    createStyle(style) {
        return Style
            .create(style, { returning: ['id', 'name', 'color'] })
            .then((result) => {
                //console.log(result);
                return result;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    getStyle(filter) {
        let whereclause;
        whereclause = {};
        if (filter.name) {
            whereclause.Name = {
                [Op.iLike]: '%' + filter.name + '%'
            };
        }
        if (filter.id) {
            whereclause.id = {
                [Op.eq]: filter.id
            };
        }

        return Style
            .findAll({
                raw: true,
                where: whereclause,
                attributes: ["id", "name", "color"],
            })
            .then((result) => {
                console.log('Ingredient Found');
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error in the create');
                return error;
            });
    },

    getAllStyles() {
        return Style.findAll({ raw: true })
            .then((result) => {
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error, 'There was an error retrieving Ingredients');
                return error;
            });
    },
    bulkCreateStyles(styles) {
        return Style
            .bulkCreate(styles)
            .then((result) => {
                //console.log(result);
                console.log('successfully created styles');
                return result;
            })
            .catch((err) => {
                console.log(err);
                console.log('THere was an error in the bulk creation of recipe ingredients');
                return err;
            });
    }

}