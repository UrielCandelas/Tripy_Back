import { Router } from 'express'
import { getExpensesForTravel } from '../controllers/expenses.controller.js' 

const router = Router()

router.get('/expenses/:id', getExpensesForTravel)

export default router
