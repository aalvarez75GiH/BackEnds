const request = require('supertest')
const bcrypt = require('bcrypt')

const config = require('../../../config')
const product = require('./products.model')
const user = require('../users/users.model')
const { app, server } = require('../../../index')
// const { object } = require('@hapi/joi')


const productsForTesting = [
    {
        title: 'UX for Lean StartUps book',
        price: 30,
        currency: 'USD',
        owner: 'aalvarez'
    },
    {
        title: 'Fender Guitar',
        price: 150,
        currency: 'USD',
        owner: 'aalvarez'
    },
    {
        title: 'Microsoft Surface',
        price: 700,
        currency: 'USD',
        owner: 'aalvarez'
    },
    {
        title: 'Fender Guitar Amp',
        price: 200,
        currency: 'USD',
        owner: 'aalvarez'
    }
]

const testUser = {
    username: 'aalvarez',
    email: 'arnoldo@yahoo.com',
    password: '123456'
}

const newProductForTesting = {
    title: 'UX for Lean StartUps book',
    price: 30,
    currency: 'USD'
}


const productToReplace = {
    title: ' David Gilmour Black Strat Guitar',
    price: 5000,
    currency: 'USD'
}

let authToken
let invalidToken = '1111111111JIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYTNhNWRiMTVhMzQzOWYyMzgxZDc5NSIsImlhdCI6MTYzODExNzA13333333333oxNjM4MjAzNDU5fQ.jxGbm1pzUkut8V5NhgRQo6zyHrOV_Q3X92222222222'


const productIDThatDoNOtExists = '111112222233333444445555'

const getToken = (done) => {
    user.remove({}, error => {
        if (error) done(error)
        request(app)
        .post('/api/users')
        .send(testUser)
        .end((error, res)=> {
            expect(res.status).toBe(201)
            request(app)
            .post('/api/users/login')
            .send({
                username: testUser.username,
                password: testUser.password
            })
            .end((error, res) =>{
                expect(res.status).toBe(200)
                authToken = res.body.token
                console.log(authToken)
                done() 
            })
        })
    })
}

describe('Products', () => {
    
    beforeEach((done) => {
        product.remove({}, (err) => {
            done()
        })
    })

    afterAll(() => {
        server.close()
    })
    
    describe('GET /api/products:id ', () => {   
        test('if we try to get a product with a invalid ID (less than 24 chars) in the request process must fail', (done) => {
            request(app)
            .get('/api/products/719283a04e5a4e833f5')
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('if we try to get a product that does not exists at DB must fail and return 404 error status code', (done) => {
            Promise.all(productsForTesting.map( newProduct => new product(newProduct).save()))
            .then(response => {
                // console.log(response)
                request(app)
                .get(`/api/products/${productIDThatDoNOtExists}`)
                .end((error, res) => {
                    expect(res.status).toBe(404)
                    expect(typeof res.text).toBe('string')
                    done()
                })  
            })
        })

        test('if product exists at DB and ID is valid then process must return the product' , (done) => {
            Promise.all(productsForTesting.map( newProduct => new product(newProduct).save()))
            .then(products => {
                request(app)
                .get(`/api/products/${products[1]._id}`)
                .end((error, res) => {
                    expect(res.status).toBe(200)
                    expect(res.body).toBeInstanceOf(Object)
                    expect(res.body.title).toEqual(products[1].title)
                    expect(res.body.price).toEqual(products[1].price)
                    expect(res.body.currency).toEqual(products[1].currency)
                    expect(res.body.owner).toEqual(products[1].owner)
                    done()
                })
            })
            .catch(error => {
                done(error)
            })
        })
    })

    describe('POST /api/products', () => {
        beforeAll(getToken)

        test('if user provides a valid token and product is valid then product must be created' , (done) => {
            request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newProductForTesting)
            .end((error, res) => {
                expect(res.status).toBe(201)
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.title).toEqual(newProductForTesting.title)
                expect(res.body.price).toEqual(newProductForTesting.price)
                expect(res.body.currency).toEqual(newProductForTesting.currency)
                expect(res.body.owner).toEqual(testUser.username)
                done()
            })
        })

        test('if user DO NOT provides a valid token then product must NOT be created' , (done) => {
            request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(newProductForTesting)
            .end((error, res) => {
                expect(res.status).toBe(401)
                done()
            })
        })

        test('If Product title is missing the product must NOT be created', (done) => {
            request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                price: 30,
                currency: 'USD'
            })
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })
        test('If Product price is missing the product must NOT be created', (done) => {
            request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title:'Macbook Pro',
                currency: 'USD'
            })
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('If Product Currency is missing the product must NOT be created', (done) => {
            request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title:'MacBook Pro',
                price: 30
            })
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })
    })

    describe('DELETE /api/products', () => {
        
        let productToDeleteID
        beforeEach( done => {
            product.remove({}, (error) => {
                if (error) done(error)
                Promise.all(productsForTesting.map( newProduct => new product(newProduct).save()))
                .then(products => {
                    productToDeleteID = products[0]._id 
                    done()
                })
                .catch(error => {
                    done(error)
                })
            }) 
        })

        beforeAll(getToken)

        test('if we try to delete a product with a invalid ID (less than 24 chars) in the request process must fail', (done) => {
            request(app)
            .delete('/api/products/123')
            .set('Authorization', `Bearer ${authToken}`)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('if product does NOT exists at DB deletion process must fail returning 404 error status code', (done) => {
            request(app)
            .delete(`/api/products/${productIDThatDoNOtExists}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((error, res) => {
                expect(res.status).toBe(404)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('if user DO NOT provides a valid token then product must NOT be deleted', (done) => {
            request(app)
            .delete(`/api/products/${productToDeleteID}`)
            .set('Authorization', `Bearer ${invalidToken}`)
            .end((error, res) => {
                expect(res.status).toBe(401)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('If user is not the product`s owner deletion process must fail', (done) => {
            product({
                title: 'UX for Lean StartUps book',
                price: 30,
                currency: 'USD',
                owner: 'ksummers'
            }).save()
            .then(product => {
                request(app)
                .delete(`/api/products/${product._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .end((error, res) => {
                    expect(res.status).toBe(401)
                    expect(res.text.includes(`Sorry, you are not the owner of Product ID ${product._id}. You can not delete it if you are not the owner`)).toBe(true)
                    done()
                })

            })
        })

        test('If user is the product`s owner and the user delivers a valid token then deletion process must succeed', (done) => {
            request(app)
            .delete(`/api/products/${productToDeleteID}`)
            .set('Authorization', `Bearer ${authToken}`)
            .end((error, res) => {
                expect(res.status).toBe(200)
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.title).toEqual(productsForTesting[0].title)
                expect(res.body.price).toEqual(productsForTesting[0].price)
                expect(res.body.currency).toEqual(productsForTesting[0].currency)
                expect(res.body.owner).toEqual(productsForTesting[0].owner)
                product.findById(productToDeleteID)
                .then( productFound => {
                    expect(productFound).toBeNull()
                    done()
                })
                .catch(error => {
                    done(error)
                })
            })
        })
    })
    
    // (DONE) 'if we try to replace a product with a invalid ID (less than 24 chars) in the request then replacement process must fail'
    // (DONE) 'if product does NOT exists at DB replacement process must fail returning 404 error status code'
    // (DONE)'if user DO NOT provides a valid token then product must NOT be replaced'
    // (DONE)'If user is not the product`s owner replacement process must fail'
    // (DONE)'If user is the product`s owner and the user delivers a valid token then replacement process must succeed'
    // 'If Product title is missing the product must NOT be replaced'
    // 'If Product price is missing the product must NOT be replaced'
    // 'If Product currency is missing the product must NOT be replaced'

    describe('PUT /api/products', () => {
        
        let productToReplaceID
        beforeEach( done => {
            product.remove({}, (error) => {
                if (error) done(error)
                Promise.all(productsForTesting.map( newProduct => new product(newProduct).save()))
                .then(products => {
                    productToReplaceID = products[1]._id 
                    done()
                })
                .catch(error => {
                    done(error)
                })
            }) 
        })

        beforeAll(getToken)

        test('if we try to replace a product with a invalid ID (less than 24 chars) in the request then replacement process must fail', (done) => {
            request(app)
            .put('/api/products/123')
            .set('Authorization',`Bearer ${authToken}`)
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('if product does NOT exists at DB replacement process must fail returning 404 error status code', (done) => {
            request(app)
            .put(`/api/products/${productIDThatDoNOtExists}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(productToReplace)
            .end((error, res) => {
                expect(res.status).toBe(404)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('if user DO NOT provides a valid token then product must NOT be replaced', (done) => {
            request(app)
            .put(`/api/products/${productToReplaceID}`)
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(productToReplace)
            .end((error, res) => {
                // console.log(res.body)
                expect(res.status).toBe(401)
                done()
            })
        })

        test('If user is not the product`s owner replacement process must fail', (done) => {
            new product({
                title: 'David Gilmour Black Strat Guitar',
                price: 5000,
                currency: 'USD',
                owner: 'ksummers'
            }).save()
            .then(product => {
                request(app)
                .put(`/api/products/${product._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(productToReplace)
                .end((error, res) => {
                    expect(res.status).toBe(401)
                    done()
                })
            })
            .catch(error => {
                done(error)
            })
        })

        test('If user is the product`s owner and the user delivers a valid token then replacement process must succeed', (done) => {
            request(app)
            .put(`/api/products/${productToReplaceID}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(productToReplace)
            .end((error, res) => {
                expect(res.status).toBe(200)
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.title).toEqual(productToReplace.title)
                expect(res.body.price).toEqual(productToReplace.price)
                expect(res.body.currency).toEqual(productToReplace.currency)
                expect(res.body.owner).toEqual(testUser.username)
                done()
            })
        })

        test('If Product title is missing the product must NOT be replaced', (done) => {
            request(app)
            .put(`/api/products/${productToReplaceID}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                price: 5000,
                currency: 'USD'          
            })
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('If Product price is missing the product must NOT be replaced', (done) => {
            request(app)
            .put(`/api/products/${productToReplaceID}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'David Gilmour Black Strat',
                currency: 'USD'          
            })
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })

        test('If Product currency is missing the product must NOT be replaced', (done) => {
            request(app)
            .put(`/api/products/${productToReplaceID}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'David Gilmour Black Strat',
                price: 5000,          
            })
            .end((error, res) => {
                expect(res.status).toBe(400)
                expect(typeof res.text).toBe('string')
                done()
            })
        })
    })

})