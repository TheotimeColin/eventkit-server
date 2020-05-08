const Idea = require('../entities/packs/idea')

module.exports = async function generateIdeas (original, newIdeas) {
    let result = []
    original = original.map(v => ({
        value: v,
        processed: false
    }))

    result = await Promise.all(newIdeas.map(async idea => {
        let result = idea.new ? null : await Idea.findById(idea._id)

        if (result) {
            await result.update({
                content: idea.content,
                disabled: idea.disabled,
                pack: idea.pack ? idea.pack._id : null
            }, { new: true }).exec()

            original = original.map(v => ({...v, processed: v.value.equals(result._id) ? true : v.processed }))
        } else {
            result = await Idea.create({
                content: idea.content,
                disabled: idea.disabled,
                pack: idea.pack ? idea.pack._id : null
            })
        }

        return result
    }))

    await Promise.all(original.filter(v => !v.processed).map(async idea => {
        return await Idea.findByIdAndDelete(idea.value)
    }))

    return result.map(r => r._id)
}