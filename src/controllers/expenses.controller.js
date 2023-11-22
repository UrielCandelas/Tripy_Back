import Expenses from "../models/expenses.model.js";
import User from "../models/auth.model.js";
import Travel from "../models/travels.model.js";

export const getExpensesForTravel = async (req, res) => {
    const { id } = req.params
    try {
        const travles = await Travel.findAll({where: {id_location: id}})
        const expenseid = []
        const expensesFoundArr = []
        for (let index = 0; index < travles.length; index++) {
            expenseid.push(travles[index].dataValues.id_expenses)
            if (expenseid[index]) {
                const expensesFound = await Expenses.findOne({where: {id: expenseid[index]}})
                expensesFoundArr.push(expensesFound)
            }
        }
        res.status(200).json(expensesFoundArr);
    } catch (error) {
        res.status(500).json(["Ha ocurrido un error"]);
        console.log(error)
    }
}