import React, { useState } from "react";
import {
  TextField,
  Box,
  IconButton,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const FormField = ({ field, onChange, onDelete, isDeletable }) => {
  const [newOption, setNewOption] = useState("");
  const [editingLabel, setEditingLabel] = useState(false);
  const [label, setLabel] = useState(field.label || "Label");
  const [selectedValue, setSelectedValue] = useState(""); // For radio button selection

  const handleAddOption = () => {
    if (field.type === "checkbox" || field.type === "radio") {
      onChange({
        options: [
          ...(field.options || []),
          `Option ${field.options ? field.options.length + 1 : 1}`,
        ],
      });
    } else if (newOption.trim()) {
      const updatedOptions = field.options
        ? [...field.options, newOption]
        : [newOption];
      onChange({ options: updatedOptions });
      setNewOption("");
    }
  };

  const handleLabelClick = () => {
    setEditingLabel(true);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    setEditingLabel(false);
    onChange({ label });
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    onChange({ selectedValue: event.target.value });
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            variant="outlined"
            placeholder="Text Input"
            fullWidth
            sx={{ mt: 2 }}
          />
        );
      case "textarea":
        return (
          <TextField
            variant="outlined"
            multiline
            rows={4}
            placeholder="Text Area"
            fullWidth
            sx={{ mt: 2 }} // Increase width slightly
          />
        );
      case "select":
        return (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Select
              variant="outlined"
              fullWidth
              displayEmpty
              placeholder="Options"
              renderValue={(selected) => selected || "Options"}
            >
              {field.options &&
                field.options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              placeholder="Add Option"
              variant="outlined"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              sx={{ ml: 2 }}
            />
            <IconButton
              onClick={handleAddOption}
              sx={{
                ml: 2,
                backgroundColor: "skyblue",
                color: "white",
                "&:hover": {
                  backgroundColor: "dodgerblue",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        );
      case "checkbox":
        return (
          <Box sx={{ mt: 2 }}>
            {field.options &&
              field.options.map((option, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Checkbox />
                  <TextField
                    value={option}
                    onChange={(e) =>
                      onChange({
                        options: field.options.map((opt, i) =>
                          i === index ? e.target.value : opt
                        ),
                      })
                    }
                    sx={{ flex: 1, marginRight: 1 }}
                  />
                  <IconButton
                    aria-label="delete"
                    onClick={() =>
                      onChange({
                        options: field.options.filter((_, i) => i !== index),
                      })
                    }
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <IconButton
                onClick={handleAddOption}
                sx={{
                  backgroundColor: "skyblue",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "dodgerblue",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        );
      case "radio":
        return (
          <Box sx={{ mt: 2 }}>
            <RadioGroup value={selectedValue} onChange={handleRadioChange}>
              {field.options &&
                field.options.map((option, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Radio value={option} />
                    <TextField
                      value={option}
                      onChange={(e) =>
                        onChange({
                          options: field.options.map((opt, i) =>
                            i === index ? e.target.value : opt
                          ),
                        })
                      }
                      sx={{ flex: 1, marginLeft: 1 }}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        onChange({
                          options: field.options.filter((_, i) => i !== index),
                        })
                      }
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
            </RadioGroup>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TextField
                placeholder="Add Option"
                variant="outlined"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                sx={{ flex: 1, marginRight: 1 }}
              />
              <IconButton
                onClick={handleAddOption}
                sx={{
                  backgroundColor: "skyblue",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "dodgerblue",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
      {editingLabel ? (
        <TextField
          value={label}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          autoFocus
          fullWidth
        />
      ) : (
        <Typography
          variant="body1"
          sx={{ flexGrow: 1 }}
          onClick={handleLabelClick}
        >
          {label}
        </Typography>
      )}
      {renderField()}
      {isDeletable && (
        <IconButton aria-label="delete" onClick={onDelete} sx={{ ml: 2 }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default FormField;
