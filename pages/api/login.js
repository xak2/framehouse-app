import fetchJson from '../../lib/fetchJson'
import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    const { username, password } = await req.body
    const url = `http://localhost/framehouse-app/php/login.php?login=${username}&password=${password}`

    try {
        // we check that the user exists on GitHub and store some data in session
        const { data } = await fetchJson(url)
        if (data.error) {
            res.json({error: data.error})
        } else {
            const user = {
                isLoggedIn: true,
                id: data.id,
                name: data.name,
                type: data.type
            }
            req.session.set('user', user)
            await req.session.save()
            res.json(user)
        }
    } catch (error) {
        const { response: fetchResponse } = error
        res.status(fetchResponse?.status || 500).json(error.data)
    }
})