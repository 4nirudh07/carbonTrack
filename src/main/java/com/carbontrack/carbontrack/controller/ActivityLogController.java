package com.carbontrack.carbontrack.controller;

import com.carbontrack.carbontrack.entity.ActivityLog;
import com.carbontrack.carbontrack.entity.Household;
import com.carbontrack.carbontrack.repository.ActivityLogRepository;
import com.carbontrack.carbontrack.repository.HouseholdRepository;
import com.carbontrack.carbontrack.service.CarbonCalculationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/activity-logs")
public class ActivityLogController {

    private final ActivityLogRepository activityLogRepository;
    private final HouseholdRepository householdRepository;
    private final CarbonCalculationService carbonCalculationService;

    public ActivityLogController(
            ActivityLogRepository activityLogRepository,
            HouseholdRepository householdRepository,
            CarbonCalculationService carbonCalculationService) {

        this.activityLogRepository = activityLogRepository;
        this.householdRepository = householdRepository;
        this.carbonCalculationService = carbonCalculationService;
    }

    @PostMapping
    public ActivityLog createActivityLog(
            @RequestParam Long householdId,
            @Valid @RequestBody ActivityLog activityLog) {

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new RuntimeException("Household not found"));

        carbonCalculationService.calculateActivityEmission(activityLog);

        activityLog.setHousehold(household);

        return activityLogRepository.save(activityLog);
    }

    @GetMapping
    public List<ActivityLog> getAllActivityLogs() {
        return activityLogRepository.findAll();
    }
}