const router = require("express").Router();
const ctrl = require('./dynamodb');
const book = require('./bookroutes');

router.route("/create").post(ctrl.create);
router.route("/getAll").get(ctrl.getAllProduct);
router.route("/getProductById").get(ctrl.getProductById);
router.route("/updateProduct").put(ctrl.updateProduct);
router.route("/deleteItem").delete(ctrl.deleteItem);
router.route("/ProductUpdate").put(ctrl.productUpdate);


router.route("/bookData").get(book.getAllbook)
router.route("/createBook").post(book.createBook)
router.route("/getBoohById").get(book.getBookById)
router.route("/deleteByID").delete(book.deleteBookByID)
router.route("/EditBook").put(book.updateBook)


module.exports = router;