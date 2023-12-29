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

async function addUserMedia(username, newMedia, category) {
    try {
        const filter = { username: username }; 
        const update = { $push: { [category]: newMedia } }; 
        const result = await usersCollection.updateOne(filter, update);

    } catch(e) {console.error(e)}
}

async function loadUserMedia(username, category) {
    try {
        const filter = { username: username }; 
        const result = await usersCollection.findOne(filter);
        return result[category]

    } catch(e) {console.error(e)}
}

async function searchUniqueMedia(username, mediaName , category) {
    let mediaNameString
    if(category === 'books') mediaNameString = 'bookName'
    if(category === 'movies') mediaNameString = 'movieName'
    if(category === 'games') mediaNameString = 'gameName'
    try {
        const filter = { username: username }; 
        const result = await usersCollection.findOne(filter);
        const arrayOfMedias = result[category]
        let uniqueMedia = arrayOfMedias.filter(media => media[mediaNameString] === mediaName)[0]

        return uniqueMedia
    } catch(e) {console.error(e)}
}

async function deleteUniqueMedia(username, mediaName , category) {
   let mediaNameString
    if(category === 'books') mediaNameString = 'bookName'
    if(category === 'movies') mediaNameString = 'movieName'
    if(category === 'games') mediaNameString = 'gameName'
    try {
        const filter = { username: username }; 

        const resultOfRemove = await usersCollection.updateOne(filter, { $pull: { [category]: {[mediaNameString]: mediaName} } }, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar documento:', err);
        } else {
            console.log('Documento atualizado com sucesso:', result);
        }
        return resultOfRemove
    })
    } catch(e) {console.error(e)} 
}


function validationRegister(username, email, password) {
    let regexUsername = /^[a-zA-Z0-9_-]{5,20}$/
    let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    return {
        usernameValidate: regexUsername.test(username),
        emailValidate: regexEmail.test(email),
        passwordValidate: regexPassword.test(password)
    }
}

async function verifyIMG(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.startsWith('image/')) {
      return true
    } else {
      return false
    }
  } catch (erro) {
    return null
  }
}

async function verifyRepeatedMedia(username, mediaName, category) {
    let uniqueMedia = true
    const user = await usersCollection.findOne({ username });
    if(user) {
        if(category === 'books') {
            await user.books.forEach(book => {if(book.bookName === mediaName) {uniqueMedia = false}})
            return uniqueMedia
        } else if(category === 'movies') {
            user.movies.forEach(movie => {if(movie.movieName === mediaName) {uniqueMedia = false}})
            return uniqueMedia
        } else if(category === 'games') {
            user.games.forEach(game => {if(game.gameName === mediaName) {uniqueMedia = false}})
            return uniqueMedia
        }
    }  else {
        return null
    }
}

async function validationMedia(newMedia, category, username) {
    let regex50chars = /^[\s\S]{1,50}$/
    let regex25chars = /^[\s\S]{1,25}$/
    let regex500chars = /^[\s\S]{1,500}$/
    let date = new Date()
    if(category === 'books') {
        return {
            bookName: regex50chars.test(newMedia.bookName),
            bookAuthor: regex50chars.test(newMedia.bookAuthor),
            bookURL: await verifyIMG(newMedia.bookURL),
            bookGenre: regex50chars.test(newMedia.bookName),
            bookYear: (newMedia.bookYear >= -3200 && newMedia.bookYear <= date.getFullYear()),
            bookDate: (newMedia.bookDate instanceof Date && !isNaN(newMedia.bookDate)),
            bookRate: (newMedia.bookRate >= 0 && newMedia.bookRate <= 10),
            bookDescription: regex500chars.test(newMedia.bookDescription),
            validateRepeatedName: await verifyRepeatedMedia(username, newMedia.bookName, 'books')
        }
    } else if(category === 'movies') {
        return {
            movieName: regex50chars.test(newMedia.movieName),
            movieDirector: regex50chars.test(newMedia.movieDirector),
            movieURL: await verifyIMG(newMedia.movieURL),
            movieGenre: regex50chars.test(newMedia.movieName),
            movieYear: (newMedia.movieYear >= -3200 && newMedia.movieYear <= date.getFullYear()),
            movieDate: (newMedia.movieDate instanceof Date && !isNaN(newMedia.movieDate)),
            movieRate: (newMedia.movieRate >= 0 && newMedia.movieRate <= 10),
            movieDescription: regex500chars.test(newMedia.movieDescription),
            validateRepeatedName: await verifyRepeatedMedia(username, newMedia.movieName, 'movies'),
        }
    } else if(category === 'games') {
        return {
            gameName: regex50chars.test(newMedia.gameName),
            gameCompany: regex50chars.test(newMedia.gameCompany),
            gameURL: await verifyIMG(newMedia.gameURL),
            gameGenre: regex50chars.test(newMedia.gameName),
            gameDiff: (newMedia.gameDiff >= 1 && newMedia.gameDiff <= 5),
            gameTime: (newMedia.gameTime >= 0 && newMedia.gameTime <= 52596000),
            gameDate: (newMedia.gameDate instanceof Date && !isNaN(newMedia.gameDate)),
            gameConsole: regex25chars.test(newMedia.gameConsole),
            gameRate: (newMedia.gameRate >= 0 && newMedia.gameRate <= 10),
            gameDescription: regex500chars.test(newMedia.gameDescription),
            validateRepeatedName: await verifyRepeatedMedia(username, newMedia.gameName, 'games')
        }
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
            let validation = validationRegister(
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
                const books = await loadUserMedia(verifyTokenResult.username, 'books')
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
    else if(req.url.startsWith('/books/') && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const mediaName = decodeURIComponent(req.url.split('/')[2])
                const book = await searchUniqueMedia(verifyTokenResult.username, mediaName ,'books')
                res.statusCode = 200
                res.end(JSON.stringify(book))
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
            formData.bookYear = parseInt(formData.bookYear)
            formData.bookRate = parseInt(formData.bookRate)
            formData.bookDate = new Date(formData.bookDate)
            const bookValidation = await validationMedia(formData, 'books', verifyTokenResult.username)
            const validationOK = Object.values(bookValidation).every(val => val === true)
            if(verifyTokenResult && validationOK) {
                addUserMedia(verifyTokenResult.username, formData, 'books')
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success', username: verifyTokenResult.username}))
            } else {
                const invalidInputs = Object.keys(bookValidation).filter(input => bookValidation[input] !== true);
                res.statusCode = 400
                res.end(JSON.stringify({message: 'error', invalids: invalidInputs}))
            }
        })
    }
    else if(req.url.startsWith('/books/') && req.method === 'DELETE') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const mediaName = decodeURIComponent(req.url.split('/')[2])

                await deleteUniqueMedia(verifyTokenResult.username, mediaName ,'books')
                
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success'}))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }
    }
    else if(req.url === '/movies' && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const movies = await loadUserMedia(verifyTokenResult.username, 'movies')
                res.statusCode = 200
                res.end(JSON.stringify(movies))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }

    }
    else if(req.url.startsWith('/movies/') && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const mediaName = decodeURIComponent(req.url.split('/')[2])
                const movie = await searchUniqueMedia(verifyTokenResult.username, mediaName ,'movies')
                res.statusCode = 200
                res.end(JSON.stringify(movie))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }
    }
    else if(req.url === '/movies' && req.method === 'POST') {
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
            formData.movieYear = parseInt(formData.movieYear)
            formData.movieRate = parseInt(formData.movieRate)
            formData.movieDate = new Date(formData.movieDate)
            const movieValidation = await validationMedia(formData, 'movies', verifyTokenResult.username)
            const validationOK = Object.values(movieValidation).every(val => val === true)

            if(verifyTokenResult && validationOK) {
                addUserMedia(verifyTokenResult.username, formData, 'movies')
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success', username: verifyTokenResult.username}))
            } else {
                const invalidInputs = Object.keys(movieValidation).filter(input => movieValidation[input] !== true);
                res.statusCode = 400
                res.end(JSON.stringify({message: 'error', invalids: invalidInputs}))
            }
        })
    }
    else if(req.url.startsWith('/movies/') && req.method === 'DELETE') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const mediaName = decodeURIComponent(req.url.split('/')[2])

                await deleteUniqueMedia(verifyTokenResult.username, mediaName ,'movies')
                
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success'}))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }
    }
    else if(req.url === '/games' && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const games = await loadUserMedia(verifyTokenResult.username, 'games')
                res.statusCode = 200
                res.end(JSON.stringify(games))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }

    }
    else if(req.url.startsWith('/games/') && req.method === 'GET') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const mediaName = decodeURIComponent(req.url.split('/')[2])
                const game = await searchUniqueMedia(verifyTokenResult.username, mediaName ,'games')
                res.statusCode = 200
                res.end(JSON.stringify(game))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }

    }
    else if(req.url === '/games' && req.method === 'POST') {
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
            formData.gameDiff = parseInt(formData.gameDiff)
            formData.gameTime = parseInt(formData.gameTime)
            formData.gameRate = parseInt(formData.gameRate)
            formData.gameDate = new Date(formData.gameDate)
            const gameValidation = await validationMedia(formData, 'games', verifyTokenResult.username)
            const validationOK = Object.values(gameValidation).every(val => val === true)

            if(verifyTokenResult && validationOK) {
                addUserMedia(verifyTokenResult.username, formData, 'games')
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success', username: verifyTokenResult.username}))
            } else {
                const invalidInputs = Object.keys(gameValidation).filter(input => gameValidation[input] !== true);
                res.statusCode = 400
                res.end(JSON.stringify({message: 'error', invalids: invalidInputs}))
            }
        })
    }
    else if(req.url.startsWith('/games/') && req.method === 'DELETE') {
        const receivedToken = req.headers.authorization.replace('Bearer ', '')
        if(receivedToken !== 'null') {
            let verifyTokenResult = verifyToken(receivedToken)
            if(verifyTokenResult) {
                const mediaName = decodeURIComponent(req.url.split('/')[2])

                await deleteUniqueMedia(verifyTokenResult.username, mediaName ,'games')
                
                res.statusCode = 200
                res.end(JSON.stringify({message: 'success'}))
            } else {
                res.statusCode = 403
                res.end(JSON.stringify({message: 'Not Auth Token'}))
            }
        } else {
            res.statusCode = 200
            res.end(JSON.stringify({message: 'No tokens yet'}))
        }
    }
    
})

app.listen(port, () => {
    console.log(`Server Node rodando em http://${hostname}:${port}`)
})