package com.carbontrack.carbontrack.controller;

import com.carbontrack.carbontrack.entity.Challenge;
import com.carbontrack.carbontrack.service.ChallengeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @PostMapping
    public Challenge createChallenge(
            @Valid @RequestBody Challenge challenge) {

        return challengeService.createChallenge(challenge);
    }

    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeService.getAllChallenges();
    }

    @GetMapping("/{id}")
    public Challenge getChallenge(@PathVariable Long id) {
        return challengeService.getChallenge(id);
    }
}