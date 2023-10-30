import express from 'express'
import { avgExperience, avgSalary, departmentManager, manager, redactSalary,salaryIncrement,storeAggregatedEmployeeData } from '../controllers/managerController.js'

const app =express.Router()

app.post('/',manager)
app.get('/department',departmentManager)
app.get('/salary',redactSalary)
app.get("/store-aggregated-employee-data", storeAggregatedEmployeeData);
app.get('/avgSal',avgSalary)
app.get('/avgAge',avgExperience)
app.get('/salaryIncrement',salaryIncrement)
export default app