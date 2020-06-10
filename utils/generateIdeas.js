const Idea = require('../entities/packs/idea')
const IdeaCategory = require('../entities/packs/idea-category')

module.exports = async function generateCategories (original, newCategories) {
    let categories = []

    original = original.map(v => ({
        value: v,
        processed: false
    }))

    try {
        await newCategories.reduce(async (previousPromise, category) => {
            await previousPromise

            let result = category.new ? null : await IdeaCategory.findById(category._id)
            
            if (result) {
                let ideas = await generateIdeas(category, category.ideas, result.ideas)

                await result.update({
                    label: category.label,
                    theme: category.theme,
                    ideas: ideas ? ideas : result.ideas
                }, { new: true }).exec()
            } else {
                result = await IdeaCategory.create({
                    label: category.label,
                    theme: category.theme,
                    ideas: []
                })

                let ideas = await generateIdeas(result, category.ideas, [])
                if (ideas) {
                    result.update({
                        ideas: ideas
                    }, { new: true }).exec()
                }
            }

            return categories.push(result)
        }, Promise.resolve())

        await Promise.all(original.filter(v => !v.processed).map(async v => {
            let category = await IdeaCategory.findById(v.value._id)
            if (category) {
                await Promise.all(category.ideas.map(async idea => {
                    await Idea.findByIdAndDelete(idea)
                    return true
                }))

                category.deleteOne()
            }

            return true
        }))

        return categories
    } catch (e) {
        console.warn(e)
    }
}

async function generateIdeas (category, ideas, original) {
    try {
        original = original.reduce((acc, v) => ({
            ...acc, [v._id]: { _id: v._id, processed: false }
        }), {})

        let result = await Promise.all(ideas.map(async idea => {
            let values = {
                content: idea.content,
                disabled: idea.disabled,
                category: category._id,
                original: idea.original ? idea.original._id : null,
                pack: idea.pack ? idea.pack._id : null
            }

            if (idea.new) {
                idea = await Idea.create(values)
            } else {
                idea = await Idea.findByIdAndUpdate(idea._id, values)
            }

            if (original[idea._id]) original[idea._id].processed = true

            return idea._id
        }))

        await Promise.all(Object.keys(original).filter(_id => !original[_id].processed).map(async idea => {
            await Idea.findByIdAndDelete(idea)
            return true
        }))

        return result
    } catch (e) {
        console.warn(e)
    }
}

// module.exports = async function generateIdeas (original, newIdeas) {
//     let results = []
//     let categories = []

//     original = original.map(v => ({
//         value: v,
//         processed: false
//     }))

//     try {
//         await newIdeas.reduce(async (previousPromise, idea) => {
//             await previousPromise

//             let result = idea.new ? null : await Idea.findById(idea._id)
//             let category = null
            
//             if (idea.category) {
//                 category = idea.category.new ? await IdeaCategory.findOne({ id: idea.category._id }) : await IdeaCategory.findById(idea.category._id)

//                 if (category) {
//                     await category.update({
//                         label: idea.category.label
//                     }, { new: true }).exec()
//                 } else {
//                     category = await IdeaCategory.create({
//                         id: idea.category._id,
//                         label: idea.category.label,
//                         ideas: []
//                     })
//                 }
//             }

//             if (result) {
//                 await result.update({
//                     content: idea.content,
//                     disabled: idea.disabled,
//                     category: category ? category._id : undefined,
//                     original: idea.original ? idea.original._id : null,
//                     pack: idea.pack ? idea.pack._id : null
//                 }, { new: true }).exec()

//                 original = original.map(v => ({...v, processed: v.value.equals(result._id) ? true : v.processed }))
//             } else {
//                 result = await Idea.create({
//                     content: idea.content,
//                     disabled: idea.disabled,
//                     category: category ? category._id : undefined,
//                     original: idea.original ? idea.original._id : null,
//                     pack: idea.pack ? idea.pack._id : null
//                 })
//             }
            
//             if (category && categories.indexOf(category) === -1) categories.push(category._id)
//             results.push(result)

//             return true
//         }, Promise.resolve())

//         await Promise.all(original.filter(v => !v.processed).map(async idea => {
//             idea = await Idea.findById(idea.value)
//             await Idea.findByIdAndDelete(idea._id)

//             let linkedIdeas = await Idea.find({ category: idea.category })
//             if (linkedIdeas <= 0) await IdeaCategory.findByIdAndDelete(idea.category)

//             return true
//         }))

//         return {
//             categories: categories,
//             ideas: results.map(r => r._id)
//         }
//     } catch (e) {
//         console.warn(e)
//     }
// }