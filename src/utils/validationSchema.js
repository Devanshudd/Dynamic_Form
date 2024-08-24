import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  fields: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required("Label is required"),
      type: Yup.string().required("Type is required"),
      options: Yup.array().when("type", {
        is: (type) => type === "checkbox" || type === "radio",
        then: Yup.array().of(Yup.string().required("Option is required")),
        otherwise: Yup.array().of(Yup.string()), // For other types, options are optional
      }),
      value: Yup.string().when("type", {
        is: (type) => type === "text" || type === "textarea",
        then: Yup.string().required("Field cannot be empty"),
        otherwise: Yup.string(), // For other types, value is optional
      }),
    })
  ),
  selectedOptions: Yup.array().when("fields", {
    is: (fields) =>
      fields.some(
        (field) => field.type === "checkbox" || field.type === "radio"
      ),
    then: Yup.array().min(
      1,
      "At least one checkbox or radio button must be selected"
    ),
    otherwise: Yup.array(), // For other field types, no validation is required
  }),
});
