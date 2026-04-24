package com.codingplatform.backend.controller;

import com.codingplatform.backend.model.UserProgress;
import com.codingplatform.backend.repository.UserProgressRepository;
import com.codingplatform.backend.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class UserProgressController {

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    // GET /api/progress/{userId} - get all progress for a user
    @GetMapping("/{userId}")
    public List<Map<String, Object>> getUserProgress(@PathVariable Long userId) {
        List<UserProgress> progressList = userProgressRepository.findByUserId(userId);

        return progressList.stream().map(progress -> {
            // Calculate max points for this exercise
            int maxPoints = testCaseRepository.findByExerciseId(progress.getExerciseId())
                    .stream().mapToInt(tc -> tc.getPoints()).sum();

            // Determine status
            String status;
            if (progress.getAttempts() == 0) {
                status = "uncompleted";
            } else if (progress.getBestScore() != null && progress.getBestScore() >= maxPoints) {
                status = "completed";
            } else {
                status = "started";
            }

            Map<String, Object> result = new HashMap<>();
            result.put("exerciseId", progress.getExerciseId());
            result.put("bestScore", progress.getBestScore());
            result.put("attempts", progress.getAttempts());
            result.put("status", status);
            result.put("maxPoints", maxPoints);
            result.put("lastAttemptedAt", progress.getLastAttemptedAt());
            result.put("completedAt", progress.getCompletedAt());
            return result;
        }).toList();
    }
}