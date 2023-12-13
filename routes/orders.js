const { Order } = require("../models/order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

router.get("/", isAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });
    
    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//OBTENER UNA ORDEN

router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!req.user.isAdmin)
      return res.status(403).send("Acceso denegado. No autorizado..");
    
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

//ELIMINAR UNA ORDEN

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send("Order has been deleted...");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/income", isAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (err) {
    res.status(500).send(err);
  }
});

//ORDENES EN EL SUMARIO

router.get("/stast", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() -1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const orders = await Order.aggregate([
      { 
        $match: { createdAt: { $gte: new Date(previousMonth) } } 
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
