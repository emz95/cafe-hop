Feature: Join Requests for Cafe Trips
  As a user
  I want to request to join cafe trips
  So that I can meet new people at cafes

  Background:
    Given I am a registered user
    And I am logged in
    And there is a cafe trip created by another user

  Scenario: Request to join a cafe trip
    When I send a join request for the cafe trip
    Then the request should be sent successfully
    And the request status should be "Pending"

  Scenario: Trip creator approves join request
    Given I have sent a join request
    And I am logged in as the trip creator
    When I approve the join request
    Then the request status should be "Approved"

  Scenario: Trip creator rejects join request
    Given I have sent a join request
    And I am logged in as the trip creator
    When I reject the join request
    Then the request should be removed

  Scenario: Cannot join my own trip
    Given I have created a cafe trip
    When I attempt to join my own trip
    Then I should receive an error