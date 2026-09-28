package com.carbontrack.carbontrack.service;

import com.carbontrack.carbontrack.entity.Household;
import com.carbontrack.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.carbontrack.repository.HouseholdRepository;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class LeaderboardService {

    private final HouseholdRepository householdRepository;
    private final ActivityLogRepository activityLogRepository;
    private final CarbonCalculationService carbonCalculationService;

    public LeaderboardService(
            HouseholdRepository householdRepository,
            ActivityLogRepository activityLogRepository,
            CarbonCalculationService carbonCalculationService) {

        this.householdRepository = householdRepository;
        this.activityLogRepository = activityLogRepository;
        this.carbonCalculationService = carbonCalculationService;
    }

    public double calculateReductionPercentage(
            Long householdId,
            YearMonth month) {

        double currentFootprint =
                carbonCalculationService.calculateMonthlyFootprint(
                        householdId,
                        month
                );

        double previousFootprint =
                carbonCalculationService.calculateMonthlyFootprint(
                        householdId,
                        month.minusMonths(1)
                );

        if (previousFootprint <= 0) {
            return 0;
        }

        return ((previousFootprint - currentFootprint)
                / previousFootprint) * 100;
    }

    public List<LeaderboardEntry> getLeaderboard(YearMonth month) {

        List<Household> households =
                householdRepository.findAll();

        List<LeaderboardEntry> leaderboard =
                new ArrayList<>();

        for (Household household : households) {

            double reductionPercentage =
                    calculateReductionPercentage(
                            household.getId(),
                            month
                    );

            leaderboard.add(
                    new LeaderboardEntry(
                            household.getId(),
                            household.getHouseholdName(),
                            reductionPercentage,
                            0
                    )
            );
        }

        leaderboard.sort(
                Comparator.comparingDouble(
                        LeaderboardEntry::getReductionPercentage
                ).reversed()
        );

        List<LeaderboardEntry> rankedLeaderboard =
                new ArrayList<>();

        int rank = 1;

        for (LeaderboardEntry entry : leaderboard) {

            rankedLeaderboard.add(
                    new LeaderboardEntry(
                            entry.getHouseholdId(),
                            entry.getHouseholdName(),
                            entry.getReductionPercentage(),
                            rank
                    )
            );

            rank++;
        }

        return rankedLeaderboard;
    }
}