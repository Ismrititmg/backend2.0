import prisma from "../db/prisma.js";
import z from "zod"

import {
  ValidateAllFieldTypes,
  ValidateEmptyField,
} from "../validators/field_validators.js";
import { createStudentValidatorSchema, nameValidatorSchema, updateStudentValidatorSchema } from "../validators/validator.js";

const FindAllStudents = async (req, res) => {

  try {
    //select is used to specify which fields to retrieve from database, which include is used to specify related models to include in the result.
    //Please either use 'include' or 'select', nut not both at the same time.
    const students = await prisma.students.findMany({
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
        department: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.json({
      message: "Students retrieved successfully",
      data: students,
    });
  } catch (error) {
  console.log("WE ARE HERE");
  console.log(error);
  res.status(500).json({
    error: error.message
  });
}
};
const getAllStudentsWithSelect = async (req, res) => {
  try {
    let students = await prisma.student.findMany({
      select: {
        name: true,
        email: true,
        id: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        enrollment: true,
      },
    });
    res.status(200).json({
      message: "all students fetched successfully",
      data: students,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
//example for orderBy or sorting
export let sortStudents = async (req, res) => {
  try {
    let students = await prisma.student.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json({
      message: "students sorted data",
      data: students,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
//multi level include example
const findStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    //empty validation bad request status
    if (id === "") {
      return res.status(400).json({
        error: "id cannot be empty",
      });
      return;
    }
    //check if id is num ber or not and must return status related to it
    if (isNaN(id)) {
      res.status(400).json({
        error: "id must be a number",
      });
      return;
    }
    let matchStudent = await prisma.students.findUnique({
      where: { id: Number(id) },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
        department: true,
      },
    });
    if (!matchStudent) {
      return res.status(404).json({
        error: "student not found",
      });
    } res.status(200).json({
        message: `student with ID $(id) retrieved successfully`,
        data: matchStudent,
      });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

//Prisma create example
const createStudent = async (req, res) => {
    console.log("Create student called");
 // try {
    
    //parsing body data using zod validator schema
    let result = createStudentValidatorSchema.safeParse(req.body)
    console.log("result :", result)

    if(!result.success){
      let errors = result.error.issues.map((ele)=>{
        return{
          field: ele.path[0],
          message: ele.message
        }
      })
      res.status(400).json({
        message: "something went wrong",
        error: errors
      })
    }

    const { name, email, rollNo, departmentId } = req.body;
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        error: "request body required",
      });
      return;
    }
    console.log("Before validation");
    console.log(ValidateAllFieldTypes);
    let validationMsg = ValidateAllFieldTypes("email", email);
    console.log("Validation result:", validationMsg);
    if (validationMsg != null) {
      return res.status(400).json({
        error: validationMsg,
      });
      return;
    }
    console.log("Before prisma create");
    let createdStudent = await prisma.students.create({
      data: {
        name,
        email,
        rollNo,
        department: {
          connect: { id: departmentId },
        },
      },
    });
      console.log("Created:", createdStudent);
    res.status(201).json({
      message: "student created successfully",
      data: createdStudent,
    });
  // } catch (e) {
  //     console.log("ERROR:", e);
  //   res.status(500).json({
  //     error: "something went wrong",
  //     stack: e?.message,
  //   });
 // }
};
//prisma create example

const createStudentWithDepartment = async (req, res) => {
  try {
    const { name, email, rollNo, departmentName } = req.body;
    //create student with department together
    let createdStudentWithDepartment = await prisma.students.create({
      data: {
        name,
        email,
        rollNo,
        department: {
          create: {
            name: 
              departmentName,
          },
        },
      },
    });
    res.status(201).json({
        message: "student created successfully",
        data: createdStudentWithDepartment
    })
  } catch (e) {
    res.status(500).json({
        error:"cannot update student",
        stack: e?.message
    })
  }
};

const updateStudent = async(req,res)=>{
    try{
        const {id}=req.params

        updateStudentValidatorSchema.parse(req.body)

        const{name,email,rollNo,departmentId}=req.body
    let updatedStudent =  await prisma.students.update({
        where:{
            id: Number(id)
        },
        data: {
            name, email, rollNo,
            department:{
                connect: {id: departmentId}
            }
        }
    })
    res.status(200).json({
        message:"Student updated successfully",
        data: updateStudent
    })
    }catch(e){
      if(e instanceof z.ZodError){
        let error= e.issues.map((ele)=>{
          return{
            field: ele.path[0],
            message: ele.message,
          }
        })
        res.status(500).json({
          message: "validation error",
          error: error
        })
      }
        // res.status(500).json({
        //     error:"cannot update student",
        //     stack: e?.message
        // })
    }
}

const deleteStudent = async(req,res)=>{
    try{
        const{id}=req.params
        let deletedStudent= await prisma.students.delete({
            where:{
                id: Number(id)
            }
        })
        res.status(200).json({
            message: `Student with id ${id} deleted successfully`,
            data: deletedStudent
        })
    }catch(e){
        res.status(500).json({
            error:"something went wrong",
            stack: e?.message
        })
    }
}

export{FindAllStudents, findStudentById, createStudent, updateStudent, deleteStudent, createStudentWithDepartment, getAllStudentsWithSelect}