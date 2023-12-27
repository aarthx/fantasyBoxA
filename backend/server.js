const http = require('http')
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');
const hostname = '127.0.0.1'
const port = 3000
const mongoURL = 'mongodb+srv://fantasyBoxAdm:v9n1Y6R6KKOQoFXo@blogapp-prod.mpk225h.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(mongoURL);
async function mongoConnect() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
  } catch (erro) {
    console.error('Erro ao conectar ao MongoDB:', erro);
  }
}
mongoConnect();
const db = client.db('fantasyBox');
const usersCollection = db.collection('users');

function generateToken(user) {
    const payload = {
        username: user.usernameLogin
    };

    const options = {
        expiresIn: '30m', 
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
}

function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, secretKey);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

async function registerUser(username, email, password) {

    let repeatedUser = await verifyRepeatedUser(username, email)
    if(!repeatedUser.repeatead) {
        const newUser = {username, email, password, books: [], movies: [], games: []};
        const resultado = await usersCollection.insertOne(newUser);
        console.log('Usuário adicionado com sucesso:', resultado.insertedId);
    } else {
        return repeatedUser.repeatedInput
    }

}

async function verifyRepeatedUser(username, email) {

    const userExists = await usersCollection.findOne({ $or: [{ username }, { email }] });

     if (userExists) {
        if (userExists.username === username && userExists.email === email) {
            return { repeatead: true, repeatedInput: ['username', 'email'] };
        } else if(userExists.username === username) {
            return { repeatead: true, repeatedInput: ['username'] };
        } else {
            return { repeatead: true, repeatedInput: ['email'] };
        }
    }

    return { repeatead: false };
}

async function verifyLogin(username, password) {

    const usuario = await usersCollection.findOne({ username });

    if (!usuario) {
        return { success: false, message: 'Usuário não encontrado!' };
    }
    
    const correctPassword = await bcrypt.compare(password, usuario.password);

    if (correctPassword) {
        return { success: true, message: 'Usuário logado com sucesso!' };
    } else {
        return { success: false, message: 'Senha do usuário incorreta!' };
    }

}

async function addUserBook(username, newBook) {
    try {
        const filter = { username: username }; 
        const update = { $push: { books: newBook } }; 
        const result = await usersCollection.updateOne(filter, update);
        console.log('Livro adicionado com sucesso') 

    } catch(e) {console.error(e)}
}

async function loadUserBooks(username) {
    try {
        const filter = { username: username }; 
        const result = await usersCollection.findOne(filter);
        return result.books

    } catch(e) {console.error(e)}
}

function validateFields(username, email, password) {
    let regexUsername = /^[a-zA-Z0-9_-]{5,20}$/
    let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    return {
        usernameValidate: regexUsername.test(username),
        emailValidate: regexEmail.test(email),
        passwordValidate: regexPassword.test(password)
    }
}

const app = http.createServer(async (req, res) => {
    //CORS config
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
        res.statusCode = 204; // No Content
        res.end();
        return;
    }
    res.setHeader('Content-Type', 'application/json')

    // Routes Config
    if(req.url === '/' && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success', username: verifyTokenResult.username}))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }
    }
    else if(req.url === '/register' && req.method === 'POST') {
        let body = ''

        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', () => {
            const formData = JSON.parse(body)
            let validation = validateFields(
                formData.usernameRegister, 
                formData.emailRegister, 
                formData.passwordRegister 
            )
            if(Object.values(validation).every(el => el === true)) {
                bcrypt.hash(formData.passwordRegister, 10, async (err, hash) => {
                    if (err) {
                        console.error('Erro ao gerar hash:', err);
                        return;
                    }
                    let registerResult = await registerUser(formData.usernameRegister, formData.emailRegister, hash)
                    if(!registerResult) {
                        const responseObject = {
                            status: 'success',
                            message: 'Registrado com sucesso'
                        }
                        res.statusCode = 200
                        res.end(JSON.stringify(responseObject))
                    } else {
                        const responseObject = {
                            status: 'repeatedInput',
                            message: 'Nome de usuário ou email já utilizado',
                            repeated: registerResult
                        }

                        res.statusCode = 409
                        res.end(JSON.stringify(responseObject))
                    }
                });

            } else {
                const responseObject = {
                    status: 'error',
                    message: 'Campos não validados',
                    validation
                }
                res.statusCode = 200
                res.end(JSON.stringify(responseObject))
            }
        })
    }
    else if(req.url === '/login' && req.method === 'POST') {
        let body = ''

        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', async () => {
            const formData = JSON.parse(body)
            const verifyResult = await verifyLogin(formData.usernameLogin, formData.passwordLogin)
            if(verifyResult.success) {
                const responseObject = {
                    status: 'success',
                    message: 'Logado com sucesso',
                    username: formData.usernameLogin,
                    token: generateToken(formData)
                }
                userActive = formData.usernameLogin
                res.statusCode = 200
                res.end(JSON.stringify(responseObject))
            } else {
                const responseObject = {
                    status: 'error',
                    message: 'Ocorreu um erro ao logar',
                    error: verifyResult.message
                }
                res.statusCode = 401
                res.end(JSON.stringify(responseObject))
            }
            
        })
    }
    else if(req.url === '/books' && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const books = await loadUserBooks(verifyTokenResult.username)
                console.log(books)
                res.statusCode = 200
                res.end(JSON.stringify(books))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }

    }
    else if(req.url === '/books' && req.method === 'POST') {
        let verifyTokenResult
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            verifyTokenResult = verifyToken(receivedToken)
            if(!verifyTokenResult) {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            } 
        } else {
            res.statusCode = 401
            res.end(JSON.stringify({message: 'No tokens received'}))
        }

        let body = ''
        
        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', async () => {
            const formData = JSON.parse(body)
                console.log('chegou aqui')

            if(verifyTokenResult) {
            addUserBook(verifyTokenResult.username, formData)
            res.statusCode = 200
            res.end(JSON.stringify({message: 'success', username: verifyTokenResult.username}))
        }
        })
    }
    
})

app.listen(port, () => {
    console.log(`Server Node rodando em http://${hostname}:${port}`)
})