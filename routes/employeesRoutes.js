import express from "express";
import {
  employee_Add,
  deleteemployee,
  updatedemployee,
  getUsersWithGoodExperience,
  salaryIncrement,
  getEmployeesBetweenAges,
  getByDepartment,
  getAverageSalaryByDepartment,
  getEmployeeSalary,
  changeCollection,
  redact,
  lookup,
  getEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", employee_Add);

router.delete("/:employeeId", deleteemployee);
router.put("/:employeeId", updatedemployee);
router.get("/minexperience", getUsersWithGoodExperience);
router.get("/increment", salaryIncrement);
router.get("/ageGrouping", getEmployeesBetweenAges);
router.get("/department", getByDepartment);
router.get("/avgSalaryByDepartment", getAverageSalaryByDepartment);
router.get("/unwindSalary", getEmployeeSalary);
router.get("/changeName", changeCollection);
router.get("/redact", redact);
router.get("/lookup", lookup);
router.get("/all", getEmployees);
export default router;
