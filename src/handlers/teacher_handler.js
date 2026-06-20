import prisma from "../db/prisma.js";
import {
  ValidateAllFieldTypes,
  ValidateEmptyField,
} from "../validators/field_validators.js";

const FindAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        courses: true,
      },
    });
    res.status(200).json({
      message: "All teachers fetched successfully",
      data: teachers,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

//using prisma relation select
export const getAllTeachersWithSelect = async (req, res) => {
  const teachers = await prisma.teacher.findMany({
    select: {
      name: true,
      id: true,
      CreatedAt: true,
      department: {
        select: {
          //name:true,
          id: true,
        },
      },
      courses: true,
    },
  });
  res.status(200).json({
    message: "All teachers fetched successfully",
    data: teachers,
  });
};

//sorting with orderBy
let sortTeachers = async (req, res) => {
  let teachers = await prisma.teacher.findMany({
    orderBy: {
      name: "desc",
    },
  });
  res.status(200).json({
    message: "sorted teachers",
    data: teachers,
  });
};

//filtering
const filterTeachers = async (req, res) => {
  let teachers = await prisma.teacher.findMany({
    where: {
      name: {
        gte: "a",
      },
    },
  });
  res.status(200).json({
    message: "sorted teachers",
    data: teachers,
  });
};

const findTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "") {
      res.status(400).json({
        error: "id cannot be empty",
      });
      return;
    }
    if (isNaN(id)) {
      res.status(400).json({
        error: "id must be a number",
      });
      return;
    }
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        department: true,
        courses: true,
      },
    });
    if (!teacher) {
      return res.status(404).json({
        error: "Teacher not found",
      });
      res.status(200).json({
        message: `Teacher with ID ${id} fetched successfully`,
        data: teacher,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

const createTeacher = async (req, res) => {
  try {
    const { name, email, departmentId } = req.body;
    const createTeacher = await prisma.teacher.create({
      data: {
        name,
        email,
        department: {
          connect: { id: Number(departmentId) },
        },
      },
    });
    res.status(201).json({
      message: "Teacher created successfully",
      data: createTeacher,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
//using create prisma relation
export const createTeacherWithDepartment = async (req, res) => {
    const {name, email, departmentName}= req.body
  const newTeacher = await prisma.teacher.create({
    data: {
      name,
      email,
      department: {
        create: {
          name: departmentName,
        },
      },
    },
  });
  res.status(201).json({
    message: "Teacher created successfully",
    data: newTeacher,
  });
};

const updateTeacher = async (req, res) => {
  try {
    let id = req.params.id;
    let { name, email } = req.body;
    let updateTeacher = await prisma.teacher.update({
      where: {
        id: Number(id),
      },
      data: { name, email },
    });
    res.status(201).json({
      message: "teacher update successfully",
      data: updateTeacher,
    });
  } catch (e) {
    res.status(500).json({
      error: "Something went wrong",
      stack: e?.message,
    });
  }
};
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    let deleteTeacher = await prisma.teacher.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(201).json({
      message: "Teacher deleted successfully",
      data: deleteTeacher,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
export {
  FindAllTeachers,
  findTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
