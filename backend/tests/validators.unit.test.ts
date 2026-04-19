import { describe } from "vitest";
import { registerScholarshipValidationTests } from "./validation/scholarship.validation.scenario.js";
import { registerStudentCreateValidationTests } from "./validation/student-create.validation.scenario.js";
import { registerStudentUpdateValidationTests } from "./validation/student-update.validation.scenario.js";

describe("student validation", () => {
  registerStudentCreateValidationTests();
  registerStudentUpdateValidationTests();
});

describe("scholarship validation", () => {
  registerScholarshipValidationTests();
});
