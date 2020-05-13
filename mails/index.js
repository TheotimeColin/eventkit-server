module.exports = {
    welcome: (to, { name = 'Joe' }) => ({
        from: "theotime@eventkit.social",
        to: to,
        envelope: {
            from: `Théotime d'eventkit <theotime@eventkit.social>`,
            to: to,
        },
        subject: `Bienvenue sur eventkit, ${name}`,
        text: "Bienvenue sur eventkit.",
        html: require('./templates/welcome.js')({ name })
    }),
    reset: (to, { name, token }) => ({
        from: "theotime@eventkit.social",
        to: to,
        envelope: {
            from: `Théotime d'eventkit <theotime@eventkit.social>`,
            to: to,
        },
        subject: `Réinitialiser ton mot de passe eventkit`,
        text: `Clique ici pour réinitialiser ton mot de passe : https://www.eventkit.social/account/reset?token=${token}`,
        html: require('./templates/reset.js')({ name, token })
    })
}