package com.carbontrack.carbontrack.controller;

import com.carbontrack.carbontrack.service.CarbonCalculationService;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/carbon")
public class CarbonCalculationController {

    private final CarbonCalculationService carbonCalculationService;

    public CarbonCalculationController(
            CarbonCalculationService carbonCalculationService) {
        this.carbonCalculationService = carbonCalculationService;
    }

    @GetMapping("/monthly/{householdId}")
    public double getMonthlyFootprint(
            @PathVariable Long householdId,
            @RequestParam String month) {

        YearMonth yearMonth = YearMonth.parse(month);

        return carbonCalculationService.calculateMonthlyFootprint(
                householdId,
                yearMonth
        );
    }
}