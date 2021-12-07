const express = require('express')
const bodyParser = require('body-parser')
const _ = require('underscore')


const logger = require('../../../utils/logger')
const counters = require('../../../database').counters

const countersRouter = express.Router()

countersRouter.get('/', (req,res)=> {
    logger.info('Request get to counters successful...')
    res.send(counters)
})

countersRouter.get('/:id', (req,res)=> {
    let id = req.params.id
    const index = _.findIndex(counters, counter => counter.id == id)
    logger.info(`Request get to counter [${id}] successful...`)
    res.send(counters[index])
})

countersRouter.put( '/:id', ( req, res ) => {
    let id = req.params.id
    let dataToChange = req.body

    const index = _.findIndex(counters, counter => counter.id == id)
    if (index !== -1 ){
        dataToChange.id = id
        counters[index] = dataToChange
        logger.info(`Counter1 with id: [${id}] has been replaced it`, dataToChange)
        res.status(200).json(dataToChange)
    }else {
        res.status(404).send(`Sorry, we could NOT find the counter with ID [${id}]`)
    } 
})

module.exports = countersRouter