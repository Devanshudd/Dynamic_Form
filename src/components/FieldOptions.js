import React from "react";
import { TextField, Box, Button } from "@mui/material";

const FieldOptions = ({ field, onChange }) => {
  if (
    field.type !== "select" &&
    field.type !== "checkbox" &&
    field.type !== "radio"
  ) {
    return null;
  }

  const addOption = () => {
    const newOptions = [...(field.options || []), ""];
    onChange({ options: newOptions });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = field.options.map((option, i) =>
      i === index ? value : option
    );
    onChange({ options: newOptions });
  };

  return (
    <Box sx={{ mt: 2 }}>
      {field.options &&
        field.options.map((option, index) => (
          <TextField
            key={index}
            label={`Option ${index + 1}`}
            variant="outlined"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        ))}
      <Button variant="outlined" onClick={addOption}>
        Add Option
      </Button>
    </Box>
  );
};

export default FieldOptions;
