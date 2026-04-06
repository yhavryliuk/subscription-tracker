describe("Landing page", () => {
  it("renders homepage and main call-to-action", () => {
    cy.visit("/");

    cy.contains("h1", "Manage subscriptions like a product metric").should(
      "be.visible",
    );
    cy.contains("a", "Try for free")
      .should("be.visible")
      .and("have.attr", "href", "/sign-up");
  });
});
