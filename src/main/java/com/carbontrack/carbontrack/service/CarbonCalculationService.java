package com.carbontrack.carbontrack.service;

import com.carbontrack.carbontrack.entity.ActivityLog;
import com.carbontrack.carbontrack.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class CarbonCalculationService {

    private final ActivityLogRepository activityLogRepository;

    public CarbonCalculationService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public double calculateActivityEmission(ActivityLog activityLog) {

        double commuteFactor = getCommuteFactor(activityLog.getCommuteMode());

        double commuteEmission =
                activityLog.getCommuteDistanceKm() * commuteFactor;

        double electricityEmission =
                activityLog.getElectricityUnits() * EmissionFactor.ELECTRICITY;

        double wasteEmission =
                activityLog.getWasteGenerated() * EmissionFactor.WASTE;

        return commuteEmission + electricityEmission + wasteEmission;
    }

    public double calculateMonthlyFootprint(Long householdId, YearMonth month) {

        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

        List<ActivityLog> activities = activityLogRepository.findAll();

        double total = 0;

        for (ActivityLog activity : activities) {

            if (activity.getHousehold().getId().equals(householdId)
                    && !activity.getActivityDate().isBefore(startDate)
                    && !activity.getActivityDate().isAfter(endDate)) {

                total += calculateActivityEmission(activity);
            }
        }

        return total;
    }

    private double getCommuteFactor(String commuteMode) {

        return switch (commuteMode.toUpperCase()) {
            case "CAR" -> EmissionFactor.CAR;
            case "BUS" -> EmissionFactor.BUS;
            case "TRAIN" -> EmissionFactor.TRAIN;
            case "BIKE" -> EmissionFactor.BIKE;
            case "WALK" -> EmissionFactor.WALK;
            default -> throw new IllegalArgumentException(
                    "Invalid commute mode: " + commuteMode
            );
        };
    }
}