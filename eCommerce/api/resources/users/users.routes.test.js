let request = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let app = require('../../../index').app
let server = require('../../../index').server
const config = require('../../../config')
let user = require('./users.model')

let usersForTesting = [
    {
        username: 'aalvarez',
        email: 'arnoldo@yahoo.com',
        password: '123456'
    },
    {
        username: 'ksummers',
        email: 'kris@yahoo.com',
        password: '123456'
    },
    {
        username: 'anaP',
        email: 'ana@yahoo.com',
        password: '123456'
    },
    {
        username: 'rels',
        email: 'race@yahoo.com',
        password: '123456'
    },
    {
        username: 'lels',
        email: 'lorelei@yahoo.com',
        password: '123456'
    }
]
// we use this test to verify that after a user has been created this user is
// not created again bc it is already at DB
function userExistsAndAttributesAreCorrect(foundUser, done) {
    user.find({ username: foundUser.username})
    .then( user => {
        expect(user).toBeInstanceOf(Array)
        expect(user).toHaveLength(1)
        expect(user[0].username).toEqual(foundUser.username)
        expect(user[0].email).toEqual(foundUser.email)

        let samePassword = bcrypt.compareSync(foundUser.password, user[0].password)
        expect(samePassword).toBeTruthy()
        done()
    })
    .catch(error => {
        done(error)
    })
}

// we use this function to verify that after a test user was not created
const verifyingUserAtDB = async(User, done) => {
    try {
        let users = await user.find().or([{'username': User.username},{'email': User.email}])
        expect(users).toHaveLength(0)
        done()
    } catch (error) {
        done(error)
    }
}

describe('Users', () => {
    
    beforeEach((done) => {
        user.remove({}, (err) => {
            done()
        })
    })

    afterAll(() => {
        server.close()
    })

    describe('GET /api/users', () => {
    test('If there is no users at DB, it should return an empty array', (done) => {
    request(app)
        .get('/api/users')
            .end((err,res) =>{
                expect(res.status).toBe(200)
                expect(res.body).toBeInstanceOf(Array)
                expect(res.body).toHaveLength(0)
                done()
            })
    })
    
    test('If users are found at DB, it should return an array with all users', (done) => {
        Promise.all(usersForTesting.map( x => new user(x).save()))
        .then(users => {
            request(app)
            .get('/api/users')
                .end((error, res) => {
                expect(res.status).toBe(200)
                expect(res.body).toBeInstanceOf(Array)
                expect(res.body).toHaveLength(5)
                done()
            })
        })
    })
    })

    describe('POST /api/users', () => {
    
        test('If user complies with all validations and does not exists at DB then its created', (done) => {
    request(app)
        .post('/api/users')
        .send(usersForTesting[0])
        .end((error, res) => {
            expect(res.status).toBe(201)
            expect(typeof res.text).toBe('string')
            expect(res.text).toEqual('User has been created successfully')
            userExistsAndAttributesAreCorrect(usersForTesting[0], done)
        })
    })

    test('If a new user enter an username that already exists at DB, process must fail with 409 status error', (done) => {
        Promise.all(usersForTesting.map( x => new user(x).save()))
        .then(users => {
            request(app)
                .post('/api/users')
                .send({
                    username: 'aalvarez',
                    email: 'arnoldoNewEmail@yahoo.com',
                    password: '123456'
                })
                .end((error, res) => {
                    expect(res.status).toBe(409)
                    expect(typeof res.text).toBe('string')
                    done()      
                })   
        })
    })
    
    test('If a new user enter an email that already exists at DB, process must fail with 409 status error', (done) => {
        Promise.all(usersForTesting.map( x => new user(x).save()))
        .then(users => {
            request(app)
                .post('/api/users')
                .send({
                    username: 'aalvarezNew',
                    email: 'arnoldo@yahoo.com',
                    password: '123456'
                })
                .end((error, res) => {
                    expect(res.status).toBe(409)
                    expect(typeof res.text).toBe('string')
                    done()
                })   
        })
    })
    
    test('An user without username should not be created', (done) => {
        let user = {
            email: 'arnoldo@yahoo.com',
            password: '123456'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })

    test('An user without email should not be created', (done) => {
        let user = {
            username:'aalvarez',
            password: '123456'
        }

        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })

    test('An user without password should not be created', (done) => {
        let user = {
            username: 'aalvarez',
            email: 'arnoldo@yahoo.com'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })
    test('An user with an invalid email should not be created', (done) => {
        const user = {
            username: 'aalvarez',
            email: 'arnoldo_yahoo.com',
            password: '123456'
        }
        
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })
    test('An user with an username with less than 3 chars should not be created', (done) => {
        const user = {
            username: 'aa',
            email: 'arnoldo@yahoo.com',
            password: '123456'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })
    test('An user with an username with more than 30 chars should not be created', (done) => {
        const user = {
            username: 'aaaaaaaaaaaaaaaaaaaaaaaaalvarez',
            email: 'arnoldo@yahoo.com',
            password: '123456'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })
    test('An user with a password with less than 6 chars should not be created', (done) => {
        const user = {
            username: 'aalvarez',
            email: 'arnoldo@yahoo.com',
            password: '12345'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })
    test('An user with a password more than 30 chars should not be created', (done) => {
        const user = {
            username: 'aalvarez',
            email: 'arnoldo@yahoo.com',
            password: '1234567890123456789012345678901'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                verifyingUserAtDB(user, done)
                done()
            })   
    })

    test('username or email must be valid and stored as lowercase', (done) => {
        const user = {
            username: 'Aalvarez',
            email: 'arnOldo@Yahoo.com',
            password: '123456'
        }
        request(app)
            .post('/api/users')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(201)
                expect(typeof res.text).toBe('string')
                userExistsAndAttributesAreCorrect({
                    username: user.username.toLowerCase(),
                    email: user.email.toLowerCase(),
                    password: user.password
                }, done)                
            })   
    })
})

    describe('POST /api/users/login', () => {
        test('Login must fails if request do not contain an username', (done) => {
            const user ={
                password:'123456'
            }
            request(app)
            .post('/api/users/login')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })
        test('Login must fails if request do not contain an password', (done) => {
            const user ={
                username:'aalvarez'
            }
            request(app)
            .post('/api/users/login')
            .send(user)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })
        test('Login must fails if not auth user does not exists at DB', (done) => {
            const userBody ={
                username:'jonhDoe',
                password:'123456'
            }
            Promise.all(usersForTesting.map( x => new user(x).save()))
            .then(users => {
                request(app)
                .post('/api/users/login')
                .send(userBody)
                .end((error, res) => {
                    expect(res.status).toBe(400)
                    expect(typeof res.text).toBe('string')
                    done()
                })
            })
        })

        test('Login must fail if not Auth user enter an invalid password', (done) => {
            const notAuthUser = {
                username: 'aalvarez',
                email: 'arnoldo@yahoo.com',
                password:'123456'
            }
            new user({
                username: notAuthUser.username,
                email: notAuthUser.email,
                password: bcrypt.hashSync(notAuthUser.password, 10)
            }).save()
            .then((newUser) => {
                request(app)
                .post('/api/users/login')
                .send({
                    username: notAuthUser.username,
                    password:'123457'
                })
                .end((error, res) => {
                    expect(res.status).toBe(400)
                    expect(typeof res.text).toBe('string')
                    done()
                })
            })
            .catch(error => {
                done(error)
            })
        })
        test('User must get a valid token if authentication process is successful', (done) => {
            const notAuthUser = {
                username: 'aalvarez',
                email: 'arnoldo@yahoo.com',
                password:'123456'
            }
            new user({
                username: notAuthUser.username,
                email: notAuthUser.email,
                password: bcrypt.hashSync(notAuthUser.password, 10)
            }).save()
            .then((newUser) => {
                request(app)
                .post('/api/users/login')
                .send({
                    username: notAuthUser.username,
                    password: notAuthUser.password
                })
                .end((error, res) => {
                    expect(res.status).toBe(200)
                    expect(res.body.token).toEqual(jwt.sign({ id: newUser._id },
                        config.jwt.secret, {
                        expiresIn: config.jwt.expirationDate,
                    }))
                    done()
                })
            })
            .catch(error => {
                done(error)
            })
        })
        
        test('When users do login, their credentials can be LoweCase or UpperCase', (done) => {
            const notAuthUser = {
                username: 'aalvarez',
                email: 'arnoldo@yahoo.com',
                password:'123456'
            }
            new user({
                username: notAuthUser.username,
                email: notAuthUser.email,
                password: bcrypt.hashSync(notAuthUser.password, 10)
            }).save()
            .then((newUser) => {
                request(app)
                .post('/api/users/login')
                .send({
                    username: 'AALVAREZ',
                    password: notAuthUser.password
                })
                .end((error, res) => {
                    expect(res.status).toBe(200)
                    expect(res.body.token).toEqual(jwt.sign({ id: newUser._id },
                        config.jwt.secret, {
                        expiresIn: config.jwt.expirationDate,
                    }))
                    done()
                })
            })
            .catch(error => {
                done(error)
            })
        })

        
})
})
