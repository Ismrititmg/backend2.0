import prisma from "../db/prisma.js";
import {
  ValidateAllFieldTypes,
  ValidateEmptyField,
} from "../validators/field_validators.js";

const FindAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany();
    res.status(200).json({
      message: "All enrollments fetched successfully",
      data: enrollments,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

const findEnrollmentById = async (req, res) => {
  try {
    let id = req.params.id;
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
    let matchEnrollment = await prisma.enrollment.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      message: "enrollment found successfully",
      data: matchEnrollment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

const createEnrollment = async (req, res) => {
  try {
    console.log(req.body);
    const { studentId, courseId } = req.body;

const enrollment = await prisma.enrollment.create({
  data: {
    studentId: Number(studentId),
    courseId: Number(courseId),
  },
});
    res.status(201).json({
      message: "enrollment created successfully",
      data: createEnrollment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    let updateEnrollment = await prisma.enrollment.update({
      where: {
        id: Number(id),
      },
      data: {
        studentId: Number(data.studentId),
        courseId: Number(data.courseId),
      },
    });
    console.log(updateEnrollment);
    res.status(201).json({
      message: "enrollment update successfully",
      data: updateEnrollment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
const deleteEnrollment = async (req, res) => {
  try {
    let id = req.params.id;
    let deleteEnrollment = await prisma.enrollment.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(201).json({
      message: `Enrollment with id ${id} deleted successfully.`,
      data: deleteEnrollment,
    });
  } catch (e) {
    res.status(500).json({
      error: "something went wrong",
      stack: e?.message,
    });
  }
};
let EnrollmentStudentInCourse = async (req, res) => {
  try {
    let { student_id, course_id, enrolled_at } = req.body;
    //require both ids
    if (!student_id || !course_id) {
      return res.status(400).json({
        message: "student id & course id is required",
      });
    }
    if (student_id && (isNaN(student_id) || Number(student_id) <= 0)) {
      return res.status(400).json({
        message: "student id is not valid",
      });
    }
    //validation enrolled if provided
    if (enrolled_at && isNaN(Date.parse(enrolled_at))) {
      return res.status(400).json({
        message: "enrolled_at must be a valid date",
      });
    }
    let enrollmentCreated = await prisma.enrollment.create({
      data: {
        studentId: student_id,
        courseId: course_id,
      },
      select: {
        id: true,
        CreatedAt: true,
        status: true,
        course: true,
      },
    });
    res.status(201).json({
      message: "student enrolled to course successfully",
      data: enrollmentCreated,
    });
  } catch (e) {
    res.status(500).json({
      error: "Error occurred while enrolling student in course",
      stack: e?.message,
    });
  }
};
export {
  FindAllEnrollments,
  findEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  EnrollmentStudentInCourse,
};
