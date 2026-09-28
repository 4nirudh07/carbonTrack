package com.carbontrack.carbontrack.controller;

import com.carbontrack.carbontrack.entity.Participation;
import com.carbontrack.carbontrack.service.ParticipationService;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/participations")
public class ParticipationController {

    private final ParticipationService participationService;

    public ParticipationController(ParticipationService participationService) {
        this.participationService = participationService;
    }

    @GetMapping
    public List<Participation> getAllParticipations() {
        return participationService.getAllParticipations();
    }

    @PostMapping
    public Participation joinChallenge(
            @RequestParam Long householdId,
            @RequestParam Long challengeId,
            @RequestParam String month) {

        YearMonth currentMonth = YearMonth.parse(month);

        return participationService.joinChallenge(
                householdId,
                challengeId,
                currentMonth
        );
    }
}