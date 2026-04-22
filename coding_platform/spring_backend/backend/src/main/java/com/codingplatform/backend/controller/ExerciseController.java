package com.codingplatform.backend.controller;

import com.codingplatform.backend.model.Exercise;
import com.codingplatform.backend.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "http://localhost:3000")
public class ExerciseController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping("/{id}")
    public Exercise getExerciseById(@PathVariable Long id) {
        return exerciseRepository.findById(id).orElse(null);
    }

    @GetMapping
    public List<Exercise> getAllExercises(@RequestParam(required = false) Long subjectId) {
        if (subjectId != null) {
            return exerciseRepository.findByIsPublishedTrueAndSubjectId(subjectId);
        }
        return exerciseRepository.findByIsPublishedTrue();
    }
}