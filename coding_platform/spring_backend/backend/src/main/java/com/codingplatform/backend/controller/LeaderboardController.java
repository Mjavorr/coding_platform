package com.codingplatform.backend.controller;

import com.codingplatform.backend.repository.UserProgressRepository;
import com.codingplatform.backend.repository.UserRepository;
import com.codingplatform.backend.model.User;
import com.codingplatform.backend.model.UserProgress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class LeaderboardController {

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Map<String, Object>> getLeaderboard() {
        List<User> students = userRepository.findByRole("student");

        List<Map<String, Object>> leaderboard = new ArrayList<>(students.stream().map(user -> {
            List<UserProgress> progressList = userProgressRepository.findByUserId(user.getId());

            int totalPoints = progressList.stream()
                    .mapToInt(p -> p.getBestScore() != null ? p.getBestScore() : 0)
                    .sum();

            long exercisesCompleted = progressList.stream()
                    .filter(p -> p.getAttempts() > 0)
                    .count();

            Map<String, Object> entry = new HashMap<>();
            entry.put("userId", user.getId());
            entry.put("username", user.getUsername());
            entry.put("totalPoints", totalPoints);
            entry.put("exercisesCompleted", exercisesCompleted);
            return entry;
        }).toList());

        leaderboard.sort((a, b) ->
                Integer.compare((Integer) b.get("totalPoints"), (Integer) a.get("totalPoints"))
        );

        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).put("rank", i + 1);
        }

        return leaderboard;
    }
}