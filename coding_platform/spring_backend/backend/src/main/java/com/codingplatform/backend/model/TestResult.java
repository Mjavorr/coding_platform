package com.codingplatform.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "test_results")
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "submission_id")
    private Long submissionId;
    @Column(name = "test_case_id")
    private Long testCaseId;
    private String status;
    @Column(name = "actual_output")
    private String actualOutput;
    @Column(name = "execution_time")
    private Integer executionTime;
    @Column(name = "error_message")
    private String errorMessage;
    @Column(name = "points_earned")
    private Integer pointsEarned;

    public Long getId() { return id; }
    public Long getSubmissionId() { return submissionId; }
    public Long getTestCaseId() { return testCaseId; }
    public String getStatus() { return status; }
    public String getActualOutput() { return actualOutput; }
    public Integer getExecutionTime() { return executionTime; }
    public String getErrorMessage() { return errorMessage; }
    public Integer getPointsEarned() { return pointsEarned; }

    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public void setTestCaseId(Long testCaseId) { this.testCaseId = testCaseId; }
    public void setStatus(String status) { this.status = status; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }
    public void setExecutionTime(Integer executionTime) { this.executionTime = executionTime; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }
}