const Kit = require('../entities/kits/kit')

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    await this('Kit').updateMany({ translations: { $exists: false } }, {
        lang: 'fr',
        translations: []
    }, { multi: true })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
