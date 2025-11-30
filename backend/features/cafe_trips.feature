Feature: Cafe Trip Management
  As a user
  I want to create and manage cafe trips
  So that I can organize meetups with friends

  Background:
    Given I am a registered user
    And I am logged in

  Scenario: Create a new cafe trip
    When I create a cafe trip with the following details:
      | cafeName    | Blue Bottle Coffee        |
      | location    | San Francisco, CA         |
      | date        | 2024-12-25T14:00:00.000Z |
      | description | Let's try their new blend |
    Then the trip should be created successfully
    And the trip should appear in the trip list

  Scenario: View all cafe trips
    Given there are 3 existing cafe trips
    When I request the list of cafe trips
    Then I should see 3 trips
    And each trip should have a cafe name and location

  Scenario: Delete my own cafe trip
    Given I have created a cafe trip
    When I delete my cafe trip
    Then the trip should be removed successfully
    And the trip should not appear in the trip list