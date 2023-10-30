import managerModel from "../model/managerSchema.js";

export const manager = async(req,res)=>{
    try {
        const {managerName,department,salary,experience} = req.body
       
        const addManager = new managerModel({
            managerName,
            department,
            salary,
            experience
        })
        await addManager.save()
        res.json({message:"manager added successfully",addManager})
    } catch (error) {
        res.json({message:error.message})
    }
}

export const  departmentManager = async(req,res)=>{

    try {
        const dep = req.query.department;
      console.log(dep)
       const pipeline = [
        {
        $match:{department:dep}
    }] 
    const result = await managerModel.aggregate(pipeline);
    res.json({message:result})
    } catch (error) {
        res.json({message:error.message})
    }
}


export const redactSalary = async(req,res)=>{
    try {
        const pipeline=[
            {
                $redact: {
                    $cond: {
                        if: { $gte: ["$salary", 50000] },
                        then: "$$DESCEND",
                        else: "$$PRUNE"
                    }
                }
            },
        ]
        const salary = await managerModel.aggregate(pipeline)
        res.json(salary)
    } catch (error) {
        res.json({message:error.message})
    }
}
import employees from "../model/Schema.js";
export const storeAggregatedEmployeeData = async (req, res) => {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'managers', 
            localField: 'manager.id',
            foreignField: '_id',
            as: 'managerInfo',
          },
        },
        {
            $project:{
            manager:0
            }
        },
        {
          $out: 'outManager', 
        },
      ];
  
      
      await employees.aggregate(pipeline).exec();
  
      res.json({ message: 'Aggregated and stored employee data successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const avgSalary = async(req,res)=>{
    try {
        const avgSal = await managerModel.aggregate([{
            $group:{
                _id:"$department",
               avgsalary:{$avg:"$salary"} 
             
            }}
        ])
        res.json({meesage:avgSal})
    } catch (error) {
        res.json({message:error.message})
    }
  }

  export const avgExperience = async(req,res)=>{
    try {
        const avgManagerExperience = await managerModel.aggregate([
            {
                $group:{
                    _id:"Managers",
                    avgExperience:{$avg:"$experience"}
                }
            }
        ])
        res.json({avgManagerExperience})
    } catch (error) {
        res.json({message:error.message})
    }
  }
 

  export const salaryIncrement = async (req, res) => {
    try {
      const incrementPercentage = 1.1;
  
      const result = await managerModel.aggregate([
        {
          $project: {
            managerName: 1,
            department: 1,
            salary: 1,
            incrementedSalary: {
              $multiply: ["$salary", incrementPercentage],
            },
          },
        },
      ]);
  
      res.json(result);
    } catch (error) {
      res.json({ message: error.message });
    }
  };
  