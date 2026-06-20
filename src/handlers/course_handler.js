import prisma from "../db/prisma.js";
import {
  ValidateAllFieldTypes,
  ValidateEmptyField,
} from "../validators/field_validators.js";
import { deleteStudent } from "./student_handler.js";

const FindAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json({
      message: "All courses fetched successfully",
      data: courses,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const findCourseById = async (req, res) => {
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
    const course = await prisma.course.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!course) {
      return res.status(400).json({ message: "course not found" });
    }
    res.status(200).json({
      message: "course found successfully",
      data: course,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const createCourse = async (req, res) => {
  try {
    const { name, credit, teacherId } = req.body;
    const course = await prisma.course.create({
      data: {
        name,
        credit,
        teacher: {
          connect: {
            id: Number(teacherId),
          },
        },
      },
    });
    res.status(201).json({
      message: "course created successfully",
      data: course,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const updateCourse = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    let updateCourse = await prisma.course.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
    res.status(201).json({
      message: "course update successfully",
      data: updateCourse,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const deleteCourse = async (req, res) => {
  try {
    let id = req.params.id;
    let deleteCourse = await prisma.course.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(201).json({
      message: `course with id ${id} deleted successfully`,
      data: deleteStudent,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
export {
  findCourseById,
  FindAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
