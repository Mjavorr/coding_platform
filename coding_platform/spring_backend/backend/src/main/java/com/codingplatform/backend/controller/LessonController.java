package com.codingplatform.backend.controller;

import com.codingplatform.backend.model.*;
import com.codingplatform.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class LessonController {

    @Autowired private LessonRepository lessonRepository;
    @Autowired private LessonExerciseRepository lessonExerciseRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private UserProgressRepository userProgressRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LessonStudentRepository lessonStudentRepository;

    // GET /api/lessons/teacher/{teacherId}
    @GetMapping("/teacher/{teacherId}")
    public List<Map<String, Object>> getLessonsByTeacher(@PathVariable Long teacherId) {
        List<Lesson> lessons = lessonRepository.findByTeacherId(teacherId);
        List<Map<String, Object>> result = new ArrayList<>();

        String[] days = {"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};

        for (Lesson lesson : lessons) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", lesson.getId());
            map.put("dayOfWeek", days[lesson.getDayOfWeek()]);
            map.put("startTime", lesson.getStartTime());
            map.put("semester", lesson.getSemester());
            map.put("year", lesson.getYear());
            subjectRepository.findById(lesson.getSubjectId()).ifPresent(s -> {
                map.put("subjectName", s.getName());
                map.put("subjectCode", s.getCode());
            });
            result.add(map);
        }
        return result;
    }

    // GET /api/lessons/exercise/{exerciseId} — ktoré hodiny už majú túto úlohu
    @GetMapping("/exercise/{exerciseId}")
    public List<Long> getLessonIdsByExercise(@PathVariable Long exerciseId) {
        return lessonExerciseRepository.findByIdExerciseId(exerciseId)
                .stream()
                .map(le -> le.getId().getLessonId())
                .toList();
    }

    // GET /api/lessons/{lessonId}/progress/{exerciseId}
    @GetMapping("/{lessonId}/progress/{exerciseId}")
    public List<Map<String, Object>> getStudentProgress(
            @PathVariable Long lessonId,
            @PathVariable Long exerciseId) {

        List<LessonStudent> lessonStudents = lessonStudentRepository.findByIdLessonId(lessonId);

        return lessonStudents.stream().map(ls -> {
            Map<String, Object> result = new HashMap<>();

            userRepository.findById(ls.getId().getUserId()).ifPresent(user -> {
                result.put("userId", user.getId());
                result.put("username", user.getUsername());
            });

            Optional<UserProgress> progress = userProgressRepository
                    .findByUserIdAndExerciseId(ls.getId().getUserId(), exerciseId);

            if (progress.isPresent()) {
                result.put("bestScore", progress.get().getBestScore());
                result.put("attempts", progress.get().getAttempts());
                result.put("completedAt", progress.get().getCompletedAt());
            } else {
                result.put("bestScore", 0);
                result.put("attempts", 0);
                result.put("completedAt", null);
            }

            return result;
        }).collect(java.util.stream.Collectors.toList());
    }

    // POST /api/lessons/exercise — priradenie úlohy k hodine
    @PostMapping("/exercise")
    public Map<String, Object> assignExercise(@RequestBody Map<String, Object> request) {
        Long lessonId = Long.valueOf(request.get("lessonId").toString());
        Long exerciseId = Long.valueOf(request.get("exerciseId").toString());
        LocalDateTime dueDate = request.get("dueDate") != null
                ? LocalDateTime.parse(request.get("dueDate").toString())
                : null;

        LessonExercise le = new LessonExercise();
        le.setId(new LessonExerciseId(lessonId, exerciseId));
        le.setDueDate(dueDate);
        lessonExerciseRepository.save(le);

        return Map.of("success", true);
    }

    // DELETE /api/lessons/{lessonId}/exercise/{exerciseId}
    @DeleteMapping("/{lessonId}/exercise/{exerciseId}")
    @Transactional
    public Map<String, Object> removeExercise(@PathVariable Long lessonId, @PathVariable Long exerciseId) {
        lessonExerciseRepository.deleteByIdLessonIdAndIdExerciseId(lessonId, exerciseId);
        return Map.of("success", true);
    }
}