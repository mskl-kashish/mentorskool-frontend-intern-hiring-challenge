import { useState } from "react";
import { Button, TextField, MenuItem, Checkbox, FormControlLabel, Radio, RadioGroup, Typography, Paper } from "@mui/material";
import { supabase } from "./supabaseClient";

type Question = {
  id: number;
  type: string;
  text: string;
  options: string[];
};

export default function FormBuilder() {
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, type: "short_answer", text: "", options: [] }
  ]);
  const handleQuestionChange = (id: number, text: string) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, text } : q)));
  };

 
  const handleTypeChange = (id: number, type: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, type, options: type === "mcq" || type === "checkbox" ? [...q.options] : [] }
          : q
      )
    );
  };


  const handleOptionChange = (qId: number, index: number, value: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qId
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q
      )
    );
  };


  const addOption = (qId: number) => {
    setQuestions(prev =>
      prev.map(q => (q.id === qId ? { ...q, options: [...(q.options || []), ""] } : q))
    );
  };


  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), type: "short_answer", text: "", options: [] }]);
  };

  const handleSubmit = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      alert("User not authenticated! Please log in.");
      return;
    }

    try {
      const { error } = await supabase.from("forms").insert([
        {
          title: formTitle,
          questions: JSON.stringify(questions),
          user_id: user.id, 
        }
      ]);

      if (error) throw error;

      alert("Form saved successfully!");
      setFormTitle("Untitled Form");
      setQuestions([{ id: 1, type: "short_answer", text: "", options: [] }]);
    } catch (error: any) {
      console.error("Supabase Error:", error.message);
      alert(`Failed to save form! ${error.message}`);
    }
  };

  return (
    <Paper style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>Google Forms Clone</Typography>
      
      {}
      <TextField
        fullWidth
        variant="outlined"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        placeholder="Form Title"
        style={{ marginBottom: "20px" }}
      />
      
      {}
      {questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          {}
          <TextField
            fullWidth
            variant="outlined"
            value={q.text}
            onChange={(e) => handleQuestionChange(q.id, e.target.value)}
            placeholder={`Question ${index + 1}`}
          />
          
          {}
          <TextField
            select
            fullWidth
            variant="outlined"
            value={q.type}
            onChange={(e) => handleTypeChange(q.id, e.target.value)}
            style={{ marginTop: "10px" }}
          >
            <MenuItem value="short_answer">Short Answer</MenuItem>
            <MenuItem value="mcq">Multiple Choice</MenuItem>
            <MenuItem value="checkbox">Checkbox</MenuItem>
            <MenuItem value="file_upload">File Upload</MenuItem>
          </TextField>

          {}
          {q.type === "mcq" && q.options.map((opt, i) => (
            <RadioGroup key={i}>
              <FormControlLabel
                control={<Radio />}
                label={<TextField value={opt} onChange={(e) => handleOptionChange(q.id, i, e.target.value)} />}
              />
            </RadioGroup>
          ))}

          {}
          {q.type === "checkbox" && q.options.map((opt, i) => (
            <FormControlLabel
              key={i}
              control={<Checkbox />}
              label={<TextField value={opt} onChange={(e) => handleOptionChange(q.id, i, e.target.value)} />}
            />
          ))}

          {}
          {(q.type === "mcq" || q.type === "checkbox") && (
            <Button onClick={() => addOption(q.id)}>Add Option</Button>
          )}
          
          {}
          {q.type === "file_upload" && <p>Users will be able to upload files.</p>}
        </div>
      ))}

      {}
      <Button variant="contained" color="primary" onClick={addQuestion} style={{ marginRight: "10px" }}>
        Add Question
      </Button>
      <Button variant="contained" color="success" onClick={handleSubmit}>
        Submit Form
      </Button>
    </Paper>
  );
}
