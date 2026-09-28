package com.carbontrack.carbontrack.controller;

import com.carbontrack.carbontrack.entity.Household;
import com.carbontrack.carbontrack.repository.HouseholdRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/households")
public class HouseholdController {

    private final HouseholdRepository householdRepository;

    public HouseholdController(HouseholdRepository householdRepository) {
        this.householdRepository = householdRepository;
    }

    @PostMapping
    public Household createHousehold(@RequestBody Household household) {
        return householdRepository.save(household);
    }

    @GetMapping
    public List<Household> getAllHouseholds() {
        return householdRepository.findAll();
    }

    @GetMapping("/{id}")
    public Household getHousehold(@PathVariable Long id) {
        return householdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Household not found"));
    }
}