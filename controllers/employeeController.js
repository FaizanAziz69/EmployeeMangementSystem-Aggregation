import employees from "../model/Schema.js";
import managerModel from "../model/managerSchema.js";

export const employee_Add = async (req, res) => {
  try {
    const { name, age, department, salary, experience, joiningDate, projects } =
      req.body;
    console.log(req.body);
    let managerInfo = null;

    const manager = await managerModel.findOne({ department });
    console.log(manager);

    if (manager) {
      managerInfo = {
        id: manager._id,
        name: manager.managerName,
      };
    }

    const addemployee = new employees({
      name,
      age,
      department,
      salary,
      experience,
      joiningDate,
      projects,
      manager: managerInfo,
    });

    await addemployee.save();
    console.log(addemployee);
    res.json(addemployee);
  } catch (err) {
    res.json(err);
  }
};

export const employeebyid = async (req, res) => {
  try {
    const empolyeeId = req.params.employeeId;
    console.log(empolyeeId);
    const getemployeebyId = await employees.findById(empolyeeId);
    res.json(getemployeebyId);
    console.log(getemployeebyId);
  } catch (err) {
    res.json(err);
  }
};
export const deleteemployee = async (req, res) => {
  try {
    const employee = req.params.employeeId;
    const deletedemployee = await employees.findByIdAndDelete({
      _id: employee,
    });
    res.json(deletedemployee);
  } catch (err) {
    res.json(err);
  }
};
export const updatedemployee = async (req, res) => {
  try {
    const updateemployee = await employees.updateOne(
      { _id: req.params.employeeId },
      {
        $set: {
          name: req.body.name,
          department: req.body.department,
          salary: req.body.salary,
          experience: req.body.experience,
          JoiningDate: req.body.JoiningDate,
        },
      }
    );
    res.json(updateemployee);
  } catch (err) {
    res.json(err);
  }
};

export const getUsersWithGoodExperience = async (req, res) => {
  try {
    const minExperienceUsers = await employees.aggregate([
      {
        $match: { experience: { $gte: 5 } },
      },
    ]);

    res.json(minExperienceUsers);
  } catch (err) {
    res.json(err);
  }
};

export const salaryIncrement = async (req, res) => {
  try {
    const incrementPercentage = 1.1;

    const incrementedEmployees = await employees.aggregate([
      {
        $match: {
          experience: { $gte: 5 },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          department: 1,
          salary: 1,
          experience: 1,
          incrementedSalary: {
            $multiply: ["$salary", incrementPercentage],
          },
        },
      },
    ]);

    const notIncrementedEmployees = await employees.aggregate([
      {
        $match: {
          experience: { $lte: 5 },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          department: 1,
          salary: 1,
          experience: 1,
          incrementedSalary: "$salary",
        },
      },
      {
        $out: "Employees whose salaries have not increased are sent to the 'notIncrementedEmployees' collection.",
      },
    ]);

    res.json({
      incrementedEmployees,
      message:
        "employees who salary not increases are send to 'notIncrementedEmployees' collection.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeesBetweenAges = async (req, res) => {
  try {
    const { page = 1, pageSize = 2 } = req.query;

    const pageNumber = parseInt(page);
    const limit = parseInt(pageSize);

    const skip = (pageNumber - 1) * limit;

    const pipeline = [
      {
        $match: {
          age: { $gte: 20, $lte: 30 },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const result = await employees.aggregate(pipeline);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getByDepartment = async (req, res) => {
  try {
    const dep = req.query.department;

    const pipeline = [
      {
        $match: { department: dep },
      },
    ];

    const result = await employees.aggregate(pipeline);

    if (!result.length) {
      res.status(404).json({ message: "Department not found" });
    } else {
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function getAverageSalaryByDepartment(req, res) {
  try {
    const aggregationResult = await employees.aggregate([
      {
        $group: {
          _id: "$department",
          averageSalary: { $avg: "$salary" },
        },
      },
    ]);
    res.json(aggregationResult);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not calculate average salaries by department" });
  }
}

export { getAverageSalaryByDepartment };

export const getEmployeeSalary = async (req, res) => {
  try {
    const aggregationPipeline = [
      {
        $unwind: "$projects",
      },
    ];

    const result = await employees.aggregate(aggregationPipeline);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const changeCollection = async (req, res) => {
  try {
    const aggregationPipeline = [
      {
        $unwind: "$projects",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          department: { $first: "$department" },
          salary: { $first: "$salary" },
          experience: { $first: "$experience" },
          projects: { $push: "$projects" },
        },
      },
      {
        $out: "projectEmployees", // Specify the name of the new collection
      },
    ];

    await employees.aggregate(aggregationPipeline).exec();
    res.json({
      message: "Data has been written to 'projectEmployees' collection.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const redact = async (req, res) => {
  try {
    const aggregationPipeline = [
      {
        $redact: {
          $cond: {
            if: { $gte: ["$salary", 50000] },
            then: "$$DESCEND",
            else: "$$PRUNE",
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          age: 1,
          department: 1,
          renamedSalary: "$salary",
        },
      },
    ];

    const results = await employees.aggregate(aggregationPipeline);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const lookup = async (req, res) => {
  try {
    const employeesWithManager = await employees.aggregate([
      {
        $lookup: {
          from: "managers",
          localField: "manager.id",
          foreignField: "_id",
          as: "managerInfo",
        },
      },
    ]);

    res.json(employeesWithManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getEmployees = async(req,res)=>{
  try {
    const allEmployees = await employees.find()
    res.json(allEmployees)
  } catch (error) {
    res.json({message:error.message})
  }
}
