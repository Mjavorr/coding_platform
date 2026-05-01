package com.codingplatform.backend.controller;

import com.codingplatform.backend.model.Exercise;
import com.codingplatform.backend.model.LessonExerciseId;
import com.codingplatform.backend.repository.ExerciseRepository;
import com.codingplatform.backend.repository.LessonExerciseRepository;
import com.codingplatform.backend.repository.LessonStudentRepository;
import com.codingplatform.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class ExerciseController {

    @Autowired
    private ExerciseRepository exerciseRepository;
    @Autowired
    private LessonExerciseRepository lessonExerciseRepository;
    @Autowired
    private LessonStudentRepository lessonStudentRepository;
    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/{id}")
    public Exercise getExerciseById(@PathVariable Long id) {
        return exerciseRepository.findById(id).orElse(null);
    }

    @GetMapping
    public List<Map<String, Object>> getAllExercises(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long userId) {

        List<Exercise> exercises = subjectId != null
                ? exerciseRepository.findByIsPublishedTrueAndSubjectId(subjectId)
                : exerciseRepository.findByIsPublishedTrue();

        return exercises.stream().map(exercise -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id",          exercise.getId());
            map.put("title",       exercise.getTitle());
            map.put("subjectId",   exercise.getSubjectId());
            map.put("totalPoints", exercise.getTotalPoints());
            subjectRepository.findById(exercise.getSubjectId()).ifPresent(s -> {
                map.put("subjectName", s.getName());
            });

            // Nájdi dueDate pre tohto študenta
            if (userId != null) {
                // Nájdi hodiny v ktorých je študent zapísaný
                List<Long> studentLessonIds = lessonStudentRepository
                        .findByUserId(userId)
                        .stream()
                        .map(ls -> ls.getId().getLessonId())
                        .toList();

                // Nájdi dueDate pre túto úlohu v týchto hodinách
                studentLessonIds.stream()
                        .map(lessonId -> lessonExerciseRepository
                                .findById(new LessonExerciseId(lessonId, exercise.getId()))
                                .orElse(null))
                        .filter(le -> le != null && le.getDueDate() != null)
                        .findFirst()
                        .ifPresent(le -> map.put("dueDate", le.getDueDate()));
            }

            return map;
        }).collect(java.util.stream.Collectors.toList());
    }
}