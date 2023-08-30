const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region : process.env.REGION,
     accessKeyId : process.env.AWS_ACCESS_KEY,
     secretAccessKey : process.env.AWS_SECRET_KEY,
    // endpoint : "http://localhost:8000"
});

var dynamoClient = new AWS.DynamoDB.DocumentClient();
const tableName = "product"

const create = async (req,res,next) => {
    try {
        const params = {
                TableName : tableName,
                Item: req.body,
                ReturnValues: 'ALL_OLD',
        };
        
        let data = await dynamoClient.put(params).promise()
        console.log("da...",data);
        return res.status(200).json({msg : "Data Added Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const getAllProduct = async (req,res,next) =>{
    try {
        let params;
        const search = req.query.search;
        if(search){
            params = {
                TableName : tableName,
                FilterExpression: "contains (#name,:name_val) OR contains (#productId,:productId)",
                ExpressionAttributeNames:{
                    "#name":"name",
                    "#productId":"productId"
                },
                ExpressionAttributeValues:{
                    ":name_val" : search,
                    ":productId" : search
                }
            }
        }else{
            params = {
                TableName : tableName,
            }
        }
        
        const getdata = await dynamoClient.scan(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

const updateProduct = async (req,res,next) =>{
    try {
        const productId = req.query.ID
        const params = {
            TableName : tableName,
            Item : {
                productId : productId,
                name : req.body.name
            }
        }
        await dynamoClient.put(params).promise()
        res.status(200).json({msg : "update Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const getProductById = async (req,res,next) =>{
    try {
        const productId = req.query.productId
        
        const params = {
            TableName : tableName,
            Key : {
                productId
            }
        }
        const getdata = await dynamoClient.get(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

const deleteItem = async (req,res,next) =>{
    try {
        const productId = req.query.productId
        const params = {
            TableName : tableName,
            Key : {
                productId
            }
        }
        const deleteItem = await dynamoClient.delete(params).promise()
        res.status(200).json({msg : "delete item successfully..!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const productUpdate = async  (req,res,next) => {
    try {
        const productId = req.query.productId
        const nameval= req.body.name

        var params = {
            TableName : tableName,
            Key : {
                "productId" : productId
            },
            UpdateExpression: 'set #name = :name_val',
            ExpressionAttributeNames:{
                '#name' : 'name'
            },
            ExpressionAttributeValues : {
                ":name_val" : nameval
            },
            ReturnValues: "UPDATED_NEW"
        };

        let data = await dynamoClient.update(params).promise()
        res.status(200).json(data.Attributes)
    } catch (e) {
        console.log("e...",e);
    }
}

module.exports = {
    create,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteItem,
    productUpdate
}