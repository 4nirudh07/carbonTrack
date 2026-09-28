package com.carbontrack.carbontrack.controller;

import com.carbontrack.carbontrack.service.LeaderboardEntry;
import com.carbontrack.carbontrack.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(
            LeaderboardService leaderboardService) {

        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard(
            @RequestParam String month) {

        YearMonth yearMonth = YearMonth.parse(month);

        return leaderboardService.getLeaderboard(yearMonth);
    }
}