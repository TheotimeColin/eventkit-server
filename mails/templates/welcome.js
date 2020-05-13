module.exports = ({ name }) => require('./default')({
    intro: `Bienvenue chez nous ${name} !`,
    text: `Ton inscription sur eventkit est validée. Il ne te reste plus qu'à créer et partager !`,
    cta: {
        text: `Commencer à créer`,
        href: `https://www.eventkit.social/kits`
    },
    footer: `À tout de suite !`
})

