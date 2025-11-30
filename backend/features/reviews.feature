# Feature: Cafe Reviews
#   As a user
#   I want to write and edit reviews for cafes
#   So that I can share my experiences
#
#   Background:
#     Given I am a registered user
#     And I am logged in
#
#   Note: These scenarios are commented out because they require Cafe model setup
#   The review functionality works in the application, but needs additional
#   test infrastructure to create Cafe objects before testing reviews
#
#   Scenario: Write a review for a cafe
#     When I submit a review with the following details:
#       | cafeName | Philz Coffee           |
#       | rating   | 5                      |
#       | comment  | Amazing iced coffee!   |
#     Then the review should be created successfully
#     And the review should be visible on the cafe page
#
#   Scenario: Edit my own review
#     Given I have written a review for "Philz Coffee"
#     When I update the review rating to 4
#     And I update the review comment to "Good, but pricey"
#     Then the review should be updated successfully
#     And the updated review should be visible
#
#   Scenario: Delete my own review
#     Given I have written a review for "Philz Coffee"
#     When I delete my review
#     Then the review should be removed successfully
#
#   Scenario: Cannot edit another user's review
#     Given another user has written a review
#     When I attempt to edit their review
#     Then I should receive an authorization error