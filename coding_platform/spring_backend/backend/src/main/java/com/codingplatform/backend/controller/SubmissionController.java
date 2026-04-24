package com.codingplatform.backend.controller;

import com.codingplatform.backend.model.*;
import com.codingplatform.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private TestResultRepository testResultRepository;
    @Autowired
    private ExerciseRepository exerciseRepository;
    @Autowired
    private TestCaseRepository testCaseRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;

    // POST /api/submissions - submit code and run against all test cases
    @PostMapping
    public Map<String, Object> submitCode(@RequestBody Map<String, Object> request) throws Exception {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long exerciseId = Long.valueOf(request.get("exerciseId").toString());
        String code = request.get("code").toString();

        // Get test cases for this exercise
        List<TestCase> testCases = testCaseRepository.findByExerciseId(exerciseId);

        // Create temp directory and write code
        String containerId = "solution_" + System.currentTimeMillis();
        Path tempDir = Files.createTempDirectory(containerId);
        Path codeFile = tempDir.resolve("solution.c");
        Files.writeString(codeFile, code);

        // Copy Dockerfile into temp dir
        Path dockerfileSrc = Path.of("docker/Dockerfile.c");
        Path dockerfileDst = tempDir.resolve("Dockerfile.c");
        Files.copy(dockerfileSrc, dockerfileDst);

        // Build Docker image
        ProcessBuilder buildProcess = new ProcessBuilder(
                "docker", "build", "-t", containerId, "-f",
                dockerfileDst.toString(), tempDir.toString()
        );
        buildProcess.redirectErrorStream(true);
        Process build = buildProcess.start();
        String buildOutput = new String(build.getInputStream().readAllBytes());
        int buildExit = build.waitFor();

        // Save submission
        Submission submission = new Submission();
        submission.setUserId(userId);
        submission.setExerciseId(exerciseId);
        submission.setCode(code);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(buildExit != 0 ? "error" : "pending");
        submissionRepository.save(submission);

        if (buildExit != 0) {
            submission.setStatus("error");
            submissionRepository.save(submission);
            return Map.of("success", false, "error", "Compilation failed: " + buildOutput);
        }

        // Run each test case
        List<Map<String, Object>> results = new ArrayList<>();
        int totalPoints = 0;

        for (TestCase testCase : testCases) {
            long startTime = System.currentTimeMillis();
            ProcessBuilder runProcess = new ProcessBuilder("docker", "run", "--rm",
                    "--network", "none", "--memory", "256m", "--cpus", "0.5",
                    "--pids-limit", "50", "-i", containerId
            );
            runProcess.redirectErrorStream(false);
            Process run = runProcess.start();

            // Send input
            run.getOutputStream().write(testCase.getInput().getBytes());
            run.getOutputStream().close();

            String actualOutput = new String(run.getInputStream().readAllBytes()).trim();
            String errorOutput = new String(run.getErrorStream().readAllBytes()).trim();
            boolean timedOut = !run.waitFor(10, java.util.concurrent.TimeUnit.SECONDS);
            if (timedOut) run.destroyForcibly();

            long executionTime = System.currentTimeMillis() - startTime;
            boolean passed = !timedOut && errorOutput.isEmpty() &&
                    actualOutput.equals(testCase.getExpectedOutput().trim());
            int pointsEarned = passed ? testCase.getPoints() : 0;
            totalPoints += pointsEarned;

            // Save test result
            TestResult testResult = new TestResult();
            testResult.setSubmissionId(submission.getId());
            testResult.setTestCaseId(testCase.getId());
            testResult.setStatus(timedOut ? "timeout" : (!errorOutput.isEmpty() ? "error" : (passed ? "passed" : "failed")));
            testResult.setActualOutput(actualOutput);
            testResult.setExecutionTime((int) executionTime);
            testResult.setErrorMessage(errorOutput.isEmpty() ? null : errorOutput);
            testResult.setPointsEarned(pointsEarned);
            testResultRepository.save(testResult);

            Map<String, Object> result = new HashMap<>();
            result.put("testCaseId", testCase.getId());
            result.put("status", testResult.getStatus());
            result.put("actualOutput", actualOutput);
            result.put("input", testCase.getInput());
            result.put("expectedOutput", testCase.getExpectedOutput());
            result.put("executionTime", executionTime);
            result.put("pointsEarned", pointsEarned);
            result.put("isHidden", testCase.getIsHidden());
            results.add(result);
        }

        // Update submission with final points
        submission.setStatus("completed");
        submissionRepository.save(submission);

        // Cleanup docker image
        new ProcessBuilder("docker", "rmi", containerId, "--force").start();
        deleteDirectory(tempDir.toFile());

        // Update user progress
        int maxPoints = testCases.stream().mapToInt(TestCase::getPoints).sum();

        Optional<UserProgress> existingProgress = userProgressRepository
                .findByUserIdAndExerciseId(userId, exerciseId);

        UserProgress progress = existingProgress.orElse(new UserProgress());
        if (!existingProgress.isPresent()) {
            progress.setUserId(userId);
            progress.setExerciseId(exerciseId);
            progress.setAttempts(0);
            progress.setBestScore(0);
        }

        progress.setAttempts(progress.getAttempts() + 1);
        progress.setLastAttemptedAt(java.time.LocalDateTime.now());
        if (progress.getBestScore() == null || totalPoints > progress.getBestScore()) {
            progress.setBestScore(totalPoints);
        }
        if (totalPoints >= maxPoints) {
            progress.setCompletedAt(java.time.LocalDateTime.now());
        }
        userProgressRepository.save(progress);

        return Map.of(
                "success", true,
                "submissionId", submission.getId(),
                "results", results,
                "summary", Map.of(
                        "totalPoints", totalPoints,
                        "maxPoints", maxPoints,
                        "percentage", maxPoints > 0 ? (totalPoints * 100 / maxPoints) : 0,
                        "passed", results.stream().filter(r -> r.get("status").equals("passed")).count(),
                        "failed", results.stream().filter(r -> !r.get("status").equals("passed")).count()
                )
        );
    }

    // GET /api/submissions/{id} - get submission results
    @GetMapping("/{id}")
    public Map<String, Object> getSubmission(@PathVariable Long id) {
        Submission submission = submissionRepository.findById(id).orElse(null);
        if (submission == null) return Map.of("error", "Submission not found");

        List<TestResult> testResults = testResultRepository.findBySubmissionId(id);

        List<Map<String, Object>> enrichedResults = testResults.stream().map(tr -> {
            TestCase testCase = testCaseRepository.findById(tr.getTestCaseId()).orElse(null);
            Map<String, Object> result = new HashMap<>();
            result.put("status", tr.getStatus());
            result.put("actualOutput", tr.getActualOutput());
            result.put("executionTime", tr.getExecutionTime());
            result.put("pointsEarned", tr.getPointsEarned());
            result.put("errorMessage", tr.getErrorMessage());
            result.put("input", testCase != null ? testCase.getInput() : null);
            result.put("expectedOutput", testCase != null ? testCase.getExpectedOutput() : null);
            result.put("isHidden", testCase != null ? testCase.getIsHidden() : false);
            return result;
        }).collect(java.util.stream.Collectors.toList());

        return Map.of("submission", submission, "testResults", enrichedResults);
    }

    // GET /api/submissions/user/{userId}/exercise/{exerciseId}
    @GetMapping("/user/{userId}/exercise/{exerciseId}")
    public List<Map<String, Object>> getSubmissionsByUserAndExercise(
            @PathVariable Long userId,
            @PathVariable Long exerciseId) {

        List<Submission> submissions = submissionRepository
                .findByUserIdAndExerciseIdOrderBySubmittedAtDesc(userId, exerciseId);

        return submissions.stream().map(s -> {
            List<TestResult> testResults = testResultRepository.findBySubmissionId(s.getId());
            int totalPoints = testResults.stream().mapToInt(tr -> tr.getPointsEarned() != null ? tr.getPointsEarned() : 0).sum();
            int maxPoints = testResults.stream().mapToInt(tr -> {
                var tc = testCaseRepository.findById(tr.getTestCaseId()).orElse(null);
                return tc != null ? tc.getPoints() : 0;
            }).sum();

            Map<String, Object> result = new java.util.HashMap<>();
            result.put("id", s.getId());
            result.put("submittedAt", s.getSubmittedAt());
            result.put("status", s.getStatus());
            result.put("totalPoints", totalPoints);
            result.put("maxPoints", maxPoints);
            return result;
        }).collect(java.util.stream.Collectors.toList());
    }

    private void deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            for (File file : dir.listFiles()) deleteDirectory(file);
        }
        dir.delete();
    }
}