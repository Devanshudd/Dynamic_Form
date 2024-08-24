import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import FormField from "./FormField";

const initialFields = [
  { id: 1, type: "text", label: "Name", value: "" },
  { id: 2, type: "textarea", label: "Address", value: "" },
];

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Button" },
];

const validateForm = (fields, formValues) => {
  const errors = {};
  let isValid = true;

  fields.forEach((field) => {
    const value = formValues[field.id] || "";
    if (field.type === "text" && value.trim().length === 0) {
      errors[field.id] = "This field is required.";
      isValid = false;
    } else if (field.type === "textarea" && value.trim().length < 1) {
      errors[field.id] = "Minimum 1 character required.";
      isValid = false;
    }
  });

  return { isValid, errors };
};

const FormBuilder = () => {
  const [fields, setFields] = useState(initialFields);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [jsonInput, setJsonInput] = useState(""); // For loading JSON

  const handleAddFieldClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFieldTypeSelect = (type) => {
    setFields([
      ...fields,
      { id: Date.now(), type, label: "", options: [], value: "" },
    ]);
    setAnchorEl(null);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChange = (id, fieldData) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, ...fieldData } : field
    );
    setFields(updatedFields);
  };

  const handleDelete = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    const { [id]: _, ...rest } = formValues;
    setFormValues(rest);
  };

  const handleFieldValueChange = (id, value) => {
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateForm(fields, formValues);
    if (!isValid) {
      setErrors(errors);
      setSuccessMessage(""); // Clear success message if there are errors
    } else {
      setErrors({});
      setSuccessMessage("Form submitted successfully!");
    }
  };

  // Save form configuration
  const handleSave = () => {
    const formData = {
      fields,
      formValues,
    };
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "form-config.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Load form configuration
  const handleLoad = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setFields(parsedData.fields || []);
      setFormValues(parsedData.formValues || {});
      setErrors({});
      setSuccessMessage("");
    } catch (error) {
      setErrors({ global: "Failed to load configuration." });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Dynamic Form Builder
      </Typography>
      {fields.map((field) => (
        <FormField
          key={field.id}
          field={{ ...field, value: formValues[field.id] || "" }}
          value={formValues[field.id] || ""}
          error={errors[field.id]} // Pass error message to FormField
          onChange={(data) => handleChange(field.id, data)}
          onFieldValueChange={(value) =>
            handleFieldValueChange(field.id, value)
          }
          onDelete={() => handleDelete(field.id)}
          isDeletable={fields.length > 1}
        />
      ))}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoad}
          sx={{ width: "200px", mb: 4 }} // Margin bottom
        >
          Load Configuration
        </Button>

        <TextField
          label="Load JSON Configuration"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="secondary" // Default color
          onClick={handleSave}
          sx={{ width: "200px", mb: 2 }} // Margin bottom
        >
          Save Configuration
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFieldClick}
          sx={{ width: "200px" }}
        >
          Add Field
        </Button>
        <Button
          variant="contained"
          color="success" // Green color
          onClick={handleSubmit}
          sx={{ width: "200px", mt: 2 }} // Margin bottom
        >
          Submit
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {fieldTypes.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleFieldTypeSelect(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      {successMessage && !Object.keys(errors).length && (
        <Typography variant="h6" align="center" sx={{ color: "green", mt: 4 }}>
          {successMessage}
        </Typography>
      )}
      {Object.keys(errors).length > 0 && !successMessage && (
        <Box sx={{ mt: 2 }}>
          {Object.values(errors).map((error, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: "red", mt: 1 }}
            >
              {error}
            </Typography>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default FormBuilder;
