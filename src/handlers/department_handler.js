import prisma from "../db/prisma.js";
import {
  ValidateAllFieldTypes,
  ValidateEmptyField,
} from "../validators/field_validators.js";

const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        teachers: true,
        students: true,
      },
    });
    res.json({
      message: "All departments found",
      data: departments,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const findDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        teachers: true,
        students: true,
      },
    });
    if (!department) {
      return res.status(404).json({
        error: "Department not found",
      });
    }
    res.status(200).json({
      message: `Department with ID ${id} fetched successfully`,
      data: department,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const createDepartment = async (req, res) => {
  try {
    const {name} = req.body;
    const newDepartment = await prisma.department.create({
      data: {
        name,
      },
    });
    res.status(201).json({
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const {id} = req.params
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Request body is required",
      });
    }
    const updatedDepartment = await prisma.department.update({
      where: {
        id: Number(id),
      },
      data:data
    });
    res.status(200).json({
      message: `Department with ID ${id} updates successfully`,
      data: updatedDepartment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    let id = req.params.id;
    let deletedDepartment = await prisma.department.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({
      message: `Department with ID ${id} deleted successfully`,
      data: deletedDepartment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
export {
  findDepartmentById,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
