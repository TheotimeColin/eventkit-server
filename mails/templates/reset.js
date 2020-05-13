module.exports = ({ name, token }) => require('./default')({
    intro: `Bonjour ${name},`,
    text: `On dirait que tu as oublié ton mot de passe. Pas de panique, on va pouvoir le réinitialiser : il suffit de cliquer sur le bouton ci-desssous :`,
    cta: {
        text: `Réinitialiser mon mot de passe`,
        href: `https://www.eventkit.social/account/reset?token=${token}`
    },
    footer: `Si tu n'es pas à l'origine de cette action, ne touche à rien et vérifie que tes mots de passe n'ont pas été compromis.`
})

