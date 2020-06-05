const Idea = require('../entities/packs/idea')
const IdeaCategory = require('../entities/packs/idea-category')

module.exports = async function generateIdeas (original, newIdeas) {
    let results = []
    original = original.map(v => ({
        value: v,
        processed: false
    }))

    try {
        await newIdeas.reduce(async (previousPromise, idea) => {
            await previousPromise

            let result = idea.new ? null : await Idea.findById(idea._id)
            let category = null
            
            if (idea.category) {
                category = idea.category.new ? await IdeaCategory.findOne({ id: idea.category._id }) : await IdeaCategory.findById(idea.category._id)

                if (category) {
                    await category.update({
                        label: idea.category.label
                    }, { new: true }).exec()
                } else {
                    category = await IdeaCategory.create({
                        id: idea.category._id,
                        label: idea.category.label,
                        ideas: []
                    })
                }
            }

            if (result) {
                await result.update({
                    content: idea.content,
                    disabled: idea.disabled,
                    category: category ? category._id : undefined,
                    original: idea.original ? idea.original._id : null,
                    pack: idea.pack ? idea.pack._id : null
                }, { new: true }).exec()

                original = original.map(v => ({...v, processed: v.value.equals(result._id) ? true : v.processed }))
            } else {
                result = await Idea.create({
                    content: idea.content,
                    disabled: idea.disabled,
                    category: category ? category._id : undefined,
                    original: idea.original ? idea.original._id : null,
                    pack: idea.pack ? idea.pack._id : null
                })
            }

            results.push(result)

            return true
        }, Promise.resolve())

        await Promise.all(original.filter(v => !v.processed).map(async idea => {
            return await Idea.findByIdAndDelete(idea.value)
        }))

        return results.map(r => r._id)
    } catch (e) {
        console.warn(e)
    }
}