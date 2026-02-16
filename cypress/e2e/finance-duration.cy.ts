describe("Finance simulation defaults", () => {
  it("starts with 60 months and keeps user change after reload", () => {
    cy.visit("/financement");

    cy.contains("button", "Lancer la simulation").click();

    cy.contains("label", "Durée (mois)")
      .parent()
      .find('input[type="number"]')
      .first()
      .as("durationInput");

    cy.get("@durationInput").should("have.value", "60");
    cy.get("@durationInput").clear().type("72");
    cy.get("@durationInput").should("have.value", "72");

    cy.reload();
    cy.contains("button", "Lancer la simulation").click();
    cy.contains("label", "Durée (mois)")
      .parent()
      .find('input[type="number"]')
      .first()
      .should("have.value", "72");
  });
});
