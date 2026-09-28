package com.carbontrack.carbontrack.service;

public class LeaderboardEntry {

    private Long householdId;
    private String householdName;
    private double reductionPercentage;
    private int rank;

    public LeaderboardEntry(
            Long householdId,
            String householdName,
            double reductionPercentage,
            int rank) {

        this.householdId = householdId;
        this.householdName = householdName;
        this.reductionPercentage = reductionPercentage;
        this.rank = rank;
    }

    public Long getHouseholdId() {
        return householdId;
    }

    public String getHouseholdName() {
        return householdName;
    }

    public double getReductionPercentage() {
        return reductionPercentage;
    }

    public int getRank() {
        return rank;
    }
}