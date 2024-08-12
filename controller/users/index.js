const express = require('express');
const router = express.Router();

const { connection } = require('../../helpers/config/pool');
const { ObjectId, MongoServerError } = require('mongodb');

const Joi = require('joi')




// Define schema with Joi for validation

const userAddSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be empty',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must be less than or equal to 30 characters',
            'any.required': 'Username is required',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required',
        }),
    dob: Joi.date()
        .required()
        .messages({
            'date.base': 'BirthDate must be a valid date',
            'any.required': 'BirthDate is required',
        }),

    mobile: Joi.string()
        .alphanum()
        .min(10)
        .max(10)
        .required()
        .messages({
            'string.base': 'Mobile No should be a type of text',
            'string.empty': 'Mobile No cannot be empty',
            'string.min': 'Mobile No must be at least 10 characters long',
            'string.max': 'Mobile No must be equal to 10 characters',
            'any.required': 'Mobile No is required',
        }),
});


// Define a schema with custom error messages
const userUpdateSchema = Joi.object({

    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be empty',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must be less than or equal to 30 characters',
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Please enter a valid email address',
        }),
    password: Joi.string()
        .min(6)
        .messages({
            'string.min': 'Password must be at least 6 characters long',
        }),
    dob: Joi.date()
        .messages({
            'date.base': 'BirthDate must be a valid date',
        }),
    mobile: Joi.string()
        .alphanum()
        .length(10)
        .messages({
            'string.base': 'Mobile No should be a type of text',
            'string.length': 'Mobile No must be exactly 10 characters long',
        }),
});



// Get a User By Id

router.get('/getbyid/:id', async (req, res) => {

    /*  #swagger.tags = ['Users']
       #swagger.description = 'Endpoint to Get a Users.' */

    // #swagger.summary = 'Get a Users By Id...!'

    return new Promise(async (resolve, reject) => {

        const db = await connection();

        const collection = db.collection('users');

        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {

            reject({ status: 200, message: "Invalid ID format" });

        } else {

            const user = await collection.findOne({ _id: new ObjectId(userId), status: 1 });

            if (!user) {

                reject({ status: 404, message: "User Not Found", data: [] })

            } else {

                resolve({ status: 1, message: "Success", data: user })

            }
        }

    }).then((data) => {

        res.status(200).json({ status: 1, message: data.message, data: data.data });

    }).catch((error) => {

        console.log("Error in catch", error)

        if (error.status) {

            res.status(error.status).json({ status: 0, message: error.message });

        } else {

            res.status(500).json({ status: 0, message: "Internal Server Error" });

        }
    })
});


// Add a New User

router.post('/add', async (req, res) => {

    /*  #swagger.tags = ['Users']
       #swagger.description = 'Endpoint to Adding a User.' */

    // #swagger.summary = 'Addinng a New User...!'

    /*  #swagger.requestBody = {
                required: true,
                content: {
                        "application/json": {
                        
                            example:  {
                                name:"string",
                                email:"example@gmail.com",
                                password:"string",
                                dob:"06/24/2000",
                                mobile:"88223XXXX"
                            }
                        }
                    }
            } 
    */

    return new Promise(async (resolve, reject) => {

        const db = await connection();

        const collection = db.collection('users');

        const { error, value } = userAddSchema.validate(req.body, { allowUnknown: true })

        if (error) {

            reject({ status: 200, message: error.details[0].message });

        } else {

            try {

                const result = await collection.insertOne(req.body);

                if (!result.insertedId) {

                    reject({ status: 200, message: 'Failed to insert user into database' });

                } else {

                    resolve({ status: 1, message: "User Inserted Successfully" })

                }

            } catch (insertError) {

                if (insertError instanceof MongoServerError) {

                    const errorMessage = insertError.errorResponse?.errmsg || 'Database error occurred';

                    reject({ status: 200, message: errorMessage });

                }
            }

        }


    }).then((data) => {

        res.status(200).json({ status: 1, message: data.message });

    }).catch((error) => {

        console.log("Error in catch", error)

        if (error.status) {

            res.status(error.status).json({ status: 0, message: error.message });

        } else {

            res.status(500).json({ status: 0, message: "Internal Server Error" });

        }
    })
});


// Update a Existing user

router.put('/update/:id', async (req, res) => {

    /*  #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to Update a Users.' */

    // #swagger.summary = 'Update a Users By Id...!'

    /*  #swagger.requestBody = {
                required: true,
                content: {
                        "application/json": {
                        
                            example:  {
                                name: 'String',
                            }
                        }
                    }
            } 
    */

    return new Promise(async (resolve, reject) => {

        const userId = req.params.id;

        const db = await connection();

        const collection = db.collection('users');

        // Find the existing user

        const existingUser = collection.findOne({ _id: new ObjectId(userId) });

        if (!existingUser) {

            return reject({ status: 200, message: "User Not Found" });

        }

        // const { error, value } = userUpdateSchema.validate(req.body)
        const { error, value } = userUpdateSchema.validate(req.body, { allowUnknown: true });


        if (error) {

            reject({ status: 200, message: error.details[0].message });

        } else {

            try {

                // const updateData = {

                //     name: value.name || existingUser.name,
                //     email: value.email || existingUser.email,
                //     password: value.password || existingUser.password,
                //     dob: value.dob || existingUser.dob,
                //     mobile: value.mobile || existingUser.mobile,

                // };


                const updateData = {
                    ...existingUser,
                    ...value
                };

                const result = await collection.updateOne(

                    { _id: new ObjectId(userId) },
                    { $set: updateData }
                )

                if (result.modifiedCount === 0) {

                    return resolve({ status: 1, message: 'No New changes, User Update Successfully' });

                } else {

                    resolve({ status: 1, message: "User Updated Successfully" })

                }

            } catch (insertError) {

                if (insertError instanceof MongoServerError) {

                    const errorMessage = insertError.errorResponse?.errmsg || 'Database error occurred';

                    reject({ status: 200, message: errorMessage });

                }
            }

        }


    }).then((data) => {

        res.status(200).json({ status: 1, message: data.message });

    }).catch((error) => {

        console.log("Error in catch", error)

        if (error.status) {

            res.status(error.status).json({ status: 0, message: error.message });

        } else {

            res.status(500).json({ status: 0, message: "Internal Server Error" });

        }
    })
});


// Delete a User

router.delete('/delete/:id', async (req, res) => {

    /*  #swagger.tags = ['Users']
        #swagger.description = 'Endpoint to Delete a Users.' */

    // #swagger.summary = 'Delete a Users By Id...!'

    return new Promise(async (resolve, reject) => {

        const db = await connection();
        const collection = db.collection('users');
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {

            reject({ status: 400, message: "Invalid ID format" });

        } else {
            try {
                const user = await collection.findOne({ _id: new ObjectId(userId) });

                if (!user) {

                    reject({ status: 404, message: "User Not Found" });

                } else {
                    if (user.status === 1) {

                        const result = await collection.updateOne(
                            { _id: new ObjectId(userId) },
                            { $set: { status: 0 } }
                        );

                        if (result.modifiedCount > 0) {

                            resolve({ status: 1, message: "User marked as inactive", data: user });

                        } else {

                            reject({ status: 400, message: "No changes made" });

                        }
                    } else {

                        reject({ status: 400, message: "User is already inactive" });

                    }
                }
            } catch (error) {
                reject({ status: 500, message: "Internal Server Error" });
            }
        }
    }).then((data) => {

        res.status(200).json({ status: 1, message: data.message, data: data.data });

    }).catch((error) => {

        console.log("Error in catch", error);

        if (error.status) {

            res.status(error.status).json({ status: 0, message: error.message });

        } else {

            res.status(500).json({ status: 0, message: "Internal Server Error" });

        }
    });
});


// Get All users

router.get('/index', async (req, res) => {

    /*  #swagger.tags = ['Users']
       #swagger.description = 'Endpoint to Listing all Users.' */

    // #swagger.summary = 'List all Users With Search By Name...!'


    return new Promise(async (resolve, reject) => {

        const db = await connection();
        const collection = db.collection('users');


        const numPerPage = parseInt(req.query.size) || 6;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * numPerPage;
        const search = req.query.search || '';
        const searchByField = req.query.searchByField || 'name';


        let query = { status: 1 };

        if (search) {
            query[searchByField] = { $regex: search, $options: 'i' };
        }


        const numRows = await collection.countDocuments(query);


        const numPages = Math.ceil(numRows / numPerPage);


        const users = await collection.find(query)
            .skip(skip)
            .limit(numPerPage)
            .toArray();

        console.log("Query", query)

        if (!users) {

            reject({ status: 404, message: "User Not Found", data: [] });

        } else {

            resolve({ numRows, numPages, page, limit: numPerPage, data: users });

        }
    }).then(data => {
        res.status(200).json({
            numRows: data.numRows,
            numPages: data.numPages,
            page: data.page,
            limit: data.limit,
            posts: data.data
        });
    }).catch(error => {

        console.log("Error in catch", error);

        if (error.status) {

            res.status(error.status).json({ status: 0, message: error.message });

        } else {

            res.status(500).json({ status: 0, message: "Internal Server Error" });

        }
    });
});






module.exports = router;