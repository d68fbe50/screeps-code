const fs = require("fs")
const https = require('https')

const email = '<your e-mail>'
const password = '<your password>'
const data = {
    branch: 'default',         
    modules: {}
}

const files = fs.readdirSync('src/')
for (const i of files) {
    data.modules[i.slice(0, -3)] = fs.readFileSync('src/' + i).toString()
}

const req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    auth: email + ':' + password,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

req.write(JSON.stringify(data))
req.end()
